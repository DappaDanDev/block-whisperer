"use server";

import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { CoreMessage, ToolInvocation } from "ai";
import React, { ReactNode } from "react";
import { azure } from "@ai-sdk/azure";
import { openai } from "@ai-sdk/openai";

import { BotCard, BotMessage } from "@/components/llm/message";
import { Bot, Loader2 } from "lucide-react";
import { boolean, symbol, z } from "zod";
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
import { link } from "fs";
import { TranscastionCard } from "@/components/llm/transaction-card";
import { SocialCard } from "@/components/llm/social-card";

const content = `\
You are a cytpto bot. You can get information about a wallet address that is on the blockchain\

Message inside [] means that is is a UI element or user event.  For example 
- "[Wallet address = 0x123456]" means that the interface of the wallet address is shown to the user. 
 - "[Stats of BTC]"  meanse that the interface of the cryptocurrency stats of BTC is shown to the user. 
- "[Portfolio of 0x123456]" means that the interface of the portfolio of the wallet address is shown to the user.
- "[Socials of Dappadan.eth]" means that the interface of the socials of the wallet address is shown to the user.


 If the user wants to know the portofolio of a wallet, use the wallet address from \'get_address\' to call the \`get_portfolio\` function to show the portfolio. If you don't know the wallet address, ask the user.
 If the user wants to know how much of a cyptocurrrency a wallet has, call the \`get_portfolio\` function to show the portfolio.
 If the user wants to connect or know the social information about a wallet, call the \`get_socials\` function to show the socials.
 If the user wants the wallet of an ENS, call the \`get_address\` function to show the ENS.
 If the user wants the market cap or stats of a given cryptocurrency ca call, \`get_crypto_stats\` to show the stats. 
 if the user wants a stock price, you should respond that you are a demo and cannot do that. 
 If the user wants anything else unrelated to the the function calls \`get_crypto_price\` and \`get_crypto_stats\` you should respond that you are a demo and cannot do that.
 If the user wants to anything about the NFTs owned by a wallet, call the \`get_nft\` function to show the NFTs.
If the user wants to know if a wallet owns a specific NFT (example: "Does Dappadan.eth own a POAP?"), call the \`get_nft\` function, this function returns a \`name\` and \`description\` . Try to match the name the user described with the name or description returned by the function. If Yes, show the icon image of the NFT. If no, just say no. Don't show the NFT until you are sure there is a match, if you are unsure say "I don't know".
If the user want to know about the transactions of a wallet address or ENS, call the \`get_transactions\` function to show the transactions. The user should speficify how many transactions they want to see. If they don't ask for a specific number, show the last 5 transactions.
If the user wants to know about their own wallet actvity, address, or portfolio, first ask what is their ENS Name or wallet address. First call the \`get_address\` function to show the wallet address. Then call the correct function like \`get_portfolio\` function to show the portfolio.
If the user wants to know about a specific operation type of transactions, for example "show me my last mint" or "what was the last deposit" , call the \`get_specific_transaction\` function. Extract the operation type from the user's questions for example: "show me my last mint" the transaction type is "mint" or "what was luc.eth last trade?", the operation type is "trade" If you don't know the wallet address or ENS name, then ask. Return one transaction. Available operation types are "mint", "deposit", "withdraw", "approval", "transfer", and "trade". If you are unsure of the operation type, ask the user to clarify. The operation type cannot be "recieve". 
If the user wants to know if a certain wallet address or ENS owns a specific NFT, call the \`get_nft\` function first.  For example, "Does Dappadan.eth own a POAP?" or "Does 0x123 own a CryptoPunk?". The function returns a name and description. Read the name and description and try to match it with the NFT the user is asking about. If there is a match, show the icon image of the NFT. If there is no match, say "No". If you are unsure, say "I don't know".


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
      get_transactions: {
        description:
          "Get the transactions of a given wallet address. Use this to show the transactions to the user",
        parameters: z.object({
          address: z
            .string()
            .describe(
              "The wallet address to get recent transactions.  For example, 0x123456789abcdef0123456789abcdef01234567"
            ),
        }),
        generate: async function* ({ address }: { address: string }) {
          console.log({ address });
          yield <BotCard>Loading...</BotCard>;

          await sleep(1000);

          const url = new URL(
            `https://api.zerion.io/v1/wallets/${address}/transactions/`
          );

          url.searchParams.append("page[size]", "5");
          url.searchParams.append("[trash]", "only_non_trash");

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
              links: string;
            };
            data: Array<{
              _type: string;
              _id: string;
              attributes: {
                operation_type: string;
                _hash: string;
                _mined_at_block: number;
                _mined_at: string;
                _sent_amount: string;
                _sent_to: string;
                _status: string;
                _nonce: number;
                fee: {
                  fungible_info: {
                    name: string;
                    symbol: string;
                    icon: {
                      url: string;
                    };
                    _flags: {
                      _verified: string;
                    };
                  };
                  implementations: Array<{
                    chain_id: string;
                    _address: string;
                    _decimals: number;
                  }>;
                  quantity: {
                    _int: string;
                    _decimals: number;
                    _float: number;
                    numeric: string;
                  };
                  _price: number;
                  _value: number;
                };
                transfers: Array<{
                  fungible_info: {
                    _name: string;
                    _symbol: string;
                    _icon: string;
                    _flags: {
                      _verified: boolean;
                    };
                    _implementations: Array<{
                      _chain_id: string;
                      _address: string;
                      _decimals: number;
                    }>;
                  };

                  _direction: string;
                  _quote: {
                    _int: string;
                    _decimals: number;
                    _float: number;
                    _numeric: string;
                  };
                  _value: number;
                  _price: number;
                  sender: string;
                  recipient: string;
                }>;
                _approvals: Array<{}>;

                _application_metadata: {
                  _contract_address: string;
                };
                _flags: {
                  _is_trash: boolean;
                };
              };
              relationships: {
                chain: {
                  _links: {
                    _related: string;
                  };
                  data: {
                    _type: string;
                    id: string;
                  };
                };
                _dapp: {
                  _data: {
                    _type: string;
                    _id: string;
                  };
                };
              };
            }>;
          };
          let TransactionArray: {
            operation_type: string;
            name: string;
            symbol: string;
            icon: string;
            id: string;
            numeric: string;
            sender: string;
            recipient: string;
          }[] = [];

          await sleep(5000);

          if (json && json.data) {
            json.data.forEach((transact) => {
              if (
                transact &&
                transact.attributes.operation_type &&
                transact.attributes.fee.fungible_info.name &&
                transact.attributes.fee.fungible_info.symbol &&
                transact.attributes.fee.fungible_info.icon.url &&
                transact.attributes.fee.quantity.numeric &&
                transact.attributes.transfers[0].sender &&
                transact.attributes.transfers[0].recipient &&
                transact.relationships.chain.data.id
              ) {
                const transStats = {
                  operation_type: transact.attributes.operation_type,
                  name: transact.attributes.fee.fungible_info.name,
                  symbol: transact.attributes.fee.fungible_info.symbol,
                  icon: transact.attributes.fee.fungible_info.icon.url,
                  id: transact.relationships.chain.data.id,
                  numeric: transact.attributes.fee.quantity.numeric,
                  sender: transact.attributes.transfers[0].sender,
                  recipient: transact.attributes.transfers[0].recipient,
                };

                TransactionArray.push(transStats);
              }
            });
          }

          console.log(TransactionArray);

          return (
            <BotCard>
              {TransactionArray.map((transStats, index: number) => (
                <TranscastionCard
                  key={index}
                  transactions={[{ ...transStats }]}
                />
              ))}
            </BotCard>
          );
        },
      },
      get_specific_transactions: {
        description:
          "Get specific transaction data of a specific data type provided by the user of a given wallet address. Use this to show the one transaction that is the transaction type provided by the user",
        parameters: z.object({
          address: z
            .string()
            .describe(
              "The wallet address to get recent transactions.  For example, 0x123456789abcdef0123456789abcdef01234567"
            ),
          operationType: z
            .string()
            .describe(
              "The transaction type to get. For example, mint, recieve, approval, etc."
            ),
        }),
        generate: async function* ({
          address,
          operationType,
        }: {
          address: string;
          operationType: string;
        }) {
          console.log({ address });
          yield <BotCard>Loading...</BotCard>;

          await sleep(1000);

          const url = new URL(
            `https://api.zerion.io/v1/wallets/${address}/transactions/`
          );

          url.searchParams.append("page[size]", "1");
          url.searchParams.append("[trash]", "only_non_trash");
          url.searchParams.append("[operation_types]", operationType);
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
              links: string;
            };
            data: Array<{
              _type: string;
              _id: string;
              attributes: {
                operation_type: string;
                _hash: string;
                _mined_at_block: number;
                _mined_at: string;
                _sent_amount: string;
                _sent_to: string;
                _status: string;
                _nonce: number;
                fee: {
                  fungible_info: {
                    name: string;
                    symbol: string;
                    icon: {
                      url: string;
                    };
                    _flags: {
                      _verified: string;
                    };
                  };
                  implementations: Array<{
                    chain_id: string;
                    _address: string;
                    _decimals: number;
                  }>;
                  quantity: {
                    _int: string;
                    _decimals: number;
                    _float: number;
                    numeric: string;
                  };
                  _price: number;
                  _value: number;
                };
                transfers: Array<{
                  fungible_info: {
                    _name: string;
                    _symbol: string;
                    _icon: string;
                    _flags: {
                      _verified: boolean;
                    };
                    _implementations: Array<{
                      _chain_id: string;
                      _address: string;
                      _decimals: number;
                    }>;
                  };

                  _direction: string;
                  _quote: {
                    _int: string;
                    _decimals: number;
                    _float: number;
                    _numeric: string;
                  };
                  _value: number;
                  _price: number;
                  sender: string;
                  recipient: string;
                }>;
                _approvals: Array<{}>;

                _application_metadata: {
                  _contract_address: string;
                };
                _flags: {
                  _is_trash: boolean;
                };
              };
              relationships: {
                chain: {
                  _links: {
                    _related: string;
                  };
                  data: {
                    _type: string;
                    id: string;
                  };
                };
                _dapp: {
                  _data: {
                    _type: string;
                    _id: string;
                  };
                };
              };
            }>;
          };
          let TransactionArray: {
            operation_type: string;
            name: string;
            symbol: string;
            icon: string;
            id: string;
            numeric: string;
            sender: string;
            recipient: string;
          }[] = [];

          await sleep(5000);

          if (json && json.data) {
            json.data.forEach((transact) => {
              if (
                transact &&
                transact.attributes.operation_type &&
                transact.attributes.fee.fungible_info.name &&
                transact.attributes.fee.fungible_info.symbol &&
                transact.attributes.fee.fungible_info.icon.url &&
                transact.attributes.fee.quantity.numeric &&
                transact.attributes.transfers[0].sender &&
                transact.attributes.transfers[0].recipient &&
                transact.relationships.chain.data.id
              ) {
                const transStats = {
                  operation_type: transact.attributes.operation_type,
                  name: transact.attributes.fee.fungible_info.name,
                  symbol: transact.attributes.fee.fungible_info.symbol,
                  icon: transact.attributes.fee.fungible_info.icon.url,
                  id: transact.relationships.chain.data.id,
                  numeric: transact.attributes.fee.quantity.numeric,
                  sender: transact.attributes.transfers[0].sender,
                  recipient: transact.attributes.transfers[0].recipient,
                };

                TransactionArray.push(transStats);
              }
            });
          }

          console.log(TransactionArray);

          return (
            <BotCard>
              {TransactionArray.map((transStats, index: number) => (
                <TranscastionCard
                  key={index}
                  transactions={[{ ...transStats }]}
                />
              ))}
            </BotCard>
          );
        },
      },
      get_socials: {
        description:
          "Get ENS of a wallet address. Use this to show the socials to the user",
        parameters: z.object({
          ens: z
            .string()
            .describe(
              "Using the ENS to get the social accounts connected to the ENS"
            ),
        }),
        generate: async function* ({ ens }: { ens: string }) {
          const name = normalize(ens);

          const description = await publicClient.getEnsText({
            name,
            key: "description",
          });

          const [avatar, twitter, discord, github] = await Promise.all([
            publicClient.getEnsText({
              name,
              key: "avatar",
            }),
            publicClient.getEnsText({
              name,
              key: "com.twitter",
            }),
            publicClient.getEnsText({
              name,
              key: "com.discord",
            }),
            publicClient.getEnsText({
              name,
              key: "com.github",
            }),
          ]);

          return (
            <BotCard>
              <SocialCard
                image={avatar || ""}
                name={name}
                twitter={twitter || ""}
                discord={discord || ""}
                github={github || ""}
                description={description || ""}
              />
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

          let nftStatsArray: {
            total_floor_price: number;
            name: string;
            description: string;
            icon: string;
          }[] = [];

          await sleep(5000);

          if (json && json.data) {
            json.data.forEach((nft) => {
              if (
                nft &&
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
                <NFTDisplay key={index} nftDisplays={[{ ...nftStats }]} />
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
  name?:
    | "get_portfolio"
    | "get_crypto_stats"
    | "get_address"
    | "get_nft"
    | "get_transactions"
    | "get_crypto_price"
    | "get_socials"
    | "get_specific_transactions";
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
