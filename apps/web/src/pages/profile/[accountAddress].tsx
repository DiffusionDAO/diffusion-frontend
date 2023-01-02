/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable no-await-in-loop */
/* eslint-disable array-callback-return */
/* eslint-disable array-callback-return */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useRouter } from 'next/router'
import Typed from 'react-typed'
import { Cascader, Tabs, Button, message } from 'antd'
import cloneDeep from 'lodash/cloneDeep'
import { useTranslation } from '@pancakeswap/localization'
import { BigNumber } from 'ethers'

import { NftProfileLayout } from 'views/Profile'
import UnconnectedProfileNfts from 'views/Profile/components/UnconnectedProfileNfts'
import UserNfts from 'views/Profile/components/UserNfts'
import {
  AccountNftWrap,
  SubMenuWrap,
  SubMenuRight,
  SelectWrap,
  ComposeBtnWrap,
  SelectedCountWrap,
  ComposeBtn,
  ComposeBtnWrapImg,
  SelectedCountBox,
  BackgroundWrap,
  ContentWrap,
  BackgroundTitle,
  BackgroundDes,
  BackgroundText,
  NftSculptureWrap,
  NftSculptureGif,
} from 'views/Nft/market/Profile/components/styles'
import ComposeConfirmModal from 'views/Nft/market/Profile/components/ComposeConfirmModal'
import ComposeSuccessModal from 'views/Nft/market/Profile/components/ComposeSuccessModal'
import CustomModal from 'views/Nft/market/Profile/components/CustomModal'
import { NftLocation, NftToken } from 'state/nftMarket/types'
import { getSocialNFTAddress, getMiningAddress } from 'utils/addressHelpers'
import {
  useNFTDatabaseContract,
  useDFSMiningContract,
  useSocialNftContract,
  useNftMarketContract,
  useDiffusionAICatContract,
} from 'hooks/useContract'
import useSWR from 'swr'
import { formatBigNumber } from '@pancakeswap/utils/formatBalance'
import { ZHCN } from '@pancakeswap/localization/src/config/languages'
import { Flex, Text, useMatchBreakpoints,Select,OptionProps ,ScrollToTopButton} from '@pancakeswap/uikit'
import { createPortal } from 'react-dom'
import { useActiveChainId } from 'hooks/useActiveChainId'
import Page from 'components/Layout/Page'

interface noteProps {
  title: string
  description: string
  visible: boolean
}

export interface NFT {
  tokenId: number
  level: number
  owner: string
  name: string
  collectionName: string
  collectionAddress: string
  seller?: string
  price?: BigNumber
  staker?: string
  thumbnail?: string
  chainId?: number
}

