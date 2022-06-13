import { NftToken, NftLocation } from 'state/nftMarket/types'

const nftDatasMock: NftToken[] = [
  {
    tokenId: "1",
    name: "Carina II.png",
    description: "Carina II.png",
    collectionName: "StarLight",
    collectionAddress: "0x84B3d5A4CD6E235cE3cc4c0A9169aAb14f8621DF",
    image: {
      original: "string",
      thumbnail: "QmasbYJBxVzLJFk9HUKxaKu4XFRQ97oQCmHpuDnXBC5mXu"
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
      currentSeller: "diffusion",
      isTradable: true,
    }
  },
  {
    tokenId: "2",
    name: "test1",
    description: "xxx1",
    collectionName: "StarLight",
    collectionAddress: "0x84B3d5A4CD6E235cE3cc4c0A9169aAb14f8621DF",
    image: {
      original: "string",
      thumbnail: "QmasbYJBxVzLJFk9HUKxaKu4XFRQ97oQCmHpuDnXBC5mXu"
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
    collectionAddress: "0x84B3d5A4CD6E235cE3cc4c0A9169aAb14f8621DF",
    image: {
      original: "string",
      thumbnail: "QmasbYJBxVzLJFk9HUKxaKu4XFRQ97oQCmHpuDnXBC5mXu"
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
    collectionAddress: "0x84B3d5A4CD6E235cE3cc4c0A9169aAb14f8621DF",
    image: {
      original: "string",
      thumbnail: "QmasbYJBxVzLJFk9HUKxaKu4XFRQ97oQCmHpuDnXBC5mXu"
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