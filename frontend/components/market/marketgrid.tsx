"use client";

import { Market } from "@/types/market";
import React from "react";
import MarketCard from "./marketcard";

interface MarketsGridProps {
  market: Market;
}

const MarketsGrid: React.FC<MarketsGridProps> = ({ market }) => {
  console.log("MarketsGrid");
  console.log(market);
  if (market.predictionOptions.length === 0) {
    return <div className="text-center text-gray-400">No markets found.</div>;
  }

  return (
    <div className="flex justify-center">
      <div className="">
        <MarketCard key={market.predictionMarket.marketId} market={market} />
      </div>
    </div>
  );
};

export default MarketsGrid;
