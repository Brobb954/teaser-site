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
import { GetMarket, IncrementCounter } from "@/lib/fetchMarkets";

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
      console.log(`Incrementing option ${optionId} for market ${marketId}`);

      // Try the increment
      try {
        await IncrementCounter(marketId, optionId);
      } catch (error) {
        console.error("PATCH request failed:", error);
        throw error; // Re-throw to prevent the GET request if PATCH fails
      }

      // If increment succeeds, try to get updated data
      const updatedMarket = await GetMarket();
      if (!updatedMarket) {
        throw new Error("Failed to fetch updated market data");
      }

      setCurrentMarkets(updatedMarket);
      console.log("Successfully updated market:", updatedMarket);
    } catch (error) {
      console.error("Complete operation failed:", error);
      // You might want to show an error message to the user here
    }
  };
  const sortedOptions = [...(currentMarkets?.predictionOptions || [])].sort(
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
