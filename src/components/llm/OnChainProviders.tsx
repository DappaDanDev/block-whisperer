import { ReactNode } from 'react';
import { base } from 'viem/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { Avatar, Identity, Name, Badge, Address } from '@coinbase/onchainkit/identity';
 
type Props = { children: ReactNode, address:typeof Address };
 
export default function OnchainProviders({ children }: Props) {
    const address= '0x123456';
  return (
    <OnchainKitProvider
      apiKey={process.env.PUBLIC_ONCHAINKIT_API_KEY} 
      chain={base}
    >
      <Address address={address}/>
      
    </OnchainKitProvider>
  );
};
 
