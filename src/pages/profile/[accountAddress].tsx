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
import { useNftsForAddress } from 'views/Nft/market/hooks/useNftsForAddress'
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
  NftGearImg,
  NftBallImg,
} from 'views/Nft/market/Profile/components/styles'
import CompoundConfirmModal from 'views/Nft/market/Profile/components/CompoundConfirmModal'
import CompoundSuccessModal from 'views/Nft/market/Profile/components/CompoundSuccessModal'
import CustomModal from 'views/Nft/market/Profile/components/CustomModal'
import { useGetCollections, useGetMyNfts } from 'state/nftMarket/hooks'
import { NftLocation, NftToken } from 'state/nftMarket/types'
import { getDFSNFTAddress, getMineAddress, getNFTComposeAddress } from 'utils/addressHelpers'
import { useDFSMineContract, useDFSNftContract, useNftComposeContract, useNftMarketContract } from 'hooks/useContract'

interface noteProps {
  title: string
  description: string
  visible: boolean
}
const zeroAddress = '0x0000000000000000000000000000000000000000'
const dfsName = {
  0: 'Lord fragment',
  1: 'Lord',
  2: 'Golden Lord',
  3: 'General',
  4: 'Golden General',
  5: 'Congressman',
  6: 'Golden Congressman',
}
const greeceNumber = { 0: 'I', 1: 'II', 2: 'III', 3: 'IV', 4: 'V', 5: 'VI', 6: 'VII' }

