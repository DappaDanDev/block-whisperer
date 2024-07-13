"use server";

import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { CoreMessage, ToolInvocation } from "ai";
import React, { ReactNode } from "react";
import { azure } from "@ai-sdk/azure";
import { openai } from '@ai-sdk/openai';

import { BotCard, BotMessage } from "@/components/llm/message";
import { Bot, Loader2 } from "lucide-react";
import { symbol, z } from "zod";
import { env } from "@/env";
import { sleep } from "@/lib/utils";
import { Stats } from "@/components/llm/stats";
import { StatsSkeleton } from "@/components/llm/stats-skeleton";
import { normalize } from "viem/ens";
import { publicClient } from "./client";
import { ENSCard } from "@/components/llm/ens-card";
import { ENSSkeleton } from "@/components/llm/ens-skeleton";
import { WalletPortfolioCard } from "@/components/llm/wallet-portfolio";
import { NFTDisplay } from "@/components/llm/nft-display";


const content = `\
You are a cytpto bot. You can get information about a wallet address that is on the blockchain\

Message inside [] means that is is a UI element or user event.  For example 
- "[Wallet address = 0x123456]" means that the interface of the wallet address is shown to the user. 
 - "[Stats of BTC]"  meanse that the interface of the cryptocurrency stats of BTC is shown to the user. 
- "[Portfolio of 0x123456]" means that the interface of the portfolio of the wallet address is shown to the user.

 If the user wants to know the portofolio of a wallet, use the wallet address from \'get_address\' to call the \`get_portfolio\` function to show the portfolio. If you don't know the wallet address, ask the user.
 If the user wants to know how much of a cyptocurrrency a wallet has, call the \`get_portfolio\` function to show the portfolio.
 If the user wants the wallet of an ENS, call the \`get_address\` function to show the ENS.
 If the user wants the market cap or stats of a given cryptocurrency ca call, \`get_crypto_stats\` to show the stats. 
 if the user wants a stock price, you should respond that you are a demo and cannot do that. 
 If the user wants anything else unrelated to the the function calls \`get_crypto_price\` and \`get_crypto_stats\` you should respond that you are a demo and cannot do that.
 If the user wants to anything about the NFTs owned by a wallet, call the \`get_nft\` function to show the NFTs.
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
    // model: azure("ksp-azure-openai"),
    model: openai("gpt-4o"),
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
          yield (
            <BotCard>
              <StatsSkeleton />
            </BotCard>
          );

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
          yield (
            <BotCard>
              <ENSSkeleton />
            </BotCard>
          );

          const ensAddress = await publicClient.getEnsAddress({
            name: normalize(ens),
          });

          const ensAvatar = await publicClient.getEnsAvatar({
            name: normalize(ens),
          });

          const ensCardDetails = {
            image:
              typeof ensAvatar === "string" ? ensAvatar : "default_image_url",
            name: ens,
            address: ensAddress || "", // Provide a default value when ensAddress is null
          };

          await sleep(1000);
          history.done([
            ...history.get(),
            {
              role: "assistant",
              name: "get_address",
              content: `[Wallet address =  ${ensAddress}]`,
            },
          ]);

          return (
            <BotCard>
              <ENSCard {...ensCardDetails} />
            </BotCard>
          );
        },
      },
      get_portfolio: {
        description:
          "Get the portfolio of a given wallet address. Use this to show the portfolio to the user",
        parameters: z.object({
          address: z
            .string()
            .describe(
              "The wallet address to get the portfolio of. For example, 0x123456789abcdef0123456789abcdef01234567"
            ),
        }),
        generate: async function* ({ address }: { address: string }) {
          console.log({ address });
          yield <BotCard>Loading...</BotCard>;

          await sleep(1000);

          const url = new URL(
            `https://api.zerion.io/v1/wallets/${address}/portfolio?currency=usd`
          );

          await sleep(1000);

          const response = await fetch(url, {
            headers: {
              Accept: "application/json",
              Authorization:
                "Basic emtfZGV2XzI5NzJhNTZjOGRlZjRmYjZhZTRiYzVhNWZjNzU2Mjg0Og==",
            },
          });
          const json = (await response.json()) as {
            links: {
              self: string;
            };
            data: {
              type: string;
              id: string;
              attributes: {
                positions_distribution_by_type: {
                  _wallet: number;
                  _deposited: number;
                  _borrowed: number;
                  _locked: number;
                  _staked: number;
                };
                positions_distribution_by_chain: {
                  [key: string]: number;
                };
                total: {
                  positions: number;
                };
                changes: {
                  absolute_1d: number;
                  percent_1d: number;
                };
              };
            };
          };

          const data = json.data;
          const positions = json.data.attributes;

          const walletStats = {
            data: {
              // wallet: positions.positions_distribution_by_type.wallet,
              // deposited: positions.positions_distribution_by_type.deposited,
              // borrowed: positions.positions_distribution_by_type.borrowed,
              // locked: positions.positions_distribution_by_type.locked,
              // staked: positions.positions_distribution_by_type.staked,
              ...positions.positions_distribution_by_chain,
            },
            walletAddress: address,
            totalPositions: positions.total.positions,
            absoluteChange1d: positions.changes.absolute_1d,
            percentChange1d: positions.changes.percent_1d,
          };

          await sleep(1000);

          history.done([
            ...history.get(),
            {
              role: "assistant",
              name: "get_portfolio",
              content: `[Portfolio of ${address}]`,
            },
          ]);

          console.log({ walletStats });

          return (
            <BotCard>
              <WalletPortfolioCard {...walletStats} />
            </BotCard>
          );
        },
      },
      get_nft: {
        description:
          "Get the NFTs owned by a given wallet address. Use this to show the NFTs to the user",
        parameters: z.object({
          address: z
            .string()
            .describe(
              "The wallet address to get the NFTs of. For example, 0x123456789abcdef0123456789abcdef01234567"
            ),
        }),
        generate: async function* ({ address }: { address: string }) {
          yield <BotCard>Loading...</BotCard>;

          await sleep(1000);

          const url = new URL(
            `https://api.zerion.io/v1/wallets/${address}/nft-collections/?currency=usd`
          );

          await sleep(1000);
          const response = await fetch(url, {
            headers: {
              Accept: "application/json",
              Authorization:
                "Basic emtfZGV2XzI5NzJhNTZjOGRlZjRmYjZhZTRiYzVhNWZjNzU2Mjg0Og==",
            },
          });
          const json = (await response.json()) as {
            links: {
              self: string;
            };
            data: Array<{
                _type: string;
                _id: string;
                attributes: {
                  _min_changed_at: string;
                  _max_changed_at: string;
                  _nfts_count: string;
                  total_floor_price: number;
                  collection_info: {
                    name: string;
                    description: string;
                    content: {
                      icon: {
                        url: string;
                      };
                      _banner: {
                        url: string;
                      };
                    };
                  };
                  relationships: {
                    chains: {
                      data: [
                        {
                          type: string;
                          id: string;
                        }
                      ];
                    };
                    nft_collections: {
                      data: [
                        {
                          _type: string;
                          _id: string;
                        }
                      ];
                    };
                  };
                };
              }>;
          };

    let nftStatsArray: { total_floor_price: number; name: string; description: string; icon: string; }[] = [];


    await sleep(5000);

 
    if (json && json.data) {
                        json.data.forEach((nft) => {
                    if (nft && 
                        nft.attributes && 
                        nft.attributes.collection_info && 
                        nft.attributes.collection_info.content && 
                        nft.attributes.collection_info.name && 
                        nft.attributes.collection_info.description && 
                        nft.attributes.collection_info.content &&
                        nft.attributes.collection_info.content.icon.url
                    
                    ) {

                            const nftStats = {
                        total_floor_price: nft.attributes.total_floor_price,
                        name: nft.attributes.collection_info.name,
                        description: nft.attributes.collection_info.description,
                        icon: nft.attributes.collection_info.content.icon.url,
                        // rest of your code
                    };
                    nftStatsArray.push(nftStats); // This will print each name

                }
        }); // Add closing parenthesis here
       
    }
    console.log(json.data);

            return (
                <BotCard>
                    {nftStatsArray.map((nftStats, index: number) => (
                        <NFTDisplay key={index} nftDisplays={[{...nftStats}]} />
                    ))}
                </BotCard>
            );
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
  name?: "get_portfolio" | "get_crypto_stats" | "get_address" | "get_nft";
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
