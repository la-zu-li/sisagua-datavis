import { BRAZILLIAN_STATES_LIST } from "./constants.js";

/** @type {MunicipalitiesGeoJSON[]} */
const raw_jsons = await Promise.all(
  BRAZILLIAN_STATES_LIST.map((name) => {
    /** @type {Promise<MunicipalitiesGeoJSON>}*/
    const json = window.d3.json(`data/${name}.min.json`);
    return json;
  }),
);

const allFeatureLists = raw_jsons.map((geojson) =>
  geojson.features.map(correctFeature),
);

export const stateGeoFeatures = Object.fromEntries(
  allFeatureLists.map((featureList, i) => [
    BRAZILLIAN_STATES_LIST[i],
    featureList,
  ]),
);

export const filteredGeoFeatures = allFeatureLists.flat();

export function filterGeoData(uf) {
  return stateGeoFeatures[uf];
}

function signedArea(ring) {
  let area = 0;

  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[i + 1];

    area += x1 * y2 - x2 * y1;
  }

  return area / 2;
}

function fixRing(ring, index) {
  const area = signedArea(ring);

  if ((index === 0 && area > 0) || (index > 0 && area < 0)) {
    return [...ring].reverse();
  }

  return ring;
}

/**
 * @param {import("geojson").Geometry} geometry
 * @returns {import("geojson").Geometry}
 */
function fixGeometry(geometry) {
  switch (geometry.type) {
    case "Polygon":
      return {
        ...geometry,
        coordinates: geometry.coordinates.map((ring, index) =>
          fixRing(ring, index),
        ),
      };

    case "MultiPolygon":
      return {
        ...geometry,
        coordinates: geometry.coordinates.map((polygon) =>
          polygon.map((ring, index) => fixRing(ring, index)),
        ),
      };

    default:
      return geometry;
  }
}

/**
 * @param {MunicipalityFeature} feature
 * @returns {MunicipalityFeature}
 */
function correctFeature(feature) {
  return {
    ...feature,
    properties: {
      ...feature.properties,
      GEOCODIGO_SHORT: feature.properties.GEOCODIGO.substring(0, 6),
    },
    geometry: fixGeometry(feature.geometry),
  };
}