export const zeroAddress = '0x0000000000000000000000000000000000000000'
export const tokenIdToName = {
  0: 'Angel#1',
  1: 'Angel#2',
  2: 'Angel#3',
  3: 'Angel#4',
  4: 'Angel#5',
  5: 'Angel#6',
  6: 'Angel#7',
  7: 'Angel#8',
  8: 'Catman at DiffusionDAO on Mars',
  9: 'Court General',
  10: 'Court Hierarch',
  11: 'Court King#1',
  12: 'Court King#2',
  13: 'Court King#3',
  14: 'Court King#4',
  15: 'Court King#5',
  16: 'Court King#6',
  17: 'Court King#7',
  18: 'Court Nobility#1',
  19: 'Court Nobility#2',
  20: 'Court Nobility#3',
  21: 'Court Nobility#4',
  22: 'Court Nobility#5',
  23: 'Court Nobility#6',
  24: 'Court Queen#1',
  25: 'Court Queen#2',
  26: 'Court Queen#3',
  27: 'Court Queen#4',
  28: 'Court Queen#5',
  29: 'Court Queen#6',
  30: 'Court Queen#7',
  31: 'Court Queen#8',
  32: 'Court Queen#9',
  33: 'Court Queen#10',
  34: 'Court Nun#1',
  35: 'Court Nun#2',
  36: 'Court Nun#3',
  37: 'Court Nun#4',
  38: 'Court Nun#5',
  39: 'Court Pet',
  40: 'Cowboy#1',
  41: 'Cowboy#2',
  42: 'Cowboy#3',
  43: 'Cowboy#4',
  44: 'Cowboy#5',
  45: 'Cowboy#6',
  46: 'Cowboy#7',
  47: 'Cowboy#8',
  48: 'Cowboy#9',
  49: 'Future Warrior#1',
  50: 'Future Warrior#2',
  51: 'Future Warrior#3',
  52: 'Future Warrior#4',
  53: 'Future Warrior#5',
  54: 'Future Warrior#6',
  55: 'Future Warrior#7',
  56: 'Future Warrior#8',
  57: 'Future Warrior#9',
  58: 'Future Warrior#10',
  59: 'Future Warrior#11',
  60: 'Future Warrior#12',
  61: 'Future Warrior#13',
  62: 'Future Warrior#14',
  63: 'Future Warrior#15',
  64: 'Future Warrior#16',
  65: 'Future Warrior#17',
  66: 'Gentleman#1',
  67: 'Gentleman#2',
  68: 'Gentleman#3',
  69: 'Gentleman#4',
  70: 'Gentleman#5',
  71: 'Gentleman#6',
  72: 'Gentleman#7',
  73: 'Gentleman#8',
  74: 'Gentleman#9',
  75: 'Gentleman#10',
  76: 'Gentleman#11',
  77: 'God of Thunder',
  78: 'Knight under the stars',
  79: 'Money#1',
  80: 'Money#2',
  81: 'Money#3',
  82: 'Money#4',
  83: 'Money#5',
  84: 'Money#6',
  85: 'Money#9',
  86: 'Money#10',
  87: 'Money#8888',
  88: 'Purple space#1',
  89: 'Purple space#2',
  90: 'Purple space#3',
  91: 'Purple space#4',
  92: 'Purple space#5',
  93: 'Purple space#6',
  94: 'Purple space#7',
  95: 'Teenager#1',
  96: 'Teenager#2',
  97: 'Tide#1',
  98: 'Tide#2',
  99: 'Tide#3',
}
export const levelToName = {
  '0': 'Wiseman fragment',
  '1': 'Wiseman',
  '2': 'Wiseman Gold',
  '3': 'General',
  '4': 'General Gold',
  '5': 'Senator',
  '6': 'Crown Senator',
}
const greeceNumber = { 0: 'I', 1: 'II', 2: 'III', 3: 'IV', 4: 'V', 5: 'VI', 6: 'VII' }
export const levelToSPOS = {
  '0': {
    validSPOS: 20,
    unlockableSPOS: 40,
  },
  '1': {
    validSPOS: 63,
    unlockableSPOS: 126,
  },
  '2': {
    validSPOS: 128,
    unlockableSPOS: 256,
  },
  '3': {
    validSPOS: 262,
    unlockableSPOS: 524,
  },
  '4': {
    validSPOS: 534,
    unlockableSPOS: 1068,
  },
  '5': {
    validSPOS: 1091,
    unlockableSPOS: 2182,
  },
  '6': {
    validSPOS: 2225,
    unlockableSPOS: 4450,
  },
}

const SORT_FIELD_INDEX_MAP = new Map([
  ['All', 0],
  [levelToName['0'], 1],
  [levelToName['1'], 2],
  [levelToName['2'], 3],
  [levelToName['3'], 4],
  [levelToName['4'], 5],
  [levelToName['5'], 6],
  [levelToName['6'], 7],
])


