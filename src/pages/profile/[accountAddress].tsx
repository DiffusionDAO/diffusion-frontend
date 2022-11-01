/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable no-await-in-loop */
/* eslint-disable array-callback-return */
/* eslint-disable array-callback-return */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useRouter } from 'next/router'
import { useProfileForAddress } from 'state/profile/hooks'
import Typed from 'react-typed'
import { Cascader, Tabs, Button, message } from 'antd'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
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
  CompoundBtnWrap,
  SelectedCountWrap,
  SyntheticBtn,
  CompoundBtnWrapImg,
  SelectedCountBox,
  BackgroundWrap,
  ConentWrap,
  BackgroundTitle,
  BackgroundDes,
  BackgroundText,
  NftSculptureWrap,
  NftSculptureGif,
} from 'views/Nft/market/Profile/components/styles'
import CompoundConfirmModal from 'views/Nft/market/Profile/components/CompoundConfirmModal'
import CompoundSuccessModal from 'views/Nft/market/Profile/components/CompoundSuccessModal'
import CustomModal from 'views/Nft/market/Profile/components/CustomModal'
import { NftLocation, NftToken } from 'state/nftMarket/types'
import { getDFSNFTAddress, getMiningAddress, getNFTComposeAddress, getNftMarketAddress } from 'utils/addressHelpers'
import {
  useNFTDatabaseContract,
  useDFSMineContract,
  useDFSNftContract,
  useNftComposeContract,
  useNftMarketContract,
} from 'hooks/useContract'
import useSWR from 'swr'
import { setTokenSourceMapRange } from 'typescript'
import { formatBigNumber } from 'utils/formatBalance'
import { zhCN } from 'date-fns/locale'
import { ZHCN } from '@pancakeswap/localization/src/config/languages'

interface noteProps {
  title: string
  description: string
  visible: boolean
}

