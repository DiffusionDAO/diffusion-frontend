import { NftToken, NftLocation } from 'state/nftMarket/types'

export const nftDatasMock: NftToken[] = [
  {
    tokenId: "xxx1",
    name: "test1",
    description: "xxx1",
    collectionName: "xxx1",
    collectionAddress: "xxx1",
    image: {
      original: "string",
      thumbnail: "https://static-nft.pancakeswap.com/mainnet/0xDf7952B35f24aCF7fC0487D01c8d5690a60DBa07/churro-1000.png"
    },
    attributes: [
      {
        traitType: "xxx",
        value: 1,
        displayType: "xxx"
      }
    ],
    createdAt: "2022/05/27 14:00",
    updatedAt: "2022/05/27 14:00",
    location: NftLocation.FORSALE,
    marketData: {
      tokenId: "xxx1",
      collection: {
        id: "xxx1",
      },
      currentAskPrice: "0.22",
      currentSeller: "xxx",
      isTradable: true,
    }
  },
  {
    tokenId: "xxx2",
    name: "test1",
    description: "xxx1",
    collectionName: "xxx1",
    collectionAddress: "xxx1",
    image: {
      original: "string",
      thumbnail: "https://static-nft.pancakeswap.com/mainnet/0x0a8901b0E25DEb55A87524f0cC164E9644020EBA/pancake-squad-5049-1000.png"
    },
    attributes: [
      {
        traitType: "xxx",
        value: 1,
        displayType: "xxx"
      }
    ],
    createdAt: "2022/05/27 14:00",
    updatedAt: "2022/05/27 14:00",
    location: NftLocation.PROFILE,
    marketData: {
      tokenId: "xxx1",
      collection: {
        id: "xxx1",
      },
      currentAskPrice: "0.22",
      currentSeller: "xxx",
      isTradable: true,
    }
  },
  {
    tokenId: "xxx3",
    name: "test1",
    description: "xxx1",
    collectionName: "xxx1",
    collectionAddress: "xxx1",
    image: {
      original: "string",
      thumbnail: "https://static-nft.pancakeswap.com/mainnet/0x8e311dB45B55DF68b7C1C8D01888a4C43986c60F/degen-ape-782-1000.png"
    },
    attributes: [
      {
        traitType: "xxx",
        value: 1,
        displayType: "xxx"
      }
    ],
    createdAt: "2022/05/27 14:00",
    updatedAt: "2022/05/27 14:00",
    location: NftLocation.WALLET,
    marketData: {
      tokenId: "xxx1",
      collection: {
        id: "xxx1",
      },
      currentAskPrice: "0.22",
      currentSeller: "xxx",
      isTradable: true,
    }
  },
  {
    tokenId: "xxx4",
    name: "test1",
    description: "xxx1",
    collectionName: "xxx1",
    collectionAddress: "xxx1",
    image: {
      original: "string",
      thumbnail: "https://static-nft.pancakeswap.com/mainnet/0xDf7952B35f24aCF7fC0487D01c8d5690a60DBa07/claire-1000.png"
    },
    attributes: [
      {
        traitType: "xxx",
        value: 1,
        displayType: "xxx"
      }
    ],
    createdAt: "2022/05/27 14:00",
    updatedAt: "2022/05/27 14:00",
    location: NftLocation.WALLET,
    marketData: {
      tokenId: "xxx1",
      collection: {
        id: "xxx1",
      },
      currentAskPrice: "0.22",
      currentSeller: "xxx",
      isTradable: true,
    }
  },
]