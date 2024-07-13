import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

interface NFTDisplayProps {
  total_floor_price: number;
  name: string;
  description: string;
  icon: string;
}

export function NFTDisplay() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 md:p-6">
      <div className="relative group rounded-lg overflow-hidden cursor-pointer">
        <img
          src="/placeholder.svg"
          alt="NFT Image"
          width={400}
          height={400}
          className="w-full h-full object-cover transition-all group-hover:scale-105"
        />
        <Dialog>
          <DialogTrigger asChild>
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="text-white text-center space-y-2">
                <h3 className="text-2xl font-bold">Cosmic Pixel</h3>
                <p className="text-sm">Unique digital artwork</p>
                <div className="flex items-center gap-2 text-sm">
                  <EclipseIcon className="w-4 h-4" />
                  <span>0.5 ETH</span>
                </div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="bg-transparent p-0 max-w-[600px]">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src="/placeholder.svg"
                alt="NFT Image"
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-center space-y-4">
                  <h3 className="text-3xl font-bold">Cosmic Pixel</h3>
                  <p>
                    Explore the depths of the cosmos with this unique digital
                    artwork. Each pixel is a window into a world of
                    possibilities.
                  </p>
                  <div className="flex items-center gap-2 text-lg">
                    <EclipseIcon className="w-5 h-5" />
                    <span>0.5 ETH</span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative group rounded-lg overflow-hidden cursor-pointer">
        <img
          src="/placeholder.svg"
          alt="NFT Image"
          width={400}
          height={400}
          className="w-full h-full object-cover transition-all group-hover:scale-105"
        />
        <Dialog>
          <DialogTrigger asChild>
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="text-white text-center space-y-2">
                <h3 className="text-2xl font-bold">Neon Dreamscape</h3>
                <p className="text-sm">Vibrant digital art</p>
                <div className="flex items-center gap-2 text-sm">
                  <EclipseIcon className="w-4 h-4" />
                  <span>0.3 ETH</span>
                </div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="bg-transparent p-0 max-w-[600px]">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src="/placeholder.svg"
                alt="NFT Image"
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-center space-y-4">
                  <h3 className="text-3xl font-bold">Neon Dreamscape</h3>
                  <p>
                    Immerse yourself in a vibrant digital world of neon
                    landscapes and futuristic elements.
                  </p>
                  <div className="flex items-center gap-2 text-lg">
                    <EclipseIcon className="w-5 h-5" />
                    <span>0.3 ETH</span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative group rounded-lg overflow-hidden cursor-pointer">
        <img
          src="/placeholder.svg"
          alt="NFT Image"
          width={400}
          height={400}
          className="w-full h-full object-cover transition-all group-hover:scale-105"
        />
        <Dialog>
          <DialogTrigger asChild>
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="text-white text-center space-y-2">
                <h3 className="text-2xl font-bold">Ethereal Bloom</h3>
                <p className="text-sm">Delicate digital flowers</p>
                <div className="flex items-center gap-2 text-sm">
                  <EclipseIcon className="w-4 h-4" />
                  <span>0.7 ETH</span>
                </div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="bg-transparent p-0 max-w-[600px]">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src="/placeholder.svg"
                alt="NFT Image"
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-center space-y-4">
                  <h3 className="text-3xl font-bold">Ethereal Bloom</h3>
                  <p>
                    Discover the delicate beauty of digital flowers in this
                    captivating NFT. Each petal is a unique work of art.
                  </p>
                  <div className="flex items-center gap-2 text-lg">
                    <EclipseIcon className="w-5 h-5" />
                    <span>0.7 ETH</span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative group rounded-lg overflow-hidden cursor-pointer">
        <img
          src="/placeholder.svg"
          alt="NFT Image"
          width={400}
          height={400}
          className="w-full h-full object-cover transition-all group-hover:scale-105"
        />
        <Dialog>
          <DialogTrigger asChild>
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="text-white text-center space-y-2">
                <h3 className="text-2xl font-bold">Fractured Dimension</h3>
                <p className="text-sm">Abstract digital art</p>
                <div className="flex items-center gap-2 text-sm">
                  <EclipseIcon className="w-4 h-4" />
                  <span>0.9 ETH</span>
                </div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="bg-transparent p-0 max-w-[600px]">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src="/placeholder.svg"
                alt="NFT Image"
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-center space-y-4">
                  <h3 className="text-3xl font-bold">Fractured Dimension</h3>
                  <p>
                    Explore the boundaries of reality with this abstract digital
                    artwork, where fragments of the universe collide and create
                    a mesmerizing visual experience.
                  </p>
                  <div className="flex items-center gap-2 text-lg">
                    <EclipseIcon className="w-5 h-5" />
                    <span>0.9 ETH</span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
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
