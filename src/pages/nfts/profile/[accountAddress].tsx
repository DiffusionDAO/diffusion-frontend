import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'
import { useProfileForAddress } from 'state/profile/hooks'
import { NftProfileLayout } from 'views/Nft/market/Profile'
import UnconnectedProfileNfts from 'views/Nft/market/Profile/components/UnconnectedProfileNfts'
import UserNfts from 'views/Nft/market/Profile/components/UserNfts'
import { AccountNftWrap, SubMenuWrap, SelectWrap, CompoundBtnWrap, SelectedCountWrap, SyntheticBtn, 
  CompoundBtnWrapImg, SelectedCountBox, BackgroundWrap, ConentWrap, BackgroundTitle, BackgroundDes, 
  BackgroundText, BackgroundImg, } from 'views/Nft/market/Profile/components/styles'
import useNftsForAddress from 'views/Nft/market/hooks/useNftsForAddress'
import { Cascader, Tabs, Button } from 'antd';
import { useTranslation } from 'contexts/Localization'
import { useState, useEffect } from 'react'
import { NftToken } from 'state/nftMarket/types'
import cloneDeep from "lodash/cloneDeep";
import CompoundConfirmModal from 'views/Nft/market/Profile/components/CompoundConfirmModal'
import CompoundSuccessModal from 'views/Nft/market/Profile/components/CompoundSuccessModal'
import CustomModal from 'views/Nft/market/Profile/components/CustomModal'
import Typed from 'react-typed';
import nftDatasMock from 'views/Nft/market/Profile/MockNftDatas'

const { TabPane } = Tabs;

function NftProfilePage() {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const accountAddress = useRouter().query.accountAddress as string
  const isConnectedProfile = account?.toLowerCase() === accountAddress?.toLowerCase()
  const {
    profile, isValidating: isProfileFetching, refresh: refreshProfile,
  } = useProfileForAddress(accountAddress, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  })
  const {
    nfts, isLoading: isNftLoading, refresh: refreshUserNfts,
  } = useNftsForAddress(accountAddress, profile, isProfileFetching)

  console.log("nfts:", nfts)
  const [isCompound, setIsCompound] = useState(false)
  const [selectNfts, setSelectedNfts] = useState<NftToken[]>([])

  const [nftDatas, setNftDatas] = useState<NftToken[]>(nftDatasMock)
  const [selectedCount, setSelectedCount] = useState<number>(0)

  const [confirmModalVisible, setConfirmModalVisible] = useState(false)
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [noteModalVisible, seNoteModalVisible] = useState(false)
  const [modalTitle, seNoteModalTitle] = useState('')
  const [modalDescription, setModalDescription] = useState('')

  const sortByItems = [
    { label: t('智者'), value: '智者', children: [{ label: t('银色'), value: '银色'}, { label: t('金色'), value: '金色'}] },
    { label: t('将领'), value: '将领', children: [{ label: t('银色'), value: '银色'}, { label: t('金色'), value: '金色'}] },
    { label: t('议员'), value: '议员', children: [{ label: t('银色'), value: '银色'}, { label: t('金色'), value: '金色'}] },
  ]

  const startCompound = () => {
    setIsCompound(true);
  }

  const cancelCompound = () => {
    setIsCompound(false);
  }

  const closeCompoundSuccessModal = () => {
    setSuccessModalVisible(false)
    setIsCompound(false)
    const data = cloneDeep(nftDatas)
    data.map((item: NftToken) => {
      const obj = item
      obj.selected = false
      return obj
    })
    setNftDatas(data)
    setSelectedCount(0)
  }

  const submitCompound = () => {
    setConfirmModalVisible(false)
    setSuccessModalVisible(true)
  }

  const confirmCompound = () => {
    const data = nftDatas.filter(item => item.selected)
    setSelectedNfts(data)
    if (data.length % 2 !== 0 || !data.length) {
      seNoteModalTitle('Important note')
      setModalDescription('The NFTs you selected is across levels, please select the same color at the same level for composition')
      seNoteModalVisible(true)
      return
    }
    setConfirmModalVisible(true)
  }

  const selectNft = (nft) => {
    const data = cloneDeep(nftDatas)
    data.map((item: NftToken) => {
      const obj = item
      if (obj.tokenId === nft.tokenId) obj.selected = !obj.selected
      return obj
    })
    const count = data.filter(item => item.selected).length
    setNftDatas(data)
    setSelectedCount(count)
  }

  return (
    <AccountNftWrap>
      <BackgroundWrap>
        <BackgroundText>
          <BackgroundTitle>
            <Typed
              strings={['Text Haed DiffusionDAO']}
              typeSpeed={50}
              cursorChar=""
            />
          </BackgroundTitle>
          <BackgroundDes>Digtal market palce for crypto collectionbles and non-fungible tokens nfts</BackgroundDes>
        </BackgroundText>
        <BackgroundImg src="/images/nfts/background-wrap.png" />
      </BackgroundWrap>
      <ConentWrap>
        <SubMenuWrap>
          <Tabs defaultActiveKey="1">
            <TabPane 
            tab={
              <span>
                {`${t('I Bought NFT')}`}
                <SelectedCountWrap>{nftDatas.length}</SelectedCountWrap>
              </span>
            }
            />
          </Tabs>
          <SelectWrap>
            <Cascader
                options={sortByItems}
                style={{ width: "200px"}} 
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
            // nfts={nfts}
            nfts={nftDatas}
            isCompound={isCompound}
            isLoading={isNftLoading}
            selectNft={selectNft}
            />
        ) : (
          <UnconnectedProfileNfts nfts={nfts} isLoading={isNftLoading} />
        )}
      </ConentWrap>
      {
        noteModalVisible ? <CustomModal title={modalTitle} description={modalDescription} onClose={() => seNoteModalVisible(false) } /> 
        : null
      }
      {
        confirmModalVisible ?
        <CompoundConfirmModal  nfts={selectNfts} onDismiss={() => setConfirmModalVisible(false)} submitCompound={submitCompound} />
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
