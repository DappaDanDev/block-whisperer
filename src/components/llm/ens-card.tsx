
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface ENSCardProps {
  image: string;
  name: string;
  address: string;
}

export function ENSCard({
  image = "/placeholder-user.jpg",
  name = "Olivia Davis",
  address = "0x123456789abcdef0123456789abcdef01234567",
}: ENSCardProps) {
  return (
    <div className="flex items-center justify-between bg-background px-4 py-3 rounded-lg border">
      <div className="flex items-center gap-4">
        <Avatar className="w-12 h-12 border">
          <AvatarImage src={image} />
          <AvatarFallback>{name}</AvatarFallback>
        </Avatar>
        <div className="grid gap-1">
          <div className="text-xl font-bold text-foreground">{name}</div>
          <div className="text-sm text-muted-foreground">{address}</div>
        </div>
      </div>
    </div>
  )
}
