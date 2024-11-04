export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader } from "../components/ui/card";
import MarketsGrid from "../components/market/marketgrid";
import { GetMarket } from "@/lib/fetchMarkets";

export default async function MarketContent() {
  const initialData = await GetMarket();
  if (!initialData) {
    return (
      <main className="container mx-auto min-h-screen bg-primaryBg px-4 py-10">
        <div>Unable to load market data. Please try again later.</div>
      </main>
    );
  }
  console.log(initialData);

  return (
    <main className="container mx-auto min-h-screen bg-primaryBg px-4 py-10">
      <section className="mb-16 text-center">
        <Card className="mt-10 border-transparent mb-16 bg-secondaryBg text-textColor">
          <CardHeader className="inline-block">
            <div className="inline-block min-w-fit bg-gradient-to-r from-accentColor via-[#4ade80] to-accentColor bg-clip-text text-6xl text-transparent">
              Welcome to SolMarket
            </div>
          </CardHeader>
          <CardContent>
            We are currently in progress but feel free to get a taste of what is
            to come below
          </CardContent>
        </Card>
        <div className="flex-1">
          <MarketsGrid market={initialData} />
        </div>
      </section>
    </main>
  );
}
