/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable no-await-in-loop */
/* eslint-disable vars-on-top */
/* eslint-disable block-scoped-var */
/* eslint-disable block-scoped-var */

import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'
import { useProfileForAddress } from 'state/profile/hooks'
import { NftProfileLayout } from 'views/Nft/market/Profile'
import UnconnectedProfileNfts from 'views/Nft/market/Profile/components/UnconnectedProfileNfts'
import UserNfts from 'views/Nft/market/Profile/components/UserNfts'
import {
  AccountNftWrap, SubMenuWrap, SubMenuRight, SelectWrap, CompoundBtnWrap, SelectedCountWrap, SyntheticBtn,
  CompoundBtnWrapImg, SelectedCountBox, BackgroundWrap, ConentWrap, BackgroundTitle, BackgroundDes,
  BackgroundText, NftSculptureWrap, NftSculptureGif, NftGearImg, NftBallImg
} from 'views/Nft/market/Profile/components/styles'
import useNftsForAddress from 'views/Nft/market/hooks/useNftsForAddress'
import { Cascader, Tabs, Button, message } from 'antd';
import { useTranslation } from 'contexts/Localization'
import { useState, useEffect, useCallback } from 'react'
import { NftToken } from 'state/nftMarket/types'
import cloneDeep from "lodash/cloneDeep";
import CompoundConfirmModal from 'views/Nft/market/Profile/components/CompoundConfirmModal'
import CompoundSuccessModal from 'views/Nft/market/Profile/components/CompoundSuccessModal'
import CustomModal from 'views/Nft/market/Profile/components/CustomModal'
import Typed from 'react-typed';
import nftDatasMock from 'views/Nft/market/Profile/MockNftDatas'
import { useSWRContract } from 'hooks/useSWRContract'
import { getNftMarketContract } from 'utils/contractHelpers'
import { ethers } from 'ethers'
import { useGetCollections } from 'state/nftMarket/hooks'
import { getDFSNFTAddress, getNFTComposeAddress } from 'utils/addressHelpers'
import { useDFSNftContract, useNftComposeContract } from 'hooks/useContract'
import { useSWRConfig } from 'swr'
import BigNumber from 'bignumber.js'
import { sleep } from 'helpers'
import { useMatchBreakpoints } from "../../../../packages/uikit/src/hooks";

const { TabPane } = Tabs;
interface noteProps {
  title: string;
  description: string;
  visible: boolean;
}
const zeroAddress = '0x0000000000000000000000000000000000000000'

