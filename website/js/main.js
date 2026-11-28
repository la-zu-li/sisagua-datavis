import { filterSamples, setAggDataFormaAbastecimento } from "./data.js";
import { tipoDeAbastecimentoChart } from "./charts.js";
import { options } from "./vega-config.js";
import { filterGeoData } from "./geodata.js";
const colors = [
  "#03045e",
  "#262d79",
  "#475492",
  "#677bab",
  "#88a2c4",
  "#a9c9dd",
  "#caf0f6",
];
let current = 0;

function cycleColorAndReturn() {
  current = (current + 1) % colors.length;
  return colors[current];
}

const aguaTexts = document.querySelectorAll(".agua");

aguaTexts.forEach((element) =>
  element.addEventListener("click", (e) => {
    const color = cycleColorAndReturn();
    if (e.target instanceof HTMLElement) {
      e.target.style.backgroundColor = color;
    }
  }),
);

filterSamples("CE", "2025", "2027");
setAggDataFormaAbastecimento();
filterGeoData("CE");
const chartSpec = tipoDeAbastecimentoChart().toSpec();

window
  .vegaEmbed("#chart", chartSpec, options)
  .then((result) => {
    console.log("CHART LOADED!");
    console.log(result);
  })
  .catch(console.error);
