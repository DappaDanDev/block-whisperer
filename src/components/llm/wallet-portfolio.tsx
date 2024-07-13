import{ 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface WalletPortfolioProps {
  data: {
    [cryptocurrency: string]: number;
  };
  walletAddress: string;
  totalPositions: number;
  absoluteChange1d: number;
  percentChange1d: number;
}

export function WalletPortfolioCard({
  data,
  totalPositions = 5,
  absoluteChange1d = 50.0,
  percentChange1d = 3.4,
  walletAddress = "0x123456789abcdef0123456789abcdef01234567",
}: WalletPortfolioProps) {
  const dataArray = Object.entries(data).map(([cryptocurrency, amount]) => ({
    cryptocurrency,
    amount,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cryptocurrency Holdings</CardTitle>
        <CardDescription>Wallet Address: {walletAddress} </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap text-2xl font-bold leading-none tracking-tight">
                Crypto Portfolio
              </TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataArray.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">
                  {item.cryptocurrency}
                </TableCell>
                <TableCell className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right">
                  {" "}
                  {item.amount === undefined
                    ? "N/A"
                    : Math.abs(item.amount) < 1e-7 ||
                      Math.abs(item.amount) > 1e7
                    ? item.amount.toExponential(2)
                    : item.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="border-t border-muted/40 pt-4 mt-4">
          <div className="flex justify-between items-center">
            <div className="font-medium">Total</div>
            <div className="text-right font-medium">
              {totalPositions.toFixed(2)}
            </div>
          </div>
          <div className="flex justify-between items-center text-muted-foreground text-sm">
            <div>Amount changed</div>
            <div className="text-right">
              {absoluteChange1d.toFixed(2)} USD ({percentChange1d.toFixed(2)}%)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
