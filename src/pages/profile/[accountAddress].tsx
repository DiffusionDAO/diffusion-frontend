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
const zeroAddress = '0x0000000000000000000000000000000000000000'
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
        traitType: '',
        value: level,
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
  const { t } = useTranslation()
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
  }, [data, status])
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
  const startCompound = () => {
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
            traitType: '',
            value: level,
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
      const response = await fetch('https://middle.diffusiondao.org/stakeNFT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: account,
          collection: dfsNFTAddress,
          nfts: selected,
        }),
      })
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
              <SyntheticBtn src="/images/nfts/synthetic-btn.svg" onClick={startCompound} />
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
