import { NftToken, NftLocation } from 'state/nftMarket/types'

const nftDatasMock: NftToken[] = [
  {
    tokenId: "1",
    name: "Carina II.png",
    description: "Carina II.png",
    collectionName: "StarLight",
    collectionAddress: "0x69E01E8AdA552DFd66028D7201147288Ea6470de",
    image: {
      original: "string",
      thumbnail: "https://static-nft.pancakeswap.com/mainnet/0x5F41842CFF838120271d772C6994F051d418a4aD/pixel-sweeper-7218-1000.png"
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
      tokenId: "1",
      collection: {
        id: "1",
      },
      currentAskPrice: "0.22",
      currentSeller: "diffusion",
      isTradable: true,
    }
  },
  {
    tokenId: "2",
    name: "test1",
    description: "xxx1",
    collectionName: "StarLight",
    collectionAddress: "0x69E01E8AdA552DFd66028D7201147288Ea6470de",
    image: {
      original: "string",
      thumbnail: "https://static-nft.pancakeswap.com/mainnet/0x5F41842CFF838120271d772C6994F051d418a4aD/pixel-sweeper-7237-1000.png"
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
      currentSeller: "diffusion",
      isTradable: true,
    }
  },
  {
    tokenId: "3",
    name: "test1",
    description: "xxx1",
    collectionName: "StarLight",
    collectionAddress: "0x69E01E8AdA552DFd66028D7201147288Ea6470de",
    image: {
      original: "string",
      thumbnail: "https://static-nft.pancakeswap.com/mainnet/0xAFc7647b584730694B9606511F11F423A0816eFf/horror-ape-club-1912-1000.png"
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
      currentSeller: "diffusion",
      isTradable: true,
    }
  },
  {
    tokenId: "4",
    name: "test1",
    description: "xxx1",
    collectionName: "StarLight",
    collectionAddress: "0x69E01E8AdA552DFd66028D7201147288Ea6470de",
    image: {
      original: "string",
      thumbnail: "https://static-nft.pancakeswap.com/mainnet/0x0D464bDde2301C30871bB4C29bB7DD935f5a985C/liquid-monster-857-1000.png"
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
      currentSeller: "diffusion",
      isTradable: true,
    }
  },
]
export default nftDatasMock