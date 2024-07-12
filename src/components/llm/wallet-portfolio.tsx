
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

export function WalletPortfolio() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cryptocurrency Holdings</CardTitle>
        <CardDescription>Wallet Address: 0x123456789abcdef0123456789abcdef01234567</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cryptocurrency</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Bitcoin (BTC)</TableCell>
              <TableCell className="text-right">2.45</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Ethereum (ETH)</TableCell>
              <TableCell className="text-right">5.12</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Litecoin (LTC)</TableCell>
              <TableCell className="text-right">10.78</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Ripple (XRP)</TableCell>
              <TableCell className="text-right">500.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Dogecoin (DOGE)</TableCell>
              <TableCell className="text-right">1000.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="border-t border-muted/40 pt-4 mt-4">
          <div className="flex justify-between items-center">
            <div className="font-medium">Total</div>
            <div className="text-right font-medium">1518.35</div>
          </div>
          <div className="flex justify-between items-center text-muted-foreground text-sm">
            <div>Amount changed</div>
            <div className="text-right">+$50.00 (3.4%)</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
