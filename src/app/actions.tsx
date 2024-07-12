"use server";

import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { CoreMessage, ToolInvocation } from "ai";
import React, { ReactNode } from "react";
import { azure } from "@ai-sdk/azure";
import { BotCard, BotMessage } from "@/components/llm/message";
import { Bot, Loader2 } from "lucide-react";
import { symbol, z } from "zod";
// import {MainClient } from 'binance';
import { env } from "@/env";
import { sleep } from "@/lib/utils";
import { Stats } from "@/components/llm/stats";
import { StatsSkeleton } from "@/components/llm/stats-skeleton";
import { normalize } from "viem/ens";
import { publicClient } from "./client";
import { Address } from "@coinbase/onchainkit/identity";
import { ENSCard } from "@/components/llm/ens-card";
import { ENSSkeleton } from "@/components/llm/ens-skeleton";
import { WalletPortfolioCard } from "@/components/llm/wallet-portfolio";

// const binance = new MainClient({
//     api_key: env.BINANCE_API_KEY,
//     api_secret: env.BINANCE_API_SECRET,
// })

// this is the system message

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

                                            const url = new URL (
                                                    `https://api.zerion.io/v1/wallets/${address}/portfolio?currency=usd`
                                            );

                                            await sleep(1000);


                                            const response = await fetch(url, {
                                                    headers: {
                                                            Accept: 'application/json',
                                                            "Authorization": 'Basic emtfZGV2XzI5NzJhNTZjOGRlZjRmYjZhZTRiYzVhNWZjNzU2Mjg0Og=='
                                                    }
                                            });
                                            const json = (await response.json()) as {
                                                        links: {
                                                            self: string
                                                        }
                                                        data: {
                                                            type: string
                                                            id: string
                                                            attributes: {
                                                                    positions_distribution_by_type: {
                                                                     _wallet: number
                                                                    _deposited: number
                                                                    _borrowed: number
                                                                    _locked: number
                                                                    _staked: number
                                                        }
                                                        positions_distribution_by_chain: {
                                                            arbitrum: number
                                                            base: number
                                                            "binance-smart-chain": number
                                                            ethereum: number
                                                            optimism: number
                                                            polygon: number
                                                            xdai: number
                                                            zora: number
                                                        }
                                                        total: {
                                                            positions: number
                                                        }
                                                        changes: {
                                                            absolute_1d: number
                                                            percent_1d: number
                                                        }
                                                    }
                                            }
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
                                                    arbitrum: positions.positions_distribution_by_chain.arbitrum,
                                                    base: positions.positions_distribution_by_chain.base,
                                                    bsc: positions.positions_distribution_by_chain["binance-smart-chain"],
                                                    eth: positions.positions_distribution_by_chain.ethereum,
                                                    optimism: positions.positions_distribution_by_chain.optimism,
                                                    polygon: positions.positions_distribution_by_chain.polygon,
                                                    xdai: positions.positions_distribution_by_chain.xdai,
                                                    zora: positions.positions_distribution_by_chain.zora,

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

                                            console.log({ walletStats});
                                            
                                            
                                            return (
                                                    <BotCard>
                                                            <WalletPortfolioCard {...walletStats} />
                                                    </BotCard>
                                            );
                                    }

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
                name?: "get_portfolio" | "get_crypto_stats" | "get_address";
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
