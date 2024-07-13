import { Card, CardHeader, CardContent } from "@/components/ui/card"

interface TransactionCardProp {
  operation_type: string;
  name: string;
  symbol: string;
  icon: string;
  id: string;
  numeric: string;
  sender: string;
  recipient: string;
}

type TransactionCardProps = TransactionCardProp[];


export function TranscastionCard({transactions }: { transactions: TransactionCardProps }) {
  return (
    <div className="grid grid-cols-3 gap-4 p-4 md:p-6 w-full">

    {transactions.map(({ operation_type, name, symbol, icon, id, numeric, sender, recipient }: TransactionCardProp) => (

    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-medium">Transaction Receipt</div>
          <div className="flex items-center gap-2">
            <div className="bg-muted rounded-md flex items-center justify-center aspect-square w-8">
              <img src={icon} alt="Ethereum" className="h-4 w-4" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Transaction Type</div>
            <div className="text-lg font-semibold">{operation_type}</div>
          </div>
          <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-medium">{symbol} - {id}</div>
        </div>
        <div>
          <div className="text-sm font-medium text-muted-foreground">Sender</div>
          <div className="flex items-center gap-2">
            <div className="bg-muted rounded-md flex items-center justify-center aspect-square w-8">
              <img src="/placeholder.svg" alt="User" className="h-4 w-4" />
            </div>
            <div className="text-sm font-medium truncate">{sender}</div>
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-muted-foreground">Recipient</div>
          <div className="flex items-center gap-2">
            <div className="bg-muted rounded-md flex items-center justify-center aspect-square w-8">
              <img src="/placeholder.svg" alt="User" className="h-4 w-4" />
            </div>
            <div className="text-sm font-medium truncate">{recipient}</div>
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-muted-foreground">Amount</div>
          <div className="text-lg font-semibold">{numeric}</div>
        </div>
        <div>
          <div className="text-sm font-medium text-muted-foreground">Token</div>
          <div className="text-sm font-medium truncate">
            {name}
          </div>
        </div>
      </CardContent>
    </Card>
  )
)}
</div>
  )}
