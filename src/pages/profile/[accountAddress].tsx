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
} from 'hooks/useContract'
import useSWR from 'swr'
import { formatBigNumber } from 'utils/formatBalance'
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
export const nftToNftToken = (nft: NFT, t) => {
  const tokenId = nft?.tokenId?.toString()
  const level = nft?.level?.toString()
  const translatedName = `${t(levelToName[level])}#${tokenId}`
  const token: NftToken = {
    tokenId,
    name: translatedName,
    collectionName: nft.collectionName,
    description: nft.collectionName,
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
  const dfsNFTAddress = getSocialNFTAddress()
  const { t, currentLanguage } = useTranslation()
  const [stakedNFTs, setStakedNFTs] = useState<NftToken[]>()
  const [unstakedNFTs, setUnstakedNFTs] = useState<NftToken[]>()
  const [onSaleNFTs, setOnSaleNFT] = useState([])
  const [selectedNFTs, setSelectedNFTs] = useState<NftToken[]>(unstakedNFTs)
  const { isMobile } = useMatchBreakpoints()
  const { push, query } = useRouter()

  const accountAddress = query.accountAddress as string

  const isConnectedProfile = account?.toLowerCase() === accountAddress?.toLowerCase()
  if (account && !isConnectedProfile) {
    push(`/profile/${account?.toLowerCase()}`)
  }
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

  const nftDatabase = useNFTDatabaseContract()
  const nftMarket = useNftMarketContract()
  const dfsMining = useDFSMiningContract()
  const socialNFT = useSocialNftContract()

  const getProfileToken = async () => {
    // const collectionAddresses = await nftDatabase.getCollectionAddresses()
    const tokens = { unstaked: [], staked: [], onSale: [] }
    if (account) {
      let tokenIds = await socialNFT.getTokenIdsOfOwner(account)
      console.log('tokenIds:', tokenIds)
      await Promise.all(
        tokenIds.map(async (tokenId) => {
          const sellPrice = await nftMarket.sellPrice(socialNFT.address, tokenId)
          const token = await socialNFT.getToken(tokenId)
          const nft = { ...token, ...sellPrice }
          tokens.unstaked.push(nftToNftToken(nft, t))
        }),
      )
      tokenIds = await socialNFT.getTokenIdsOfOwner(nftMarket.address)
      await Promise.all(
        tokenIds.map(async (tokenId) => {
          const sellPrice = await nftMarket.sellPrice(socialNFT.address, tokenId)
          const token = await socialNFT.getToken(tokenId)
          const nft = { ...token, ...sellPrice }
          if (nft.seller === account) {
            tokens.onSale.push(nftToNftToken(nft, t))
          }
        }),
      )

      const staked = await dfsMining.getTokensStakedByOwner(dfsNFTAddress, account)
      await Promise.all(
        staked.map(async (tokenId) => {
          const token = await socialNFT.getToken(tokenId)
          tokens.staked.push(nftToNftToken(token, t))
        }),
      )
      return tokens
    }
    return { unstaked: [], staked: [], onSale: [] }
  }
  const { data, status, mutate } = useSWR(['nftDatabase.getCollectionTokenIds.getToken'], getProfileToken)
  useEffect(() => {
    setUnstakedNFTs([])
    setStakedNFTs([])
    setOnSaleNFT([])
    mutate(getProfileToken())
  }, [account, t, accountAddress])

  useEffect(() => {
    setUnstakedNFTs(data?.unstaked)
    setStakedNFTs(data?.staked)
    setOnSaleNFT(data?.onSale)
  }, [data])

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

  const closeComposeSuccessModal = () => {
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
        tx = await socialNFT.ComposeLv0(selectedTokenIds)
      } else {
        tx = await socialNFT.ComposeLvX(selectedTokenIds)
      }
      const recipient = await tx.wait()
      const id = BigNumber.from(recipient.events.slice(-1)[0].topics[3])
      const composedTokenId = id.toString()
      const level = await nftDatabase.getCollectionTokenLevel(socialNFT.address, composedTokenId)
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
      mutate(getProfileToken())
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
    console.log('tokenIds:', tokenIds)
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
    const selected = unstakedNFTs.filter((item) => item.selected)
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
        if (data?.length < 2) {
          setNoteContent({
            title: t('Note'),
            description: t('Need 2') + t(levelToName[Number(data[0].attributes[0].value)]),
            visible: true,
          })
          return
        }
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
            {activeTab === 'WithoutStake' && (
              <Button type="primary" style={{ marginLeft: '10px' }} size="middle" onClick={startStake}>
                {t('Stake')}
              </Button>
            )}
          </SubMenuRight>
        </SubMenuWrap>
        {activeTab === 'WithoutStake' && (
          <ComposeBtnWrap isSelected={isSelected}>
            <ComposeBtnWrapImg src="/images/nfts/compoundBtnWrap.png" />
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
    </AccountNftWrap>
  )
}

NftProfilePage.Layout = NftProfileLayout

export default NftProfilePage
