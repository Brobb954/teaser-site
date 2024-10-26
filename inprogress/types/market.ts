export interface PredictionMarket {
  marketId: number;
  title: string;
  volume: number;
  description: string;
}

export interface PredictionOption {
  optionId: number;
  marketId: number;
  predictionOption: string;
  optionsCount: number;
}

export interface Market {
  predictionMarket: PredictionMarket;
  predictionOptions: PredictionOption[];
}

export interface ResponseMarket {
  Marketid: number;
  Title: string;
  Volume: number;
  Description: string;
}

export interface ResponseOptions {
  Optionid: number;
  Marketid: number;
  Optiontext: string;
  Optioncount: number;
}

export interface MarketResponse {
  Market: ResponseMarket;
  Options: ResponseOptions[];
}
