import type * as D3 from "d3";
import type * as Vega from "vega";
import type * as VegaLite from "vega-lite";

declare global {
  interface Window {
    d3: typeof D3;
    vega: typeof Vega;
    vegaLite: typeof VegaLite;
    vl: any;
    vegaTooltip: any;
    vegaEmbed: any;
  }
}

export {};
