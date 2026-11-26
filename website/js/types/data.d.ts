declare global {
  interface Sample {
    "ID da amostra": string | number;
    "Região Geográfica": string;
    UF: State;
    "Regional de Saúde": string;
    Município: string;
    "Código IBGE": string;
    "Motivo da coleta": "Rotina" | "Denúncia" | "Surto" | "Desastre";
    "Tipo da Forma de Abastecimento": "SAI" | "SAC" | "SAA";
    "Nome da Forma de Abastecimento": string;
    "Data da Coleta": string | Date;
    "Procedência da Coleta": string;
    Zona: string;
    "Categoria Área": string;
    Área: string;
  }
}

export {};
