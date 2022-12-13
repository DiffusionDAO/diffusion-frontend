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
import { formatBigNumber } from 'utils/formatBalance'
import { ZHCN } from '@pancakeswap/localization/src/config/languages'
import { Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import Select, { OptionProps } from 'components/Select/Select'
import { createPortal } from 'react-dom'
import ScrollToTopButton from 'components/ScrollToTopButton'

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
  8: 'Catman at DIffusiondao on Mars',
  9: 'court general',
  10: 'court Hierarch',
  11: 'court king#1',
  12: 'court king#2',
  13: 'court king#3',
  14: 'court king#4',
  15: 'court king#5',
  16: 'court king#6',
  17: 'court king#7',
  18: 'court nobility#1',
  19: 'court nobility#2',
  20: 'court nobility#3',
  21: 'court nobility#4',
  22: 'court nobility#5',
  23: 'court nobility#6',
  24: 'court queen#1',
  25: 'court queen#2',
  26: 'court queen#3',
  27: 'court queen#4',
  28: 'court queen#5',
  29: 'court queen#6',
  30: 'court queen#7',
  31: 'court queen#8',
  32: 'court queen#9',
  33: 'court queen#10',
  34: 'court nun#1',
  35: 'court nun#2',
  36: 'court nun#3',
  37: 'court nun#4',
  38: 'court nun#5',
  39: 'court pet',
  40: 'cowboy#1',
  41: 'cowboy#2',
  42: 'cowboy#3',
  43: 'cowboy#4',
  44: 'cowboy#5',
  45: 'cowboy#6',
  46: 'cowboy#7',
  47: 'cowboy#8',
  48: 'cowboy#9',
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
  65: 'future',
  66: 'gentleman#1',
  67: 'gentleman#2',
  68: 'gentleman#3',
  69: 'gentleman#4',
  70: 'gentleman#5',
  71: 'gentleman#6',
  72: 'gentleman#7',
  73: 'gentleman#8',
  74: 'gentleman#9',
  75: 'gentleman#10',
  76: 'gentleman#11',
  77: 'god of thunder',
  78: 'knight under the stars',
  79: 'money#1',
  80: 'money#2',
  81: 'money#3',
  82: 'money#4',
  83: 'money#5',
  84: 'money#6',
  85: 'money#9',
  86: 'money#10',
  87: 'money#8888',
  88: 'purple space#1',
  89: 'purple space#2',
  90: 'purple space#3',
  91: 'purple space#4',
  92: 'purple space#5',
  93: 'purple space#6',
  94: 'purple space#7',
  95: 'teenager#1',
  96: 'teenager#2',
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

const socialNFTAddress = getSocialNFTAddress()

export const nftToNftToken = (nft: NFT) => {
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
  const { account } = useWeb3React()
  const dfsNFTAddress = getSocialNFTAddress()
  const { t, currentLanguage } = useTranslation()
  const [stakedNFTs, setStakedNFTs] = useState<NftToken[]>()
  const [unstakedNFTs, setUnstakedNFTs] = useState<NftToken[]>()
  const [onSaleNFTs, setOnSaleNFT] = useState([])
  const [selectedNFTs, setSelectedNFTs] = useState<NftToken[]>([])
  const { isMobile } = useMatchBreakpoints()
  const { push, query } = useRouter()

  const accountAddress = query.accountAddress as string

  const isConnectedProfile = account?.toLowerCase() === accountAddress?.toLowerCase()
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
  const database = useNFTDatabaseContract()
  const diffusionAICatContract = useDiffusionAICatContract()

  const getProfileToken = async () => {
    const tokens = { unstaked: [], staked: [], onSale: [] }
    if (account) {
      const diffusionAICatTokenIds = await diffusionAICatContract.tokensOfOwner(account)
      const tokenIds = await socialNFT.tokensOfOwner(account)
      await Promise.all(
        tokenIds.map(async (tokenId) => {
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
            }
            tokens.unstaked.push(nftToNftToken(nft))
          } catch (error: any) {
            console.log(tokenId, error.reason ?? error.data?.message ?? error.message)
          }
        }),
      )
      await Promise.all(
        diffusionAICatTokenIds.map(async (tokenId) => {
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
            }
            tokens.unstaked.push(nftToNftToken(nft))
          } catch (error: any) {
            console.log(tokenId, error.reason ?? error.data?.message ?? error.message)
          }
        }),
      )

      const staked = await dfsMining.getTokensStakedByOwner(account)
      await Promise.all(
        staked.map(async (tokenId) => {
          const token = await socialNFT.getToken(tokenId)
          const sellPrice = await nftMarket.sellPrice(socialNFT.address, tokenId)
          const name = `${t(levelToName[token.level])}#${token.tokenId}`
          const nft: NFT = {
            ...token,
            ...sellPrice,
            collectionName: t('SocialNFT'),
            collectionAddress: socialNFT.address,
            name,
          }
          tokens.staked.push(nftToNftToken(nft))
        }),
      )
      const onSaleTokenIds = await socialNFT.tokensOfOwner(nftMarket.address)
      const onSaleDiffusionAICat = await diffusionAICatContract.tokensOfOwner(nftMarket.address)
      await Promise.all(
        onSaleTokenIds.map(async (tokenId) => {
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
            }
            tokens.onSale.push(nftToNftToken(nft))
          }
        }),
      )
      await Promise.all(
        onSaleDiffusionAICat.map(async (tokenId) => {
          const { seller, price } = await nftMarket.sellPrice(diffusionAICatContract.address, tokenId)
          if (seller === account) {
            const collectionName = await diffusionAICatContract.name()
            const getToken = await diffusionAICatContract.getToken(tokenId)
            let name = tokenIdToName[tokenId]
            if (name.includes('#')) {
              const splitted = tokenIdToName[tokenId].split('#')
              name = `${splitted[0]}#${splitted[1]}`
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
    const data = getProfileToken()
    mutate(data)
  }, [account, accountAddress])

  const handleSort = useCallback(
    (level: number) => {
      const filtered = unstakedNFTs.filter((nft: NftToken) => nft.level === level)
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
          collectionAddress: dfsNFTAddress,
          image: {
            original: 'string',
            thumbnail: `/images/nfts/socialnft/${level}`,
          },
          level,
          attributes: [
            {
              description: levelToSPOS[level].description,
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
    const mineAddress = getMiningAddress()
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
        (nft, i) => nft.collectionAddress === socialNFT.address && nft.level === level && i >= index,
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
        setSelectedCount(selectedNFTs?.filter((nft) => nft.selected).length)
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
            items={tabs.map((item) => {
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
              {/* <ToggleView idPrefix='clickCollection' viewMode={viewMode} onToggle={setViewMode} /> */}
              <Flex width="max-content" style={{ gap: '4px' }} flexDirection="column">
                <Select
                  options={options}
                  placeHolderText={t('Select')}
                  defaultOptionIndex={SORT_FIELD_INDEX_MAP.get(sortField)}
                  onOptionChange={(option: OptionProps) => handleSort(option.value)}
                />
              </Flex>
            </Flex>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              pr={[null, null, '4px']}
              pl={['4px', null, '0']}
              mb="8px"
            >
              {/* <ToggleView idPrefix='clickCollection' viewMode={viewMode} onToggle={setViewMode} /> */}
              <Flex width="max-content" style={{ gap: '4px' }} flexDirection="column">
                <Select
                  options={options}
                  placeHolderText={t('Select')}
                  defaultOptionIndex={SORT_FIELD_INDEX_MAP.get(sortField)}
                  onOptionChange={(option: OptionProps) => handleSort(option.value)}
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

NftProfilePage.Layout = NftProfileLayout

export default NftProfilePage