export const nftToNftToken = (nft: NFT) => {
  const socialNFTAddress = getSocialNFTAddress(nft?.chainId)
  const tokenId = nft?.tokenId?.toString()
  const level = nft?.level
  const price = nft?.price ?? BigNumber.from(0)
  const token: NftToken = {
    tokenId,
    name: nft.name,
    collectionName: nft.collectionName,
    description: nft.collectionName,
    collectionAddress: nft.collectionAddress,
    image: {
      original: 'string',
      thumbnail: nft?.thumbnail,
    },
    level,
    attributes: nft.collectionAddress === socialNFTAddress && [
      {
        traitType: 'SPOS',
        value: levelToSPOS[level].validSPOS,
        displayType: '',
      },
    ],
    createdAt: '',
    updatedAt: '',
    location: NftLocation.FORSALE,
    marketData: {
      tokenId,
      collection: {
        id: tokenId,
      },
      currentAskPrice: formatBigNumber(price, 3),
      currentSeller: nft?.seller,
      isTradable: true,
    },
    staker: nft?.staker,
    owner: nft?.owner,
    seller: nft?.seller,
    selected: false,
  }
  return token
}
function NftProfilePage() {
  const {chainId} = useActiveChainId()
  const socialNFTAddress = getSocialNFTAddress(chainId)
  const { account } = useWeb3React()
  const { t, currentLanguage } = useTranslation()
  const [stakedNFTs, setStakedNFTs] = useState<NftToken[]>()
  const [unstakedNFTs, setUnstakedNFTs] = useState<NftToken[]>()
  const [onSaleNFTs, setOnSaleNFT] = useState([])
  const [selectedNFTs, setSelectedNFTs] = useState<NftToken[]>([])
  const { isMobile } = useMatchBreakpoints()
  const { push, query } = useRouter()

  const accountAddress = query.accountAddress as string

  const isConnectedProfile = account?.toLowerCase() === accountAddress?.toLowerCase()
  console.log("account:",account,"isConnectedProfile:",isConnectedProfile)
  if (account && !isConnectedProfile) {
    push(`/profile/${account?.toLowerCase()}`)
  } 
  const [isSelected, setIsSelected] = useState<boolean>(false)
  const [option, setOption] = useState<string>('')
  const [sortField, setSortField] = useState(null)

  const [selectedCount, setSelectedCount] = useState<number>(0)
  const [composedNFT, setComposedNFT] = useState([])

  const [confirmModalVisible, setConfirmModalVisible] = useState(false)
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [noteContent, setNoteContent] = useState<noteProps>({
    title: '',
    description: '',
    visible: false,
  })
  const [activeTab, setActiveTab] = useState<string>('Unstaked')

  const tabs = [
    { key: 'Unstaked', label: t('Not Staked'), length: unstakedNFTs?.length ?? 0 },
    { key: 'Staked', label: t('Staked'), length: stakedNFTs?.length ?? 0 },
    { key: 'OnSale', label: t('On Sale'), length: onSaleNFTs?.length ?? 0 },
  ]

  const options = useMemo(() => {
    return [
      { label: t('All'), value: 8 },
      { label: t('Wiseman fragment'), value: 0 },
      { label: t('Wiseman'), value: 1 },
      { label: t('Wiseman Gold'), value: 2 },
      { label: t('General'), value: 3 },
      { label: t('General Gold'), value: 4 },
      { label: t('Senator'), value: 5 },
      { label: t('Crown Senator'), value: 6 },
    ]
  }, [t])

  const nftMarket = useNftMarketContract()
  const dfsMining = useDFSMiningContract()
  const socialNFT = useSocialNftContract()
  const diffusionAICatContract = useDiffusionAICatContract()

  const getProfileToken = async () => {
    const tokens = { unstaked: [], staked: [], onSale: [] }
    if (account && isConnectedProfile) {
      const diffusionAICatTokenIds = await diffusionAICatContract.tokensOfOwner(account)
      const tokenIds = await socialNFT.tokensOfOwner(account)
      await Promise.all(
        tokenIds?.map(async (tokenId) => {
          try {
            const collectionName = await socialNFT.name()
            const sellPrice = await nftMarket.sellPrice(socialNFT.address, tokenId)
            const token = await socialNFT.getToken(tokenId)
            const name = `${t(levelToName[token.level])}#${token.tokenId}`
            const thumbnail = `/images/nfts/${collectionName.toLowerCase()}/${token?.level}`
            const nft: NFT = {
              ...token,
              ...sellPrice,
              collectionName,
              collectionAddress: socialNFT.address,
              name,
              thumbnail,
              chainId
            }
            tokens.unstaked.push(nftToNftToken(nft))
          } catch (error: any) {
            console.log(tokenId, error.reason ?? error.data?.message ?? error.message)
          }
        }),
      )
      await Promise.all(
        diffusionAICatTokenIds?.map(async (tokenId) => {
          try {
            const collectionName = await diffusionAICatContract.name()
            const sellPrice = await nftMarket.sellPrice(diffusionAICatContract.address, tokenId)
            const getToken = await diffusionAICatContract.getToken(tokenId)
            let name = tokenIdToName[tokenId]
            if (name.includes('#')) {
              const splitted = tokenIdToName[tokenId].split('#')
              name = `${splitted[0]}#${splitted[1]}`
            }
            const thumbnail = `/images/nfts/${collectionName.toLowerCase()}/${tokenId}`

            const nft: NFT = {
              ...getToken,
              ...sellPrice,
              collectionName,
              collectionAddress: diffusionAICatContract.address,
              name,
              thumbnail,
              chainId
            }
            tokens.unstaked.push(nftToNftToken(nft))
          } catch (error: any) {
            console.log(tokenId, error.reason ?? error.data?.message ?? error.message)
          }
        }),
      )

      const staked = await dfsMining.getTokensStakedByOwner(account)
      await Promise.all(
        staked?.map(async (tokenId) => {
          const collectionName = await socialNFT.name()
          const token = await socialNFT.getToken(tokenId)
          const sellPrice = await nftMarket.sellPrice(socialNFT.address, tokenId)
          const name = `${t(levelToName[token.level])}#${token.tokenId}`
          const thumbnail = `/images/nfts/${collectionName.toLowerCase()}/${token?.level}`
          const nft: NFT = {
            ...token,
            ...sellPrice,
            name,
            collectionAddress: socialNFT.address,
            collectionName,
            thumbnail,
            chainId
          }
          tokens.staked.push(nftToNftToken(nft))
        }),
      )
      const onSaleTokenIds = await socialNFT.tokensOfOwner(nftMarket.address)
      const onSaleDiffusionAICat = await diffusionAICatContract.tokensOfOwner(nftMarket.address)
      await Promise.all(
        onSaleTokenIds?.map(async (tokenId) => {
          const { seller, price } = await nftMarket.sellPrice(socialNFT.address, tokenId)
          if (seller === account) {
            const collectionName = await socialNFT.name()
            const getToken = await socialNFT.getToken(tokenId)
            const name = `${t(levelToName[getToken.level])}#${tokenId}`
            const thumbnail = `/images/nfts/${collectionName.toLowerCase()}/${getToken?.level}`
            const nft: NFT = {
              ...getToken,
              seller,
              price,
              name,
              collectionAddress: socialNFT.address,
              collectionName,
              thumbnail,
              chainId
            }
            tokens.onSale.push(nftToNftToken(nft))
          }
        }),
      )
      await Promise.all(
        onSaleDiffusionAICat?.map(async (tokenId) => {
          const { seller, price } = await nftMarket.sellPrice(diffusionAICatContract.address, tokenId)
          if (seller === account) {
            const collectionName = await diffusionAICatContract.name()
            const getToken = await diffusionAICatContract.getToken(tokenId)
            let name = tokenIdToName[tokenId]
            if (name.includes('#')) {
              const splitted = tokenIdToName[tokenId].split('#')
              name = `${t(splitted[0])}#${splitted[1]}`
            }
            const thumbnail = `/images/nfts/${collectionName.toLowerCase()}/${tokenId}`
            const nft: NFT = {
              ...getToken,
              seller,
              price,
              name,
              collectionAddress: diffusionAICatContract.address,
              collectionName,
              thumbnail,
              chainId
            }
            tokens.onSale.push(nftToNftToken(nft))
          }
        }),
      )
      setUnstakedNFTs(
        tokens.unstaked.sort((token1, token2) => {
          return token1.tokenId > token2.tokenId ? 1 : -1
        }),
      )
      setStakedNFTs(
        tokens.staked.sort((token1, token2) => {
          return token1.tokenId > token2.tokenId ? 1 : -1
        }),
      )
      setOnSaleNFT(
        tokens.onSale.sort((token1, token2) => {
          return token1.tokenId > token2.tokenId ? 1 : -1
        }),
      )
      return tokens
    }
    return { unstaked: [], staked: [], onSale: [] }
  }
  const { data, status, mutate } = useSWR(['getProfileToken'], getProfileToken)
  useEffect(() => {
    setUnstakedNFTs([])
    setStakedNFTs([])
    setOnSaleNFT([])
    mutate(getProfileToken())
  }, [account, accountAddress, isConnectedProfile])

  const handleSort = useCallback(
    (level: number) => {
      const filtered = unstakedNFTs.filter((nft: NftToken) => nft.collectionAddress === socialNFTAddress && nft.level === level)
      if (filtered.length > 0) {
        setUnstakedNFTs(filtered)
      } else {
        setUnstakedNFTs(unstakedNFTs)
      }
    },
    [sortField, data],
  )

  const resetPage = () => {
    setIsSelected(false)
    setSelectedCount(0)
    unstakedNFTs?.map((item) => {
      item.selected = false
    })
    selectedNFTs?.map((item) => {
      item.selected = false
    })
  }
  const changeTab = (key) => {
    resetPage()
    setActiveTab(key)
  }
  const startCompose = () => {
    setIsSelected(true)
    setSelectedNFTs(unstakedNFTs.filter((nft) => nft.collectionAddress === socialNFTAddress))
    setOption('compose')
  }

  const cancelOpt = () => {
    setIsSelected(false)
    resetPage()
  }

  const closeComposeSuccessModal = () => {
    setUnstakedNFTs(unstakedNFTs)
    setSuccessModalVisible(false)
    resetPage()
  }

  const submitCompose = async () => {
    const selected = selectedNFTs.filter((nft) => nft.collectionAddress === socialNFT.address && nft.selected)
    try {
      let tx
      if (selected[0]?.level === 0 && selected?.length === 3) {
        const selectedTokenIds = selected.map((x) => x.tokenId)
        tx = await socialNFT.ComposeLv0(selectedTokenIds)
      } else if (selected[0]?.level !== 0 && selected?.length === 2) {
        const selectedTokenIds = selected.map((x) => x.tokenId)
        tx = await socialNFT.ComposeLvX(selectedTokenIds)
      } else {
        setNoteContent({
          title: t('Note'),
          description: t("Amount or level doesn't match"),
          visible: true,
        })
        return
      }
      if (tx) {
        const recipient = await tx.wait()
        const id = BigNumber.from(recipient.events.slice(-1)[0].topics[3])
        const composedTokenId = id.toString()
        const { level } = await socialNFT.getToken(composedTokenId)
        const newNft: NftToken = {
          tokenId: composedTokenId,
          name: greeceNumber[level],
          description: levelToName[level],
          collectionName: levelToName[level],
          collectionAddress: socialNFTAddress,
          image: {
            original: 'string',
            thumbnail: `/images/nfts/socialnft/${level}`,
          },
          level,
          attributes: [
            {
              traitType: 'SPOS',
              value: levelToSPOS[level].validSPOS,
              displayType: '',
            },
          ],
          createdAt: '',
          updatedAt: '',
          location: NftLocation.FORSALE,
          marketData: {
            tokenId: composedTokenId,
            collection: {
              id: composedTokenId,
            },
            currentAskPrice: '0',
            currentSeller: accountAddress,
            isTradable: true,
          },
          staker: zeroAddress,
        }
        setComposedNFT([newNft])
        setConfirmModalVisible(false)
        setSuccessModalVisible(true)
        mutate(getProfileToken())
      }
    } catch (error: any) {
      window.alert(error.reason ?? error.data?.message ?? error.message)
    }
  }

  const startStake = async () => {
    setIsSelected(true)
    setSelectedNFTs(unstakedNFTs.filter((nft) => nft.collectionAddress === socialNFTAddress))
    setOption('stake')
  }

  const stakeNFT = async () => {
    setNoteContent({
      title: '',
      description: '',
      visible: false,
    })
    const selected = selectedNFTs.filter((item) => item.collectionAddress === socialNFT.address && item.selected)
    setSelectedNFTs(selected)
    if (option === 'stake' && selectedCount > 0) await submitStake(selected)
  }

  const submitStake = async (selected) => {
    const mineAddress = getMiningAddress(chainId)
    const tokenIds = selected.map((item) => item.tokenId)
    const approved = await socialNFT.isApprovedForAll(account, mineAddress)
    let receipt
    if (!approved) {
      receipt = await socialNFT.setApprovalForAll(mineAddress, true)
      await receipt.wait()
    }
    try {
      receipt = await dfsMining.stakeNFT(tokenIds)
      await receipt.wait()
      mutate(getProfileToken())
      selected.map((item) => (item.staker = !item.staker))
      selected.map((item) => (item.selected = !item.selected))
      resetPage()
      message.success('Stake success')
    } catch (error: any) {
      window.alert(error.reason ?? error.data?.message ?? error.message)
    }
  }

  const confirmOpt = async () => {
    const selected = selectedNFTs.filter((item) => item.selected)
    if (!selected?.length) {
      setNoteContent({
        title: t('Note'),
        description: t('Please select one NFT at least'),
        visible: true,
      })
      return
    }
    if (option === 'compose') {
      setConfirmModalVisible(true)
      return
    }
    if (option === 'stake') {
      setNoteContent({
        title: t('Note'),
        description: t('Obtain SPOS with staking and unstake anytime'),
        visible: true,
      })
    }
  }

  const selectNft = (nft: NftToken, index: number) => {
    if (option === 'compose') {
      const level = nft.level
      const sameLevel = unstakedNFTs.filter(
        (n, i) => n.collectionAddress === socialNFT.address && n.level === level && i >= index,
      )
      if (level === 0) {
        const toBeComposed = sameLevel.slice(0, 3)
        if (toBeComposed?.length < 3) {
          setNoteContent({
            title: t('Note'),
            description: t('Need 3 pieces'),
            visible: true,
          })
          return
        }
        toBeComposed.map((item: NftToken) => {
          if (item.level === level) {
            item.selected = !item.selected
          }
        })
        setSelectedNFTs(toBeComposed)
        setSelectedCount(toBeComposed.length)
      } else if (level === 6) {
        setNoteContent({
          title: t('Note'),
          description: t('Unable to compose highest level NFT'),
          visible: true,
        })
      } else {
        const toBeComposed = sameLevel.slice(0, 2)
        if (toBeComposed?.length < 2) {
          setNoteContent({
            title: t('Note'),
            description: t('Need 2') + t(levelToName[Number(sameLevel[0].level)]),
            visible: true,
          })
          return
        }
        toBeComposed.map((item: NftToken) => {
          if (item.level === level) {
            item.selected = !item.selected
          }
        })
        setSelectedNFTs(toBeComposed)
        setSelectedCount(toBeComposed.length)
      }
    } else if (option === 'stake') {
      if (nft.collectionAddress === socialNFT.address) {
        nft.selected = !nft.selected
        setSelectedCount(selectedNFTs?.filter((n) => n.selected).length)
      }
    }
  }

  return (
    <AccountNftWrap>
      {!isMobile && (
        <NftSculptureWrap isMobile={isMobile}>
          <NftSculptureGif isMobile={isMobile} src="/images/nfts/nft-sculpture.png" alt="" />
        </NftSculptureWrap>
      )}
      {!isMobile && (
        <BackgroundWrap isMobile={isMobile}>
          <BackgroundText>
            <BackgroundTitle>Diffusion DAO</BackgroundTitle>
            <BackgroundDes>
              {t(
                'This is your digital asset treasure silo, stake or compose NFTs to explore more possibilities where you can obtain more fulfilling rewards',
              )}
            </BackgroundDes>
          </BackgroundText>
        </BackgroundWrap>
      )}

      <ContentWrap>
        <SubMenuWrap>
          <Tabs
            defaultActiveKey={activeTab}
            onChange={changeTab}
            items={tabs?.map((item) => {
              return {
                label: (
                  <span>
                    {item.label}
                    <SelectedCountWrap>{item?.length}</SelectedCountWrap>
                  </span>
                ),
                key: item.key,
              }
            })}
          />

          <SubMenuRight>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              pr={[null, null, '4px']}
              pl={['4px', null, '0']}
              mb="8px"
            >
              <Flex width="max-content" style={{ gap: '4px' }} flexDirection="column">
                <Select
                  options={options}
                  placeHolderText={t('Select')}
                  defaultOptionIndex={SORT_FIELD_INDEX_MAP.get(sortField)}
                  onOptionChange={(o: OptionProps) => handleSort(o.value)}
                />
              </Flex>
            </Flex>
            {activeTab === 'Unstaked' && (
              <Button type="primary" style={{ marginLeft: '10px' }} size="middle" onClick={startStake}>
                {t('Stake')}
              </Button>
            )}
          </SubMenuRight>
        </SubMenuWrap>
        {activeTab === 'Unstaked' && (
          <ComposeBtnWrap isSelected={isSelected}>
            <ComposeBtnWrapImg src="/images/nfts/composeBtnWrap.png" />

            {isSelected ? (
              <>
                <SelectedCountBox>
                  {t('Selected')}
                  <SelectedCountWrap>{selectedCount}</SelectedCountWrap>
                </SelectedCountBox>
                <div>
                  <Button type="primary" size="middle" style={{ marginRight: '10px' }} onClick={confirmOpt}>
                    {t('Save')}
                  </Button>
                  <Button size="middle" onClick={cancelOpt}>
                    {t('Cancel')}
                  </Button>
                </div>
              </>
            ) : (
              <ComposeBtn
                src={currentLanguage === ZHCN ? '/images/nfts/compose-zhcn.svg' : '/images/nfts/compose-en.svg'}
                onClick={startCompose}
              />
            )}
          </ComposeBtnWrap>
        )}
        {isConnectedProfile ? (
          <UserNfts
            isSelected={isSelected}
            nfts={
              isSelected
                ? selectedNFTs
                : activeTab === 'Unstaked'
                ? unstakedNFTs
                : activeTab === 'Staked'
                ? stakedNFTs
                : onSaleNFTs
            }
            isLoading={false}
            selectNft={selectNft}
          />
        ) : (
          <UnconnectedProfileNfts
            nfts={
              isSelected
                ? selectedNFTs
                : activeTab === 'Unstaked'
                ? unstakedNFTs
                : activeTab === 'Staked'
                ? stakedNFTs
                : onSaleNFTs
            }
            isLoading={false}
          />
        )}
      </ContentWrap>
      {noteContent.visible ? (
        <CustomModal
          title={noteContent.title}
          description={noteContent.description}
          onClose={() => setNoteContent({ title: '', description: '', visible: false })}
          onConfirm={stakeNFT}
        />
      ) : null}
      {confirmModalVisible ? (
        <ComposeConfirmModal
          nfts={selectedNFTs}
          onDismiss={() => setConfirmModalVisible(false)}
          submitCompose={submitCompose}
        />
      ) : null}
      {successModalVisible ? <ComposeSuccessModal nfts={composedNFT} onClose={closeComposeSuccessModal} /> : null}
      {createPortal(<ScrollToTopButton />, document.body)}
    </AccountNftWrap>
  )
}

// NftProfilePage.Layout = NftProfileLayout

export default NftProfilePage