function NftProfilePage() {
  const { account } = useWeb3React()
  const { data: collections, status } = useGetCollections()
  localStorage?.setItem('nfts', JSON.stringify(collections))
  const dfsNFTAddress = getDFSNFTAddress()
  const collection: any = collections[dfsNFTAddress]
  const tokens = Object.values(collection.tokens).filter(
    (token: any) => token.owner === account?.toLowerCase() && !token.staked,
  ) as NftToken[]
  // const { data: collections, status } = useGetMyNfts(account, getDFSNFTAddress())

  const { isMobile } = useMatchBreakpoints()
  const { t } = useTranslation()
  const { query } = useRouter()

  const accountAddress = query.accountAddress as string
  const [selectedNfts, setSelectedNfts] = useState<NftToken[]>([])
  const [stakedNfts, setStakedNfts] = useState<NftToken[]>([])
  const [mynfts, setMynfts] = useState<NftToken[]>([])

  const isConnectedProfile = account?.toLowerCase() === accountAddress?.toLowerCase()

  const [isSelected, setIsSelected] = useState<boolean>(false)
  const [option, setOption] = useState<string>('')

  const [selectedCount, setSelectedCount] = useState<number>(0)
  const [composedNFT, setComposedNFT] = useState([])
  const [myMarketNFT, setMyMarketNFT] = useState([])

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
      label: t('Lord'),
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

  const composeNFT = useNftComposeContract()
  const dfsNFT = useDFSNftContract()
  const mine = useDFSMineContract()
  const market = useNftMarketContract()

  const DFSNFTCollection = tokens?.filter((item) => item?.collectionName === 'DFSNFT')

  useMemo(() => {
    if (DFSNFTCollection && mynfts.length === 0) {
      const unstaked = DFSNFTCollection?.filter((item) => !item.staked)
      setMynfts(unstaked)
    }
  }, [account, status])

  useEffect(() => {
    if (DFSNFTCollection[0] && stakedNfts.length === 0) {
      mine.getAllStaked(DFSNFTCollection[0].collectionAddress).then((tokenIds) => {
        const stakedTokenIds = tokenIds.map((tokenId) => tokenId.toString())
        console.log('stakedTokenIds:', stakedTokenIds)
        const staked = DFSNFTCollection.filter((nft) => stakedTokenIds.includes(nft.tokenId))
        console.log('staked:', staked)
        setStakedNfts(staked)
      })
    }
  }, [account, status])

  useEffect(() => {
    if (account) {
      market
        .getTokensOnSaleByOwner(account)
        .then((res) => {
          console.log('getTokensOnSaleByOwner', res)
          setMyMarketNFT(res)
        })
        .catch((error) => console.log(error))
    }
  }, [account, status])

  const resetPage = () => {
    setIsSelected(false)
    setSelectedCount(0)
    const nftData = mynfts.map((item) => {
      item.selected = false
      return item
    })
    setMynfts(nftData)
    setSelectedNfts(nftData)
  }
  const changeTab = (key) => {
    resetPage()
    setActiveTab(key)
  }
  const startCompound = () => {
    setIsSelected(true)
    setSelectedNfts(mynfts)

    setOption('compose')
    const dfsnft = mynfts.filter((item) => item.collectionAddress === dfsNFTAddress)
    setSelectedNfts(dfsnft)
  }

  const cancelOpt = () => {
    setIsSelected(false)
    resetPage()
  }

  const closeCompoundSuccessModal = () => {
    setSelectedNfts(mynfts)
    setSuccessModalVisible(false)
    resetPage()
  }

  const submitCompose = async () => {
    const selectedTokenIds = selectedNfts.filter((nft) => nft.selected).map((nft) => nft.tokenId)
    const attribute = selectedNfts[0].attributes[0].value
    const collection = selectedNfts[0].collectionAddress
    let tx
    try {
      if (selectedTokenIds.length === 6) {
        tx = await composeNFT.ComposeLv0(selectedTokenIds)
      } else {
        tx = await composeNFT.ComposeLvX(selectedTokenIds, attribute)
      }
      const recipient = await tx.wait()
      const id = BigNumber.from(recipient.events.slice(-1)[0].topics[3])
      const composedTokenId = id.toString()
      const level = await dfsNFT.getItems(composedTokenId)
      const newNft: NftToken = {
        tokenId: composedTokenId,
        name: greeceNumber[level],
        description: dfsName[level],
        collectionName: dfsName[level],
        collectionAddress: dfsNFTAddress,
        image: {
          original: 'string',
          thumbnail: `/images/nfts/${level}`,
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
          currentAskPrice: '',
          currentSeller: accountAddress,
          isTradable: true,
        },
        staked: false,
      }
      setComposedNFT([newNft])
      console.log('selectedTokenIds:', selectedTokenIds)

      const collections = JSON.parse(localStorage?.getItem('nfts'))
      selectedTokenIds.map((tokenId) => {
        delete collections[collection].tokens[tokenId]
      })
      collections[collection].tokens[composedTokenId] = newNft
      localStorage?.setItem('nfts', JSON.stringify(collections))

      const response = await fetch('https://middle.diffusiondao.org/composeNft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account,
          collection: dfsNFTAddress,
          selectedTokenIds,
          composedTokenId,
        }),
      })
      // let resp = await response.json() as NftToken[]
      // console.log(resp.length)
      // json.push(newNft)
      const json = Object.values(collections[dfsNFTAddress]?.tokens).filter(
        (token: any) => token.owner === account?.toLowerCase() && !token.staked,
      ) as NftToken[]
      console.log(json.length)
      setMynfts(json)
      setConfirmModalVisible(false)
      setSuccessModalVisible(true)
    } catch (error: any) {
      window.alert(error.reason ?? error.data?.message ?? error.message)
    }
  }

  const startStake = async () => {
    setIsSelected(true)
    setSelectedNfts(mynfts)
    setOption('stake')
  }

  const noteConfirm = async () => {
    setNoteContent({
      title: '',
      description: '',
      visible: false,
    })

    const selected = selectedNfts.filter((item) => item.selected)
    setSelectedNfts(selected)
    setSelectedCount(selected.length)
    const mineAddress = getMineAddress()
    const tokenIds = selected.map((item) => item.tokenId)
    const approved = await dfsNFT.isApprovedForAll(account, mineAddress)
    let receipt
    if (!approved) {
      receipt = await dfsNFT.setApprovalForAll(mineAddress, true)
      await receipt.wait()
    }
    const collection = selected[0].collectionAddress
    receipt = await mine.stakeNFT(collection, tokenIds)
    await receipt.wait()
    selected.map((item) => (item.staked = !item.staked))
    selected.map((item) => (item.selected = !item.selected))
    const staked = await mine.getAllStaked(collection)
    setStakedNfts(staked)
    setIsSelected(false)
    setSelectedNfts([])

    const collections = JSON.parse(localStorage?.getItem('nfts'))
    selected.map((item) => {
      collections[collection].tokens[item.tokenId].staked = true
    })
    console.log(selected, collections[collection].tokens[selected[0].tokenId].staked)
    localStorage?.setItem('nfts', JSON.stringify(collections))

    const response = await fetch('https://middle.diffusiondao.org/stakeNFT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: account,
        collection,
        nfts: selected,
      }),
    })
    // const unstaked = await response.json()
    const unstaked = Object.values(collections[dfsNFTAddress]?.tokens).filter(
      (token: any) => token.owner === account?.toLowerCase() && !token.staked,
    ) as NftToken[]
    console.log(unstaked)
    setMynfts(unstaked)

    if (option === 'stake' && selectedCount > 0) submitStake()
  }

  const submitStake = () => {
    const selected = selectedNfts.filter((item) => item.selected)
    setStakedNfts(selected)
    resetPage()
    message.success('Stake success')
  }

  const confirmOpt = async () => {
    const selected = selectedNfts.filter((item) => item.selected)
    setSelectedNfts(selected)
    if (!selected.length) {
      setNoteContent({
        title: t('Important notice'),
        description: t('Please select one NFT at least'),
        visible: true,
      })
      return
    }
    if (option === 'compose') {
      if (selected.length % 2 !== 0 || !selected.length) {
        setNoteContent({
          title: t('Important note'),
          description: t(
            'Your selection of NFTs are from different levels of the hierarchy, please select the same level of NFTs to combine',
          ),
          visible: true,
        })
        return
      }
      setConfirmModalVisible(true)
      return
    }
    if (option === 'stake') {
      setNoteContent({
        title: t('Important note'),
        description: t(
          'You will stake the NFT to the platform and a 15% handling fee will be charged when you cancel the stake',
        ),
        visible: true,
      })
    }
  }

  const selectNft = (nft) => {
    if (option === 'compose') {
      const level = nft.attributes[0].value
      const data = mynfts.filter((my) => my.attributes[0].value === level)
      data.map((item: NftToken) => {
        if (item.attributes[0].value === nft.attributes[0].value) {
          item.selected = !item.selected
        }
      })
      if (level === '0') {
        if (data.length < 6) {
          setNoteContent({
            title: t('Important note'),
            description: t('need 6 pieces'),
            visible: true,
          })
          return
        }
        const datas = data.slice(0, 6)
        setSelectedNfts(datas)
        setSelectedCount(datas.filter((item) => item.selected).length)
      } else {
        if (level === '6') {
          setNoteContent({
            title: t('Important note'),
            description: t('Unable to compose highest level NFT'),
            visible: true,
          })
          return
        }
        const datas = data.slice(0, 2)
        setSelectedNfts(datas)
        setSelectedCount(datas.filter((item) => item.selected).length)
      }
    } else if (option === 'stake') {
      nft.selected = !nft.selected
      setSelectedCount(selectedCount + 1)
    }
  }
  const tabs = [
    { key: 'WithoutStake', label: t('Not Staked'), length: mynfts?.length },
    { key: 'Stake', label: t('Staked'), length: stakedNfts?.length },
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
                    <SelectedCountWrap>{item.length}</SelectedCountWrap>
                  </span>
                ),
                key: item.key,
              }
            })}
          />

          <SubMenuRight>
            <SelectWrap>
              <Cascader options={sortByItems} style={{ width: '200px' }} />
            </SelectWrap>
            {activeTab === 'WithoutStake' && (
              <Button type="primary" style={{ marginLeft: '10px' }} size="middle" onClick={startStake}>
                {t('Stake')}
              </Button>
            )}
          </SubMenuRight>
        </SubMenuWrap>
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
        {isConnectedProfile ? (
          <UserNfts
            isSelected={isSelected}
            nfts={activeTab === 'WithoutStake' ? (isSelected ? selectedNfts : mynfts) : stakedNfts}
            isLoading={false}
            selectNft={selectNft}
          />
        ) : (
          <UnconnectedProfileNfts
            nfts={activeTab === 'WithoutStake' ? (isSelected ? selectedNfts : mynfts) : stakedNfts}
            isLoading={false}
          />
        )}
      </ConentWrap>
      {noteContent.visible ? (
        <CustomModal
          title={noteContent.title}
          description={noteContent.description}
          onClose={() => setNoteContent({ title: '', description: '', visible: false })}
          onConfirm={noteConfirm}
        />
      ) : null}
      {confirmModalVisible ? (
        <CompoundConfirmModal
          nfts={selectedNfts}
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
