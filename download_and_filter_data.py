import zipfile
from pathlib import Path
from urllib.request import urlretrieve

import duckdb
import pandas as pd

DATASET_URL = (
    "https://s3.sa-east-1.amazonaws.com/ckan.saude.gov.br/"
    + "SISAGUA/vigilancia_demais_parametros_csv.zip"
)
BASE_FOLDER = Path("tmp")
ZIP_PATH = BASE_FOLDER / "vigilancia_demais_parametros.zip"
CSV_PATH = ZIP_PATH.with_suffix(".csv")


BASE_FOLDER.mkdir(exist_ok=True)
print("Downloading file...")
urlretrieve(DATASET_URL, ZIP_PATH)

print("Extracting...")
with zipfile.ZipFile(ZIP_PATH, "r") as zip_ref:
    zip_ref.extractall(BASE_FOLDER)


DB = f"""
read_csv(
        '{CSV_PATH}',
        encoding='cp1252',
        delim=';',
        header=true,
    )
"""

SAMPLE_COLUMNS = [
    "Número da amostra",
    "Região Geográfica",
    "UF",
    "Regional de Saúde",
    "Município",
    "Motivo da coleta",
    "Tipo da Forma de Abastecimento",
    "Nome da Forma de Abastecimento",
    "Data da Coleta",
    "Procedência da Coleta",
    "Zona",
    "Categoria Área",
    "Área",
]

ANALYSIS_COLUMNS = [
    "Grupo de parâmetros",
    "Parâmetro (demais parâmetros)",
    "LD",
    "LQ",
    "Resultado",
]

ALL_COLUMNS = SAMPLE_COLUMNS + ANALYSIS_COLUMNS


def run_and_validate_query(query: str) -> pd.DataFrame:
    result = duckdb.sql(query)
    assert result is not None, "Query failed to execute."
    return result.df()


def filter_data(db):
    print("Filtering data...")
    query = f"""
        SELECT {", ".join([f'"{c}"' for c in  ALL_COLUMNS])}

        FROM {db}
    """
    return run_and_validate_query(query)


def get_parameters(db):
    print("Getting parameters summary...")
    return run_and_validate_query(f"""
    SELECT 
        "Grupo de parâmetros",
        "Parâmetro (demais parâmetros)",
        COUNT(*) AS "Número de registros"
    FROM "{db}"
    GROUP BY
        "Grupo de parâmetros",
        "Parâmetro (demais parâmetros)"
    ORDER BY
        "Grupo de parâmetros",
        "Parâmetro (demais parâmetros)"
    """)


def separate_samples_and_analyses(data: pd.DataFrame):
    print("Separating samples and analyses...")

    samples = data[SAMPLE_COLUMNS].drop_duplicates().copy()
    samples.insert(0, "ID da amostra", range(1, len(samples) + 1))

    analyses = data.merge(
        samples,
        on=SAMPLE_COLUMNS,
        how="left",
        validate="many_to_one",
    )
    samples = samples.drop(columns=["Número da amostra"])
    analyses.insert(
        0,
        "ID da leitura",
        range(1, len(analyses) + 1),
    )
    analyses = analyses[["ID da leitura", "ID da amostra", *ANALYSIS_COLUMNS]]

    return samples, analyses


data = filter_data(DB)

print("Saving filtered data...")
filtered_csv_path = CSV_PATH.with_suffix(".filtered.csv")
data.drop("Número da amostra", axis=1).to_csv(
    filtered_csv_path,
    index=False,
    sep=";",
    encoding="utf-8",
)

parameters = get_parameters(filtered_csv_path)

print("Saving parameters summary...")
parameters_csv_path = CSV_PATH.with_name("parameters.csv")
parameters.to_csv(
    parameters_csv_path,
    index=False,
    sep=";",
    encoding="utf-8",
)

samples, analyses = separate_samples_and_analyses(data)

samples_csv_path = CSV_PATH.with_name("split_amostras.csv")
analyses_csv_path = CSV_PATH.with_name("split_leituras.csv")
samples.to_csv(samples_csv_path, index=False, sep=";", encoding="utf-8")
analyses.to_csv(analyses_csv_path, index=False, sep=";", encoding="utf-8")


ZIP_PATH.unlink(missing_ok=True)
CSV_PATH.unlink(missing_ok=True)

print("Filtered data saved to:", filtered_csv_path.absolute())
print("Parameters summary saved to:", parameters_csv_path.absolute())
print("Split water samples data was saved to:", samples_csv_path.absolute())
print("Split individual analysis data was saved to:", analyses_csv_path.absolute())
