/* eslint-disable no-param-reassign */
import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'
import { useProfileForAddress } from 'state/profile/hooks'
import { NftProfileLayout } from 'views/Nft/market/Profile'
import UnconnectedProfileNfts from 'views/Nft/market/Profile/components/UnconnectedProfileNfts'
import UserNfts from 'views/Nft/market/Profile/components/UserNfts'
import {
  AccountNftWrap, SubMenuWrap, SelectWrap, CompoundBtnWrap, SelectedCountWrap, SyntheticBtn,
  CompoundBtnWrapImg, SelectedCountBox, BackgroundWrap, ConentWrap, BackgroundTitle, BackgroundDes,
  BackgroundText, NftSculptureWrap, NftSculptureGif, NftGearImg, NftBallImg
} from 'views/Nft/market/Profile/components/styles'
import useNftsForAddress from 'views/Nft/market/hooks/useNftsForAddress'
import { Cascader, Tabs, Button } from 'antd';
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
import { useNftComposeContract } from 'hooks/useContract'
import { useMatchBreakpoints } from "../../../../packages/uikit/src/hooks";

const { TabPane } = Tabs;

function NftProfilePage() {
  const { account } = useWeb3React()
  const { isMobile } = useMatchBreakpoints();
  const { t } = useTranslation()
  const route = useRouter().route
  const query = useRouter().query

  const accountAddress = query.accountAddress as string
  console.log("accountAddress:", accountAddress)

  // const nftMarketContract = getNftMarketContract()
  // const { data } = useSWRContract([nftMarketContract, 'fetchMarketItems'])
  // console.log("data:", data)

  const collections: any = useGetCollections()
  const keys = Object.keys(collections.data)
  console.log(keys)
  // console.log("collections:", collections.data)


  const mynfts = keys.map(key => collections.data[key].tokens.filter(item =>
    item.marketData.currentSeller === accountAddress
  )).flat()
  console.log("mynfts:", mynfts)

  const [selectNfts, setSelectedNfts] = useState<NftToken[]>(mynfts)

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

  const [isCompound, setIsCompound] = useState(false)

  const [selectedCount, setSelectedCount] = useState<number>(0)
  const [composedNFT, setComposedNFT] = useState()

  const [confirmModalVisible, setConfirmModalVisible] = useState(false)
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [noteModalVisible, seNoteModalVisible] = useState(false)
  const [modalTitle, seNoteModalTitle] = useState('')
  const [modalDescription, setModalDescription] = useState('')

  const sortByItems = [
    { label: t('Lord'), value: 'Lord', children: [{ label: t('silver'), value: 'silver' }, { label: t('golden'), value: 'golden' }] },
    { label: t('General'), value: 'General', children: [{ label: t('silver'), value: 'silver' }, { label: t('golden'), value: 'golden' }] },
    { label: t('Congressman'), value: 'Congressman', children: [{ label: t('silver'), value: 'silver' }, { label: t('golden'), value: 'golden' }] },
  ]

  const startCompound = () => {
    setIsCompound(true)

    const dfsnft = selectNfts.filter(item => item.collectionAddress === getDFSNFTAddress())
    setSelectedNfts(dfsnft)
    // console.log("dfsnft:",dfsnft)
  }

  const cancelCompound = () => {
    setSelectedNfts(mynfts)
    setIsCompound(false)
  }

  const closeCompoundSuccessModal = () => {
    setSelectedNfts(mynfts)
    setSuccessModalVisible(false)
    setIsCompound(false)
    selectNfts.map((item) => { item.selected = false; return item })
    setSelectedCount(0)
  }

  const composeNFT = useNftComposeContract()
  const submitCompound = async () => {
    const selectedToken = selectNfts.filter(nft => nft.selected).map(nft => nft.tokenId)
    
    console.log("selectedToken:", selectedToken)
    if (selectNfts.length === 6) {
      const id = await composeNFT.ComposeLv0(selectedToken)
      // console.log("id:", id)
      // const item = await composeNFT.getItems(id)
      // setComposedNFT(item)
      setConfirmModalVisible(false)
      setSuccessModalVisible(true)
    } else if (selectNfts.length === 2 ) {
      if (selectNfts[0].attributes[0].value === selectNfts[1].attributes[0].value) {
        const id = await composeNFT.ComposeLvX(selectedToken,selectNfts[0].attributes[0].value)
        // console.log("id:", id)
        // const item = await composeNFT.getItems(id)
        // setComposedNFT(item)
        setConfirmModalVisible(false)
        setSuccessModalVisible(true)
      } else {
        console.log(selectNfts[0].attributes[0].value, selectNfts[1].attributes[0].value)
        // seNoteModalTitle('Important note')
        // setModalDescription(selectNfts[0].attributes[0].value, selectNfts[1].attributes[0].value)
        // seNoteModalVisible(true)
      }

    }


  }

  const confirmCompound = () => {
    const selected = selectNfts.filter(item => item.selected)
    setSelectedNfts(selected)
    if (selected.length % 2 !== 0 || !selected.length) {
      seNoteModalTitle('Important note')
      setModalDescription('The NFTs you selected is across levels, please select the same color at the same level for composition')
      seNoteModalVisible(true)
      return
    }
    setConfirmModalVisible(true)
  }

  const selectNft = (nft) => {
    nft.selected = !nft.selected
    const count = selectNfts.filter(item => item.selected).length
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
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={
                <span>
                  {`${t('NFTs')}`}
                  <SelectedCountWrap>{selectNfts?.length}</SelectedCountWrap>
                </span>
              }
            />
          </Tabs>
          <SelectWrap>
            <Cascader
              options={sortByItems}
              style={{ width: "200px" }}
            />
          </SelectWrap>
        </SubMenuWrap>
        <CompoundBtnWrap isCompound={isCompound}>
          <CompoundBtnWrapImg src="/images/nfts/compoundBtnWrap.png" />
          {
            isCompound ?
              <>
                <SelectedCountBox>
                  {t('Selected')}
                  <SelectedCountWrap>{selectedCount}</SelectedCountWrap>
                </SelectedCountBox>
                <div>
                  <Button type="primary" size='middle' style={{ marginRight: '10px' }} onClick={confirmCompound}>{t('Save')}</Button>
                  <Button size='middle' onClick={cancelCompound}>{t('Cancel')}</Button>
                </div>
              </> :
              <SyntheticBtn src="/images/nfts/synthetic-btn.svg" onClick={startCompound} />
          }

        </CompoundBtnWrap>
        {isConnectedProfile ? (
          <UserNfts
            isCompound={isCompound}
            nfts={selectNfts}
            isLoading={isNftLoading}
            selectNft={selectNft}
          />
        ) : (
          <UnconnectedProfileNfts nfts={nfts} isLoading={isNftLoading} />
        )}
      </ConentWrap>
      {
        noteModalVisible ? <CustomModal title={modalTitle} description={modalDescription} onClose={() => seNoteModalVisible(false)} />
          : null
      }
      {
        confirmModalVisible ?
          <CompoundConfirmModal nfts={selectNfts} onDismiss={() => setConfirmModalVisible(false)} submitCompound={submitCompound} />
          : null
      }
      {
        successModalVisible ? <CompoundSuccessModal nfts={selectNfts} onClose={closeCompoundSuccessModal} />
          : null
      }
    </AccountNftWrap>
  )
}

NftProfilePage.Layout = NftProfileLayout

export default NftProfilePage
