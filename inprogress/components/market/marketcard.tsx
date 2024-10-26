"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../ui/dialog";
import { Market } from "@/types/market";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import Options from "../options";
import { IncrementCounter } from "@/lib/fetchMarkets";
import { GetMarket } from "@/lib/fetchMarkets";

interface MarketCardProps {
  market: Market;
}

const MarketCard: React.FC<MarketCardProps> = ({ market: initialMarket }) => {
  if (!initialMarket) throw new Error("No initial market");
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [isOpenPredict, setIsOpenPredict] = useState(false);
  const [currentMarkets, setCurrentMarkets] = useState<Market | null>(
    initialMarket,
  );
  // Function to handle click and increment the counter
  const handleIncrement = async (marketId: number, optionId: number) => {
    try {
      // Fetch updated counters, volume, and percentages from the server action
      console.log(`${optionId}`);
      await IncrementCounter(marketId, optionId);
      const updatedMarket = await GetMarket();
      if (!updatedMarket) throw new Error("Market did not update");
      setCurrentMarkets(updatedMarket);
      console.log(updatedMarket);
    } catch (error) {
      console.log(error);
    }
  };
  const sortedOptions = currentMarkets?.predictionOptions.sort(
    (a, b) => b.optionsCount - a.optionsCount,
  );

  if (!sortedOptions) return;
  if (!currentMarkets) return;
  return (
    <>
      <Card className="flex border-black flex-col justify-between bg-secondaryBg text-textColor">
        <CardHeader className=" h-20 justify-items-center text-center text-lg font-bold">
          {currentMarkets.predictionMarket.title}
        </CardHeader>

        <CardContent key={currentMarkets.predictionMarket.title}>
          <Options market={currentMarkets} />

          <div className="flex items-center mt-2 justify-between text-sm text-textColor">
            <span>{currentMarkets.predictionMarket.volume} Votes So Far</span>
            <span>Ends in ...</span>
          </div>
        </CardContent>

        <CardFooter className="flex items-end space-x-2">
          <Button
            onClick={() => setIsOpenPredict(true)}
            className="relative flex-grow hover:bg-gradient-to-r hover:from-accentColor hover:via-[#4ade80] hover:to-accentColor text-black outline outline-black transition-transform hover:translate-y-[-5px] hover:text-white bg-white"
          >
            Predict
          </Button>
          <Button
            onClick={() => setIsOpenDetails(true)}
            className="  relative flex-grow bg-white text-black outline outline-black transition-transform hover:bg-gradient-to-r hover:from-[#4ade80] hover:via-accentColor hover:to-[#4ade80] hover:translate-y-[-5px]  hover:text-white "
          >
            Details
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isOpenPredict} onOpenChange={setIsOpenPredict}>
        <DialogContent className="border-accentColor justify-between max-w-xl bg-primaryBg flex flex-col text-textColor">
          <DialogHeader>
            <DialogTitle className="mb-3 mt-2 flex justify-center text-center text-4xl">
              {currentMarkets.predictionMarket.title}
            </DialogTitle>
            <DialogDescription className="text-center text-xl">
              {currentMarkets.predictionMarket.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="">
            {currentMarkets.predictionOptions.map((options) => {
              return (
                <Button
                  className="border-secondaryBg text-primaryBg text-md hover:text-textColor border bg-accentColor"
                  onClick={() => {
                    handleIncrement(options.marketId, options.optionId);
                    setIsOpenPredict(false);
                  }}
                  key={options.optionId}
                >
                  {options.predictionOption}
                </Button>
              );
            })}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isOpenDetails} onOpenChange={setIsOpenDetails}>
        <DialogContent className="border-accentColor bg-primaryBg items-center justify-between flex flex-col text-textColor">
          <DialogHeader className="text-accent-color mb-4 font-bold">
            <DialogTitle className="mb-3 mt-2 flex justify-center text-center text-4xl">
              {currentMarkets.predictionMarket.title}
            </DialogTitle>
            <DialogDescription className="text-center text-xl">
              <div className="mb-6">
                {currentMarkets.predictionMarket.description}
              </div>
            </DialogDescription>
          </DialogHeader>
          {sortedOptions.map((option) => (
            <div key={option.predictionOption} className="text-lg flex">
              <div className="mr-4 align-end"> {option.predictionOption}:</div>
              <div> {option.optionsCount} votes</div>
            </div>
          ))}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MarketCard;
