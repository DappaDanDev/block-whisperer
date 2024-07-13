
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"

interface SocialCardProps {
  image: string;
  name: string;
  description?: string;
  twitter?: string;
  discord?: string;
  github?: string;
}

export function SocialCard({
  image = "/placeholder-user.jpg",
  twitter = "https://twitter.com/",
  name = "Olivia Davis",
  description = "Software Engineer",
  discord = "https://discord.com/",
  github = "http://github.com"
}: SocialCardProps) {  

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div className="relative h-32 bg-gradient-to-r from-[#1DA1F2] to-[#1b95e0] rounded-t-lg">
        <Avatar className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 ring-4 ring-background">
        <AvatarImage src={image ? (image.startsWith('ipfs://') ? `https://${image.replace('ipfs://', 'ipfs.io/ipfs/')}` : (image.startsWith('https://') ? image : (image.startsWith('https://euc.li/') ? image : `https://euc.li/${image}`))) : ''}/>
        </Avatar>
      </div>
      <CardContent className="pt-10 pb-4 px-4 grid gap-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex justify-center gap-4">
        {twitter && (
          <Link href={twitter ? `https://twitter.com/${twitter}` : ''} className="text-[#1DA1F2] hover:underline" prefetch={false}>
<TwitterIcon className="w-6 h-6" />
  </Link>
)}
{discord && (
  <Link href={`https://discordapp.com/users/${discord}`} className="text-[#5865F2] hover:underline" prefetch={false}>
    <DiscIcon className="w-6 h-6" />
  </Link>
)}
{github && (
  <Link href={`https://github.com/${github}`} className="text-[#24292F] hover:underline" prefetch={false}>
    <GithubIcon className="w-6 h-6" />
  </Link>
)}

        </div>
      </CardContent>
    </Card>
  )
}

interface DiscIconProps extends React.SVGProps<SVGSVGElement> {}

function DiscIcon(props: DiscIconProps) {
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
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}


interface GithubIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  width?: number;
  height?: number;
}

function GithubIcon(props: GithubIconProps) {
  const { className, width = 24, height = 24 } = props;
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g>
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </g>
    </svg>
  );
}


interface TwitterIconProps extends React.SVGProps<SVGSVGElement> {}

function TwitterIcon(props: TwitterIconProps) {
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
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
}


interface XIconProps extends React.SVGProps<SVGSVGElement> {}

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
  )
}
