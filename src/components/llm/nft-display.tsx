import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

interface NFTDisplayProp {
  total_floor_price: number;
  name: string;
  description: string;
  icon: string;
}
type NFTDisplayProps = NFTDisplayProp[];

export function NFTDisplay({ nftDisplays }: { nftDisplays: NFTDisplayProps }) {
  return (
    <div className="grid grid-cols-3 gap-4 p-4 md:p-6 w-full">
      {nftDisplays.map(({ total_floor_price, name, description, icon }) => (
        <div
          key={name}
          className="relative group rounded-lg overflow-hidden cursor-pointer"
        >
          <img
            src={icon}
            alt="NFT Image"
            width={200}
            height={200}
            className="w-full h-full object-cover transition-all group-hover:scale-105"
          />
          <Dialog>
            <DialogTrigger asChild>
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-white text-center space-y-2">
                  <h3 className="text-2xl font-bold overflow-hidden overflow-ellipsis whitespace-nowrap max-w-full">
                    {name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    <EclipseIcon className="w-4 h-4" />
                    <span>{total_floor_price} ETH</span>
                  </div>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="bg-transparent p-0 max-w-[600px]">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={icon}
                  alt="NFT Image"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-white text-center space-y-4">
                    <h3 className="text-3xl font-bold">{name}</h3>
                    <p>{description}</p>
                    <div className="flex items-center gap-2 text-lg">
                      <EclipseIcon className="w-5 h-5" />
                      <span>{total_floor_price} ETH</span>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ))}
    </div>
  );
}

function EclipseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a7 7 0 1 0 10 10" />
    </svg>
  );
}

interface XIconProps {
  [key: string]: any;
}

function XIcon(props: XIconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