function NftProfilePage() {
  const { account } = useWeb3React()
  const { isMobile } = useMatchBreakpoints();
  const { t } = useTranslation()
  const { route } = useRouter()
  const { query } = useRouter()

  const accountAddress = query.accountAddress as string
  console.log("accountAddress:",accountAddress)
  const [selectNfts, setSelectedNfts] = useState<NftToken[]>([])
  const [mynfts, setMynfts] = useState<NftToken[]>([])

  const isConnectedProfile = account?.toLowerCase() === accountAddress?.toLowerCase()
  const {
    profile, isValidating: isProfileFetching, refresh: refreshProfile,
  } = useProfileForAddress(accountAddress, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  })
  const {
    nfts, isLoading: isNftLoading,
  } = useNftsForAddress(accountAddress, profile, isProfileFetching)

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
    { label: t('Lord'), value: 'Lord', children: [{ label: t('silver'), value: 'silver' }, { label: t('golden'), value: 'golden' }] },
    { label: t('General'), value: 'General', children: [{ label: t('silver'), value: 'silver' }, { label: t('golden'), value: 'golden' }] },
    { label: t('Congressman'), value: 'Congressman', children: [{ label: t('silver'), value: 'silver' }, { label: t('golden'), value: 'golden' }] },
  ]

  const { data: collections, mutate } = useGetCollections() as any
  useEffect(() => {
    console.log("collections:",collections)
    const keys = Object.keys(collections)
    console.log("keys:",keys)
    const nfts = keys.map(key => collections[key].tokens.filter(item =>
      item.marketData.currentSeller === accountAddress && item.collectionAddress === dfsNFTAddress
    )).flat()
    console.log("nfts:",nfts)
    setMynfts(nfts)
  }, [account])

  const resetPage = () => {
    setIsSelected(false)
    setSelectedCount(0)
    const nftData = mynfts.map(item => { item.selected = false; return item })
    setMynfts(nftData)
  }
  const changeTab = (key) => {
    resetPage()
    setActiveTab(key)
  }
  const dfsNFTAddress = getDFSNFTAddress()
  const startCompound = () => {
    setIsSelected(true)
    setOption('compound')
    const dfsnft = mynfts.filter(item => item.collectionAddress === dfsNFTAddress)
    console.log("dfsnft:", dfsnft.length)
    setSelectedNfts(dfsnft)
  }

  const cancelOpt = () => {
    setIsSelected(false);
    resetPage()
  }

  const closeCompoundSuccessModal = () => {
    setSelectedNfts(mynfts)
    setSuccessModalVisible(false)
    resetPage()
  }

  const composeNFT = useNftComposeContract()
  const dfsNFT = useDFSNftContract()
  const submitCompound = async () => {
    const selectedTokenIds = selectNfts.filter(nft => nft.selected).map(nft => nft.tokenId)
    const composeAddress = getNFTComposeAddress()
    console.log("selectedToken:", selectedTokenIds)
    if (selectNfts.length === 6) {
      const tx = await composeNFT.ComposeLv0(selectedTokenIds)
      const recipient = await tx.wait()
      const id = new BigNumber(recipient.events.slice(-1)[0].topics[3])
      const tokenId = id.toString()
      while (true) {
        const res = await fetch(`https://middle.diffusiondao.org/nfts/collections`)
        if (res.ok) {
          const json = await res.json()
          const newnfts = Object.keys(json).map(key => json[key].tokens.filter(item =>
            item.marketData.currentSeller === accountAddress && item.collectionAddress === dfsNFTAddress
          )).flat()
          if (newnfts.length < mynfts.length) {
            console.log("tokenId:", tokenId)
            const composed = newnfts.filter(nft=>nft.tokenId === tokenId)
            console.log("composed:", composed)
            setComposedNFT(composed)
            setMynfts(newnfts)
            break
          }
          await sleep(0.5)
        }
      }
      selectNfts.map(nft => nft.marketData.currentSeller = zeroAddress)
      setConfirmModalVisible(false)
      setSuccessModalVisible(true)
    } else if (selectNfts.length === 2) {
      console.log(selectNfts)
      const attributesValue = selectNfts[0].attributes[0].value
      if (attributesValue > 0 && attributesValue === selectNfts[1].attributes[0].value) {
        console.log("mynfts:", mynfts.length, mynfts.slice(-1)[0])
        const tx = await composeNFT.ComposeLvX(selectedTokenIds, attributesValue)
        const recipient = await tx.wait()
        const id = new BigNumber(recipient.events.slice(-1)[0].topics[3])
        const tokenId = id.toString()
        while (true) {
          const res = await fetch(`https://middle.diffusiondao.org/nfts/collections`)
          if (res.ok) {
            const json = await res.json()
            const newnfts = Object.keys(json).map(key => json[key].tokens.filter(item =>
              item.marketData.currentSeller === accountAddress && item.collectionAddress === dfsNFTAddress
            )).flat()
            if (newnfts.length < mynfts.length) {
              const ids = newnfts.map(nft=>nft.tokenId)
              const composed = newnfts.filter(nft=>nft.tokenId === tokenId)
              setComposedNFT(composed)
              setMynfts(newnfts)
              break
            }
            await sleep(0.5)
          }
        }
        selectNfts.map(nft => nft.marketData.currentSeller = zeroAddress)
        setConfirmModalVisible(false)
        setSuccessModalVisible(true)
      } else {
        console.log(attributesValue, selectNfts[1].attributes[0].value)
      }

    }
  }

  const startStake = () => {
    setIsSelected(true)
    setOption('stake')
  }

  const noteConfirm = () => {
    setNoteContent({
      title: '',
      description: '',
      visible: false,
    })
    if (option === 'stake' && selectedCount > 0) submitStake()
  }

  const submitStake = () => {
    resetPage()
    message.success('Stake success')
  }

  const confirmOpt = () => {
    const selected = mynfts.filter(item => item.selected)
    setSelectedNfts(selected)
    if (!selected.length) {
      setNoteContent({
        title: t('Important note'),
        description: t('Please select one NFT at least'),
        visible: true,
      })
      return
    }
    if (option === 'compound') {
      if (selected.length % 2 !== 0 || !selected.length) {
        setNoteContent({
          title: t('Important note'),
          description: t('The NFTs you selected is across levels, please select the same color at the same level for composition'),
          visible: true,
        });
        return
      }
      setConfirmModalVisible(true)
      return
    }
    if (option === 'stake') {
      setNoteContent({
        title: t('Important note'),
        description: t('You will stake the NFT to the platform and a 15% handling fee will be charged when you cancel the stake'),
        visible: true,
      });
    }

  }

  const selectNft = (nft) => {
    const data = cloneDeep(mynfts)
    data.map((item: NftToken) => {
      const obj = item
      if (obj.tokenId === nft.tokenId) obj.selected = !obj.selected
      return obj
    })
    const count = data.filter(item => item.selected).length
    setMynfts(data)
    setSelectedCount(count)
  }

  return (
    <AccountNftWrap>
      <NftSculptureWrap isMobile={isMobile}>
        <NftSculptureGif isMobile={isMobile} src="/images/nfts/nft-sculpture.gif" alt="" />
        <NftGearImg isMobile={isMobile} src="/images/gear.png" alt="" />
        <NftBallImg isMobile={isMobile} src="/images/ball.png" alt="" />
      </NftSculptureWrap>
      <BackgroundWrap isMobile={isMobile}>
        <BackgroundText>
          <BackgroundTitle>
            <Typed
              strings={['DiffusionDAO']}
              typeSpeed={50}
              cursorChar=""
            />
          </BackgroundTitle>
          <BackgroundDes>Digtal market palce for crypto collectionbles and non-fungible tokens nfts</BackgroundDes>
        </BackgroundText>
      </BackgroundWrap>
      <ConentWrap>
        <SubMenuWrap>
          <Tabs defaultActiveKey={activeTab} onChange={changeTab}>
            <TabPane
              key="WithoutStake"
              tab={
                <span>
                  {`${t('Without the stake')}`}
                  <SelectedCountWrap>{mynfts?.length}</SelectedCountWrap>
                </span>
              }
            />
            <TabPane
              key="Stake"
              tab={
                <span>
                  {`${t('Has staked')}`}
                  <SelectedCountWrap>{mynfts?.length}</SelectedCountWrap>
                </span>
              }
            />
          </Tabs>
          <SubMenuRight>
            <SelectWrap>
              <Cascader
                options={sortByItems}
                style={{ width: "200px" }}
              />
            </SelectWrap>
            {
              activeTab === 'WithoutStake' &&
              <Button type="primary" style={{ marginLeft: '10px' }} size='middle' onClick={startStake}>{t('Stake')}</Button>
            }
          </SubMenuRight>
        </SubMenuWrap>
        <CompoundBtnWrap isSelected={isSelected}>
          <CompoundBtnWrapImg src="/images/nfts/compoundBtnWrap.png" />
          {
            isSelected ?
              <>
                <SelectedCountBox>
                  {t('Selected')}
                  <SelectedCountWrap>{selectedCount}</SelectedCountWrap>
                </SelectedCountBox>
                <div>
                  <Button type="primary" size='middle' style={{ marginRight: '10px' }} onClick={confirmOpt}>{t('Save')}</Button>
                  <Button size='middle' onClick={cancelOpt}>{t('Cancel')}</Button>
                </div>
              </> :
              <SyntheticBtn src="/images/nfts/synthetic-btn.svg" onClick={startCompound} />
          }

        </CompoundBtnWrap>
        {isConnectedProfile ? (
          <UserNfts
            isSelected={isSelected}
            nfts={mynfts}
            isLoading={isNftLoading}
            selectNft={selectNft}
          />
        ) : (
          <UnconnectedProfileNfts nfts={nfts} isLoading={isNftLoading} />
        )}
      </ConentWrap>
      {
        noteContent.visible ? <CustomModal title={noteContent.title} description={noteContent.description}
          onClose={() => setNoteContent({ title: '', description: '', visible: false })} onConfirm={noteConfirm} />
          : null
      }
      {
        confirmModalVisible ?
          <CompoundConfirmModal nfts={selectNfts} onDismiss={() => setConfirmModalVisible(false)} submitCompound={submitCompound} />
          : null
      }
      {
        successModalVisible ? <CompoundSuccessModal nfts={composedNFT} onClose={closeCompoundSuccessModal} />
          : null
      }
    </AccountNftWrap>
  )
}

NftProfilePage.Layout = NftProfileLayout

export default NftProfilePage