export interface NFT {
  tokenId: BigNumber
  owner: string
  staker: string
  level: BigNumber
  seller: string
  price: BigNumber
  itemId: BigNumber
  collectionName: string
  collectionAddress: string
  createdAt: BigNumber
  updatedAt: BigNumber
}
export interface CollectionData {
  collectionAddress: string
  name: string
  totalVolume: string
  totalSupply: string
  avatar: string
  banner: {
    large: string
    small: string
  }
}
export const zeroAddress = '0x0000000000000000000000000000000000000000'
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
    description: '智者碎片是DIffusion socialfi 宇宙的基础元素，所有的治理NFT都由碎片组成',
  },
  '1': {
    validSPOS: 63,
    unlockableSPOS: 126,
    description: '智者NFT是DIffusion socialfi 宇宙的初阶治理型社交NFT，拥有智者NFT意味着开启了一段有无限可能的WEB3之旅',
  },
  '2': {
    validSPOS: 128,
    unlockableSPOS: 256,
    description:
      '金色智能需要两位智者NFT才能生成，拥有金色智者的人在一定程度上意味着对整个生态有了不错的理解，理解WEB3的人一定是闪烁着金色光芒的智慧之人',
  },
  '3': {
    validSPOS: 262,
    unlockableSPOS: 524,
    description:
      '将军NFT需要两位金色智者NFT才能生成，将军的持有人除了对web3有所了解之外，一定有开拓与组建DAO组织的能力，并帮助更多的人进入到新世界，故而持有者，将军是也',
  },
  '4': {
    validSPOS: 534,
    unlockableSPOS: 1068,
    description:
      '金色将军NFT需要两位将军NFT才能生成，金色将军闪烁着迷人的光芒，这迷人的光芒会影响和帮助更多的人进入到全新的拥有无限机会的数字空间',
  },
  '5': {
    validSPOS: 1091,
    unlockableSPOS: 2182,
    description:
      '议员NFT需要两位金色将军NFT才能生成，议员的组成拥有影响DIffusiondao多元宇宙的能量，并在多元宇宙开启时成为新平行宇宙的创始人与股东',
  },
  '6': {
    validSPOS: 2225,
    unlockableSPOS: 4450,
    description:
      '皇冠议员NFT需要两位议员NFT才能生成，皇冠议员是整个DIffusiondao多元宇宙中分量最高的一类NFT，他象征着勇气智慧与权利，皇冠议员将带领WEB3新居民开启伟大的WEB3征程',
  },
}
export const nftToNftToken = (nft: NFT, t) => {
  const tokenIdString = nft?.tokenId?.toString()
  const level = nft?.level?.toString()
  const translatedName = t(levelToName[level])
  const token = {
    tokenId: tokenIdString,
    name: `${translatedName}#${tokenIdString}`,
    description: levelToName[level],
    collectionName: nft.collectionName,
    collectionAddress: nft.collectionAddress,
    image: {
      original: 'string',
      thumbnail: `/images/nfts/socialnft/${level}`,
    },
    attributes: [
      {
        traitType: 'Level',
        value: level,
        displayType: '',
      },
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
      tokenId: tokenIdString,
      collection: {
        id: tokenIdString,
      },
      currentAskPrice: formatBigNumber(nft?.price, 3),
      currentSeller: nft?.seller,
      isTradable: true,
    },
    staker: nft?.staker,
    owner: nft?.owner,
    seller: nft?.seller,
  }
  return token
}
function NftProfilePage() {
  const { account } = useWeb3React()
  const dfsNFTAddress = getDFSNFTAddress()
  const { t, currentLanguage } = useTranslation()
  const [stakedNFTs, setStakedNFTs] = useState<NftToken[]>()
  const [unstakedNFTs, setUnstakedNFTs] = useState<NftToken[]>()
  const [onSaleNFTs, setOnSaleNFT] = useState([])
  const [selectedNFTs, setSelectedNFTs] = useState<NftToken[]>(unstakedNFTs)

  const nftDatabase = useNFTDatabaseContract()
  const nftMarket = useNftMarketContract()
  const dfsMining = useDFSMineContract()

  const translate = t('Wiseman')
  // console.log("translate:",translate)
  const updateFn = async () => {
    const collectionAddresses = await nftDatabase.getCollectionAddresses()
    const tokens = { unstaked: [], staked: [], onSale: [] }
    if (account) {
      await Promise.all(
        collectionAddresses.map(async (collectionAddress) => {
          const nfts: NFT[] = await nftDatabase.getTokensOfOwner(collectionAddress, account)
          // console.log(nfts.map(nft=>nft.tokenId.toString()))
          nfts
            .filter((nft) => nft.collectionAddress === dfsNFTAddress)
            .map((nft) => tokens.unstaked.push(nftToNftToken(nft, t)))
        }),
      )
      await Promise.all(
        collectionAddresses.map(async (collectionAddress) => {
          const marketItem = await nftMarket.getTokensOnSaleByOwner(account)
          await Promise.all(
            marketItem.map(async (token) => {
              tokens.onSale.push(nftToNftToken(await nftDatabase.getToken(collectionAddress, token.tokenId), t))
            }),
          )
        }),
      )
      await Promise.all(
        collectionAddresses.map(async (collectionAddress) => {
          const staked = await dfsMining.getTokensStakedByOwner(dfsNFTAddress, account)
          await Promise.all(
            staked.map(async (tokenId) => {
              const token = await nftDatabase.getToken(collectionAddress, tokenId)
              if (token.collectionAddress === dfsNFTAddress) {
                tokens.staked.push(nftToNftToken(token, t))
              }
            }),
          )
        }),
      )
      return tokens
    }
    return { unstaked: [], staked: [], onSale: [] }
  }
  const { data, status, mutate } = useSWR(['nftDatabase.getCollectionTokenIds.getToken'], updateFn)
  useEffect(() => {
    mutate(updateFn())
  }, [account, t])
  useEffect(() => {
    setUnstakedNFTs(data?.unstaked?.filter((token) => token.owner !== zeroAddress))
    setStakedNFTs(data?.staked?.filter((token) => token.owner !== zeroAddress))
    setOnSaleNFT(data?.onSale?.filter((token) => token.seller === account))
  }, [data, status, account])
  const composeNFT = useNftComposeContract()
  const socialNFT = useDFSNftContract()
  const mine = useDFSMineContract()
  const market = useNftMarketContract()

  const { isMobile } = useMatchBreakpoints()
  const { query } = useRouter()

  const accountAddress = query.accountAddress as string

  const isConnectedProfile = account?.toLowerCase() === accountAddress?.toLowerCase()

  const [isSelected, setIsSelected] = useState<boolean>(false)
  const [option, setOption] = useState<string>('')

  const [selectedCount, setSelectedCount] = useState<number>(0)
  const [composedNFT, setComposedNFT] = useState([])

  const [confirmModalVisible, setConfirmModalVisible] = useState(false)
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [noteContent, setNoteContent] = useState<noteProps>({
    title: '',
    description: '',
    visible: false,
  })
  const [activeTab, setActiveTab] = useState<string>('WithoutStake')

  const sortByItems = [
    {
      label: t('Wiseman'),
      value: 'Lord',
      children: [
        { label: t('silver'), value: 'silver' },
        { label: t('golden'), value: 'golden' },
      ],
    },
    {
      label: t('General'),
      value: 'General',
      children: [
        { label: t('silver'), value: 'silver' },
        { label: t('golden'), value: 'golden' },
      ],
    },
    {
      label: t('Congressman'),
      value: 'Congressman',
      children: [
        { label: t('silver'), value: 'silver' },
        { label: t('golden'), value: 'golden' },
      ],
    },
  ]

  const resetPage = () => {
    setIsSelected(false)
    setSelectedCount(0)
    unstakedNFTs?.map((item) => {
      item.selected = false
    })
    setSelectedNFTs(unstakedNFTs)
  }
  const changeTab = (key) => {
    resetPage()
    setActiveTab(key)
  }
  const startCompose = () => {
    setIsSelected(true)
    setUnstakedNFTs(unstakedNFTs)
    setSelectedNFTs(unstakedNFTs)
    setOption('compose')
  }

  const cancelOpt = () => {
    setIsSelected(false)
    resetPage()
  }

  const closeCompoundSuccessModal = () => {
    setUnstakedNFTs(unstakedNFTs)
    setSuccessModalVisible(false)
    resetPage()
  }

  const submitCompose = async () => {
    const selectedTokenIds = selectedNFTs.filter((nft) => nft.selected).map((nft) => nft.tokenId)
    const value = selectedNFTs[0].attributes[0].value
    let tx
    try {
      if (selectedTokenIds?.length === 3) {
        tx = await composeNFT.ComposeLv0(selectedTokenIds)
      } else {
        tx = await composeNFT.ComposeLvX(selectedTokenIds, value)
      }
      const recipient = await tx.wait()
      const id = BigNumber.from(recipient.events.slice(-1)[0].topics[3])
      const composedTokenId = id.toString()
      const level = await socialNFT.getItems(composedTokenId)
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
        attributes: [
          {
            traitType: 'Level',
            value: level,
            displayType: '',
          },
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
      mutate(updateFn())
    } catch (error: any) {
      window.alert(error.reason ?? error.data?.message ?? error.message)
    }
  }

  const startStake = async () => {
    setIsSelected(true)
    setUnstakedNFTs(unstakedNFTs)
    setSelectedNFTs(unstakedNFTs)
    setOption('stake')
  }

  const stakeNFT = async () => {
    setNoteContent({
      title: '',
      description: '',
      visible: false,
    })
    const selected = unstakedNFTs.filter((item) => item.selected)
    setSelectedNFTs(selected)
    setSelectedCount(selected?.length)
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
      receipt = await mine.stakeNFT(dfsNFTAddress, tokenIds)
      await receipt.wait()
      mutate(updateFn())
      selected.map((item) => (item.staker = !item.staker))
      selected.map((item) => (item.selected = !item.selected))
      resetPage()
      message.success('Stake success')
    } catch (error: any) {
      window.alert(error.reason ?? error.data?.message ?? error.message)
    }
  }

  const confirmOpt = async () => {
    const selected = unstakedNFTs.filter((item) => item.selected)
    setSelectedNFTs(selected)
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

  const selectNft = (nft) => {
    if (option === 'compose') {
      const level = nft.attributes[0].value
      const data = selectedNFTs.filter((nft) => nft.attributes[0].value === level)
      console.log('data:', data)
      if (level === '0') {
        if (data?.length < 3) {
          setNoteContent({
            title: t('Note'),
            description: t('Need 3 pieces'),
            visible: true,
          })
          return
        }
        data.slice(0, 3).map((item: NftToken) => {
          if (item.attributes[0].value === nft.attributes[0].value) {
            item.selected = !item.selected
          }
        })
        setSelectedNFTs(data.slice(0, 3))
      } else if (level === '6') {
        setNoteContent({
          title: t('Note'),
          description: t('Unable to compose highest level NFT'),
          visible: true,
        })
      } else {
        data.slice(0, 2).map((item: NftToken) => {
          if (item.attributes[0].value === nft.attributes[0].value) {
            item.selected = !item.selected
          }
        })
        setSelectedNFTs(data.slice(0, 2))
      }
    } else if (option === 'stake') {
      nft.selected = !nft.selected
    }
    const selected = selectedNFTs.filter((item) => item.selected)
    setSelectedCount(selected?.length)
  }
  const tabs = [
    { key: 'WithoutStake', label: t('Not Staked'), length: unstakedNFTs?.length ?? 0 },
    { key: 'Staked', label: t('Staked'), length: stakedNFTs?.length ?? 0 },
    { key: 'OnSale', label: t('On Sale'), length: onSaleNFTs?.length ?? 0 },
  ]

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
            <BackgroundTitle>
              Diffusion DAO
              {/* <Typed strings={['Diffusion DAO']} typeSpeed={50} cursorChar="" /> */}
            </BackgroundTitle>
            <BackgroundDes>
              {t(
                'This is your digital asset treasure silo, stake or combine NFTs to explore more possibilities where you can obtain more fulfilling rewards',
              )}
            </BackgroundDes>
          </BackgroundText>
        </BackgroundWrap>
      )}

      <ConentWrap>
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
            {/* <SelectWrap>
              <Cascader options={sortByItems} style={{ width: '200px' }} />
            </SelectWrap> */}
            {activeTab === 'WithoutStake' && (
              <Button type="primary" style={{ marginLeft: '10px' }} size="middle" onClick={startStake}>
                {t('Stake')}
              </Button>
            )}
          </SubMenuRight>
        </SubMenuWrap>
        {activeTab === 'WithoutStake' && (
          <CompoundBtnWrap isSelected={isSelected}>
            <CompoundBtnWrapImg src="/images/nfts/compoundBtnWrap.png" />
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
              <SyntheticBtn
                src={currentLanguage === ZHCN ? '/images/nfts/compose-zhcn.svg' : '/images/nfts/compose-en.svg'}
                onClick={startCompose}
              />
            )}
          </CompoundBtnWrap>
        )}
        {isConnectedProfile ? (
          <UserNfts
            isSelected={isSelected}
            nfts={
              isSelected
                ? selectedNFTs
                : activeTab === 'WithoutStake'
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
                : activeTab === 'WithoutStake'
                ? unstakedNFTs
                : activeTab === 'Staked'
                ? stakedNFTs
                : onSaleNFTs
            }
            isLoading={false}
          />
        )}
      </ConentWrap>
      {noteContent.visible ? (
        <CustomModal
          title={noteContent.title}
          description={noteContent.description}
          onClose={() => setNoteContent({ title: '', description: '', visible: false })}
          onConfirm={stakeNFT}
        />
      ) : null}
      {confirmModalVisible ? (
        <CompoundConfirmModal
          nfts={selectedNFTs}
          onDismiss={() => setConfirmModalVisible(false)}
          submitCompose={submitCompose}
        />
      ) : null}
      {successModalVisible ? <CompoundSuccessModal nfts={composedNFT} onClose={closeCompoundSuccessModal} /> : null}
    </AccountNftWrap>
  )
}

NftProfilePage.Layout = NftProfileLayout

export default NftProfilePage
