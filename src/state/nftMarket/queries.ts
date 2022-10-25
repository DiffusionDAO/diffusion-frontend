export const baseNftFields = `
  tokenId
  metadataUrl
  currentAskPrice
  currentSeller
  latestTradedPriceInBNB
  tradeVolumeBNB
  totalTrades
  isTradable
  updatedAt
  otherId
  collection {
    id
  }
`

export const baseTransactionFields = `
  id
  block
  timestamp
  askPrice
  netPrice
  withBNB
  buyer {
    id
  }
  seller {
    id
  }
`

export const collectionBaseFields = `
  id
  name
  symbol
  active
  totalTrades
  totalVolume
  numberTokensListed
  creatorAddress
  tradingFee
  creatorFee
  whitelistChecker
`
