import { Card, CardContent, CardHeader } from "../components/ui/card";
import MarketsGrid from "../components/market/marketgrid";
import { GetMarket } from "@/lib/fetchMarkets";

export default async function Home() {
  const marketData = await GetMarket();
  // console.log(marketData);
  if (!marketData) throw new Error();

  return (
    <main className="container mx-auto min-h-screen bg-primaryBg px-4 py-10">
      <section className="mb-16 text-center">
        <Card className="mt-10 border-transparent mb-16 bg-secondaryBg text-textColor">
          <CardHeader className="inline-block">
            <p className="inline-block min-w-fit bg-gradient-to-r from-accentColor via-[#4ade80] to-accentColor bg-clip-text text-6xl text-transparent">
              Welcome to SolMarket
            </p>
          </CardHeader>
          <CardContent>
            We are currently in progress but feel free to get a taste of what is
            to come below
          </CardContent>
        </Card>
        <div className="flex-1">
          <MarketsGrid market={marketData} />
        </div>
      </section>
    </main>
  );
}
