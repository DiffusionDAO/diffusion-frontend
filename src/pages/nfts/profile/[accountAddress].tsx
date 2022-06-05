import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'
import { useProfileForAddress } from 'state/profile/hooks'
import { NftProfileLayout } from 'views/Nft/market/Profile'
import UnconnectedProfileNfts from 'views/Nft/market/Profile/components/UnconnectedProfileNfts'
import UserNfts from 'views/Nft/market/Profile/components/UserNfts'
import { SubMenuWrap, SelectWrap, CompoundBtnWrap, SelectedCountWrap, SyntheticBtn, SelectedCountBox } from 'views/Nft/market/Profile/components/styles'
import useNftsForAddress from 'views/Nft/market/hooks/useNftsForAddress'
import { useModal } from '@pancakeswap/uikit'
import { Cascader, Tabs, Button } from 'antd';
import { useTranslation } from 'contexts/Localization'
import { useState, useEffect } from 'react'
import { NftToken } from 'state/nftMarket/types'
import cloneDeep from "lodash/cloneDeep";
import CompoundConfirmModal from 'views/Nft/market/Profile/components/CompoundConfirmModal'
import CompoundSuccessModal from 'views/Nft/market/Profile/components/CompoundSuccessModal'
import { nftDatasMock } from './MockNftDatas'

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

  const [isCompound, setIsCompound] = useState(false)
  const [selectNfts, setSelectedNfts] = useState<NftToken[]>([])

  const [nftDatas, setNftDatas] = useState<NftToken[]>(nftDatasMock)
  const [selectedCount, setSelectedCount] = useState<number>(0)

  const [confirmModalVisible, setConfirmModalVisible] = useState(false)
  const [successModalVisible, setSuccessModalVisible] = useState(false)

  



  const sortByItems = [
    { label: t('智者'), value: '智者', children: [{ label: t('银色'), value: '银色'}, { label: t('金色'), value: '金色'}] },
    { label: t('将领'), value: '将领', children: [{ label: t('银色'), value: '银色'}, { label: t('金色'), value: '金色'}] },
    { label: t('议员'), value: '议员', children: [{ label: t('银色'), value: '银色'}, { label: t('金色'), value: '金色'}] },
  ]

  // 点击合成按钮
  const startCompound = () => {
    setIsCompound(true);
  }

  // 取消合成
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

  // 提交合成
  const submitCompound = () => {
    setConfirmModalVisible(false)
    setSuccessModalVisible(true)
  }

  // 确认合成
  const confirmCompound = () => {
    const data = nftDatas.filter(item => item.selected)
    setSelectedNfts(data)
    if (data.length) {
      setConfirmModalVisible(true)
    }
  }

  // 选中nft
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
    <>
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
          <img src="/images/nfts/compoundBtnWrap.png" alt=""/>
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
            <SyntheticBtn role="button" aria-hidden="true" onClick={startCompound}>{t('Synthetic')}</SyntheticBtn>
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
      {/* 合成弹窗 */}
      {
        confirmModalVisible ?
        <CompoundConfirmModal  nfts={selectNfts} onDismiss={() => setConfirmModalVisible(false)} submitCompound={submitCompound} />
        : null
      }
      {/* 合成成功的弹窗 */}
      {
        successModalVisible ? <CompoundSuccessModal nfts={selectNfts} onClose={closeCompoundSuccessModal} /> 
        : null
      }
    </>
  )
}

NftProfilePage.Layout = NftProfileLayout

export default NftProfilePage
