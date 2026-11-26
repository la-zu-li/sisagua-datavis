import type { Feature, FeatureCollection, Geometry } from "geojson";
import { BRAZILLIAN_STATES_LIST } from "../constants.js";

declare global {
  type MunicipalityProperties = {
    GEOCODIGO: string;
    GEOCODIGO_SHORT: string?;
    NOME: string;
    UF: string;
  };

  type MunicipalityFeature = Feature<Geometry, MunicipalityProperties>;

  type MunicipalitiesGeoJSON = FeatureCollection<
    Geometry,
    MunicipalityProperties
  >;

  type State = (typeof BRAZILLIAN_STATES_LIST)[number];
}
export {};
