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

print("Filtering data...")
query = duckdb.sql(f"""
    SELECT 
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
        "Grupo de parâmetros",
        "Parâmetro (demais parâmetros)",
        "LD",
        "LQ",
        "Resultado",
    FROM {DB}
""")

assert query is not None, "Query failed to execute."
data: pd.DataFrame = query.df()


print("Saving filtered data...")
filtered_csv_path = CSV_PATH.with_suffix(".filtered.csv")
data.to_csv(
    filtered_csv_path,
    index=False,
    sep=";",
    encoding="utf-8",
)

ZIP_PATH.unlink(missing_ok=True)
CSV_PATH.unlink(missing_ok=True)

print("Filtered data saved to:", filtered_csv_path.absolute())
