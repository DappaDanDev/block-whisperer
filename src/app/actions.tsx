"use server";

import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { CoreMessage, ToolInvocation } from "ai";
import React, { ReactNode } from "react";
import { azure } from "@ai-sdk/azure";
import { BotCard, BotMessage } from "@/components/llm/message";
import { Loader2 } from "lucide-react";
import { symbol, z } from "zod";
// import {MainClient } from 'binance';
import { env } from "@/env";
import { sleep } from "@/lib/utils";
import { Stats } from "@/components/llm/stats";
import { StatsSkeleton } from "@/components/llm/stats-skeleton";
import { normalize } from 'viem/ens'
import { publicClient } from './client'
import { Address } from '@coinbase/onchainkit/identity';



// const binance = new MainClient({
//     api_key: env.BINANCE_API_KEY,
//     api_secret: env.BINANCE_API_SECRET,
// })

// this is the system message

const content = `\
You are a cytpto bot. You can get information about a wallet address that is on the blockchain\

Message inside [] means that is is a UI element or user event.  For example 
- "[Wallet address = 0x123456]" means that the interface of the wallet address is shown to the user. 
 - "[Price of BTC = 98989]" means that the interface of the cryptocurrency price of BTC is shown to the user. 
 - "[Stats of BTC]"  meanse that the interface of the cryptocurrency stats of BTC is shown to the user. 


 If the user wants the wallet of an ENS, call the \`get_address\` function to show the ENS.
 If the user provides a wallet address, call the \`get_NFTS\` function to show the NFTs of the wallet address.
 If the user wants the market cap or stats of a given cryptocurrency ca call, \`get_crypto_stats\` to show the stats. 
 if the user wants a stock price, you should respond that you are a demo and cannot do that. 
 If the user wants anything else unrelated to the the function calls \`get_crypto_price\` and \`get_crypto_stats\` you should respond that you are a demo and cannot do that.

`;

export const sendMessage = async (
  message: string
): Promise<{
  id: number;
  role: "user" | "assistant";
  display: ReactNode;
}> => {
  const history = getMutableAIState<typeof AI>();

  history.update([
    ...history.get(),
    {
      role: "user",
      content: message,
    },
  ]);

  const reply = await streamUI({
    model: azure("dappa-ai"),
    messages: [
      {
        role: "system",
        content,
        toolInvocations: [],
      },
      ...history.get(),
    ] as CoreMessage[],
    initial: (
      <BotMessage className="items-center flex shrink-0 select-none justify-center">
        <Loader2 className="w-5 animate-spin stroke-zinc-900" />
      </BotMessage>
    ),
    text: ({ content, done }) => {
      if (done)
        history.done([...history.get(), { role: "assistant", content }]);
      return <BotMessage>{content}</BotMessage>;
    },
    temperature: 0,
    tools: {
      //record<string>
      get_crypto_price: {
        description:
          "Get the current price of a given cryptocurrency. Use this to show the prive to the user",
        parameters: z.object({
          symbol: z
            .string()
            .describe(
              "The symbol of the cryptocurrency to get the price of. For example, BTC, ETH, DOGE, etc."
            ),
        }),
        generate: async function* ({ symbol }: { symbol: string }) {
          console.log({ symbol });
          yield <BotCard><StatsSkeleton/></BotCard>;

          return null;
        },
      },
      get_address: {
        description:
          "Get the wallet address of a given ENS. Use this to show the wallet address to the user",
        parameters: z.object({
          ens: z
            .string()
            .describe(
              "The ENS name to get the wallet address of. For example, ethereum.eth, bitcoin.eth, etc."
            ),
        }),
        generate: async function* ({ ens }: { ens: string }) {
          console.log({ ens });
          yield <BotCard>Loading...</BotCard>;
        const ensAddress = await publicClient.getEnsAddress({
            name: normalize(ens)
        })


          return  (
            <Address address={ensAddress} />
          )
      
        },
      },




      get_crypto_stats: {
        description:
          "Get the market states of a given cryptocurrency. Use this to show the stats to the user",
        parameters: z.object({
          slug: z
            .string()
            .describe(
              "The name of the cryptocurrency in lowercase, eg bitcoin, ethereum, dogecoin, etc."
            ),
        }),
        generate: async function* ({ slug }: { slug: string }) {
          yield <BotCard>Loading...</BotCard>;

          const url = new URL(
            `https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail`
          );

          url.searchParams.append("slug", slug);
          url.searchParams.append("limit", "1");
          url.searchParams.append("sortBy", "market_cap");

          const response = await fetch(url, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            history.done([
              ...history.get(),
              {
                role: "assistant",
                name: "get_crypto_stats",
                content: `Crypto not found!`,
              },
            ]);

            return <BotMessage>Crypto not found!</BotMessage>;
          }

          const json = (await response.json()) as {
            data: {
              id: number;
              name: string;
              symbol: string;
              volume: number;
              volumeChangePercentage24h: number;
              statistics: {
                rank: number;
                totalSupply: number;
                marketCap: number;
                marketCapDominance: number;
              };
            };
          };

          const data = json.data;
          const stats = json.data.statistics;

          const marketStats = {
            name: data.name,
            volume: data.volume,
            volumeChangePercentage24h: data.volumeChangePercentage24h,
            rank: stats.rank,
            marketCap: stats.marketCap,
            totalSupply: stats.totalSupply,
            dominance: stats.marketCapDominance,
          };

          await sleep(1000);

          history.done([
            ...history.get(),
            {
              role: "assistant",
              name: "get_crypto_stats",
              content: `[Stats of ${data.symbol}]`,
            },
          ]);

          return (
            <BotCard>
              <Stats {...marketStats} />
            </BotCard>
          );
        },
      },
    },
  });

  return {
    id: Date.now(),
    role: "assistant",
    display: reply.value,
  };
};

export type AIState = Array<{
  id?: number;
  name?: "get_crypto_price" | "get_crypto_stats";
  role: "user" | "assistant" | "system";
  content: string;
}>;

export type UIState = Array<{
  id: number;
  role: "user" | "assistant";
  display: ReactNode;
  toolInvocations?: ToolInvocation[];
}>;

export const AI = createAI({
  initialAIState: [] as AIState,
  initialUIState: [] as UIState,
  actions: {
    sendMessage,
  },
});
