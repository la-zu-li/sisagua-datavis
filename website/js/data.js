/**@type {Sample[]} */
// @ts-ignore
const sampleData = await d3.csv("data/split_amostras.csv");
export let filteredSampleData = sampleData;

function countFormaAbastecimento() {
  const municipios = new Map();

  filteredSampleData.forEach((d) => {
    const geocodigo = d["Código IBGE"];
    const tipo = d["Tipo da Forma de Abastecimento"];

    if (!municipios.has(geocodigo)) {
      municipios.set(geocodigo, {
        geocodigo,
        SAA: 0,
        SAI: 0,
        SAC: 0,
      });
    }

    municipios.get(geocodigo)[tipo]++;

    // console.log(municipios.get(geocodigo));
  });
  return Array.from(municipios.values());
}

export let aggDataFormaAbastecimento = countFormaAbastecimento();

export function setAggDataFormaAbastecimento() {
  return (aggDataFormaAbastecimento = countFormaAbastecimento());
}

export function filterSamples(uf, dateStart, dateEnd) {
  return (filteredSampleData = sampleData
    .filter((d) => d.UF == uf)
    .filter((d) => d["Data da Coleta"] <= new Date(dateEnd))
    .filter((d) => d["Data da Coleta"] >= new Date(dateStart)));
}
