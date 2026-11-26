export const options = {
  config: {},
  view: {
    renderer: "canvas",
  },
};

window.vl.register(window.vega, window.vegaLite, options);

export const vl = window.vl;
