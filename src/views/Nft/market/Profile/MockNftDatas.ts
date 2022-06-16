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
      thumbnail: "QmZUnmBhAJ7fKsktYzuCHwkzgUhdQ3T91K7EYdP97UJkov/1"
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
      thumbnail: "QmZUnmBhAJ7fKsktYzuCHwkzgUhdQ3T91K7EYdP97UJkov/2"
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
      thumbnail: "QmZUnmBhAJ7fKsktYzuCHwkzgUhdQ3T91K7EYdP97UJkov/3"
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
      thumbnail: "QmZUnmBhAJ7fKsktYzuCHwkzgUhdQ3T91K7EYdP97UJkov/4"
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