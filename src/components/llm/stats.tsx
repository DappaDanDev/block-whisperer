import { Card } from "@/components/ui/card";

interface StatsProps {
  name: string;
  volume: number;
  volumeChangePercentage24h: number;
  rank: number;
  marketCap: number;
  totalSupply: number;
  dominance: number;
}
//2:35

export function Stats({
  name = "Bitcoin",
  volume = 32.4343,
  volumeChangePercentage24h = 2.5,
  rank = 1,
  marketCap = 13000043,
  totalSupply = 210000,
  dominance = 40.2,
}) {
  return (
    <Card className="bg-background rounded-lg border border-muted p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-bold">{name}</h2>
            <p className="text-sm text-muted-foreground">Rank #{rank}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Volume</p>
          <p className="text-lg font-bold">{volume}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Volume Change</p>
          <p className="">{volumeChangePercentage24h}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Market Cap</p>
          <p className="text-lg font-bold">{marketCap}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Supply</p>
          <p className="text-lg font-bold">{totalSupply.toFixed(0)}</p>
        </div>
        <div className="col-span-2">
          <p className="text-sm text-muted-foreground">Dominance</p>
          <p className="text-lg font-bold">{dominance}</p>
        </div>
      </div>
    </Card>
  );
}
