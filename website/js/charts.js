import { filteredGeoFeatures } from "./geodata.js";
import { vl } from "./vega-config.js";
import { aggDataFormaAbastecimento } from "./data.js";

export function tipoDeAbastecimentoChart() {
  const tipoAbastecimento = vl
    .param("tipoAbastecimento")
    .value("SAA")
    .bind({
      input: "select",
      options: ["SAA", "SAI", "SAC"],
      name: "Forma de abastecimento: ",
    });

  const map = vl
    .markGeoshape({
      stroke: "white",
      strokeWidth: 0.3,
    })
    .data(filteredGeoFeatures)

    .transform(
      vl
        .lookup("properties.GEOCODIGO_SHORT")
        .from(
          vl
            .data(aggDataFormaAbastecimento)
            .key("geocodigo")
            .fields(["SAA", "SAI", "SAC"]),
        )
        .as(["SAA", "SAI", "SAC"]),

      vl.calculate("datum[tipoAbastecimento]").as("quantidade"),
    )

    .params(tipoAbastecimento)

    .encode(
      vl.shape().field("geometry").type("geojson"),

      vl
        .color()
        .field("quantidade")
        .type("quantitative")
        .scale({ scheme: "blues" })
        .legend({ title: "Número de amostras" }),

      vl.tooltip([
        { field: "properties.NOME", title: "Município" },
        { field: "SAA", title: "Amostras SAA" },
        { field: "SAI", title: "Amostras SAI" },
        { field: "SAC", title: "Amostras SAC" },
      ]),
    );

  return map
    .project(vl.projection("mercator").fit(aggDataFormaAbastecimento))
    .width(600)
    .height(600);
}
