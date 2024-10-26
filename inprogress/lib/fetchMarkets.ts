import {
  Market,
  MarketResponse,
  PredictionMarket,
  PredictionOption,
  ResponseMarket,
  ResponseOptions,
} from "@/types/market";

export async function GetMarket(): Promise<undefined | Market> {
  const url = "http://localhost:8000/v1/market/0";
  return fetch(url, { cache: "no-store" })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network did not respond");
      }
      return response.json();
    })
    .then((data: MarketResponse) => {
      const { Market, Options } = data;

      const decodedMarket: ResponseMarket = {
        Marketid: Market.Marketid,
        Title: Market.Title,
        Volume: Market.Volume,
        Description: Market.Description,
      };

      const decodedOptions: ResponseOptions[] = Options.map((option) => ({
        Optionid: option.Optionid,
        Marketid: option.Marketid,
        Optiontext: option.Optiontext,
        Optioncount: option.Optioncount,
      }));
      decodedOptions.sort((a, b) => a.Optionid - b.Optionid);
      console.log(decodedOptions);
      const predictionMarket: PredictionMarket = {
        marketId: decodedMarket.Marketid,
        title: decodedMarket.Title,
        volume: decodedMarket.Volume,
        description: decodedMarket.Description,
      };

      const predictionOption: PredictionOption[] = decodedOptions.map(
        (options) => ({
          optionId: options.Optionid,
          marketId: options.Marketid,
          predictionOption: options.Optiontext,
          optionsCount: options.Optioncount,
        }),
      );
      const market: Market = {
        predictionMarket: predictionMarket,
        predictionOptions: predictionOption,
      };
      return market;
    })
    .catch((err) => {
      console.log(`err in fetch ${err}`);
      return undefined;
    });
}

export async function IncrementCounter(marketId: number, optionsId: number) {
  const url = `http://localhost:8000/v1/market/${marketId}/option/${optionsId}`;
  return fetch(url, { method: "PATCH" }).then((response) => {
    if (!response.ok) {
      throw new Error("Incrementing did not work");
    }
  });
}

// {"Market":
//{"Marketid":0,
//"Title":{"String":"Countdown to Launch: Make Your Prediction","Valid":true},
//"Volume":1,
//"Description":"Help us kickstart our journey! Guess when our site will launch and be part of our story from the beginning."},

//"Options":
//[{"Optiontext":"1 to 2 Weeks", "Optioncount":0},
//{"Optiontext":"3 to 6 Weeks","Optioncount":0},
//{"Optiontext":"2 to 6 Months","Optioncount":1},
//{"Optiontext":"Never","Optioncount":0}]}"""
