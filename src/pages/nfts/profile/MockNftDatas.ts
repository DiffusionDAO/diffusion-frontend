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
      thumbnail: "string"
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
  },
  {
    tokenId: "xxx2",
    name: "test1",
    description: "xxx1",
    collectionName: "xxx1",
    collectionAddress: "xxx1",
    image: {
      original: "string",
      thumbnail: "string"
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
  },
  {
    tokenId: "xxx3",
    name: "test1",
    description: "xxx1",
    collectionName: "xxx1",
    collectionAddress: "xxx1",
    image: {
      original: "string",
      thumbnail: "string"
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
  },
]