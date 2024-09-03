import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'
import { useProfileForAddress } from 'state/profile/hooks'
import { NftProfileLayout } from 'views/Nft/market/Profile'
import SubMenu from 'views/Nft/market/Profile/components/SubMenu'
import UnconnectedProfileNfts from 'views/Nft/market/Profile/components/UnconnectedProfileNfts'
import UserNfts from 'views/Nft/market/Profile/components/UserNfts'
import useNftsForAddress from 'views/Nft/market/hooks/useNftsForAddress'
import { Button, useModal } from '@pancakeswap/uikit'
import Select, { OptionProps } from 'components/Select/Select'
import { useTranslation } from 'contexts/Localization'
import { useState, useEffect } from 'react'
import { NftToken } from 'state/nftMarket/types'
import cloneDeep from "lodash/cloneDeep";
import CompoundConfirmModal from 'views/Nft/market/Profile/components/CompoundConfirmModal'
// import { nftDatasMock } from './MockNftDatas'

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

  const [nftDatas, setNftDatas] = useState<NftToken[]>()

  const sortByItems = [
    { label: t('Recently listed'), value: { field: 'updatedAt', direction: 'desc' } },
    { label: t('Lowest price'), value: { field: 'currentAskPrice', direction: 'asc' } },
    { label: t('Highest price'), value: { field: 'currentAskPrice', direction: 'desc' } },
    { label: t('Token ID'), value: { field: 'tokenId', direction: 'asc' } },
  ]

  // 点击合成按钮
  const startCompound = () => {
    setIsCompound(true);
  }

  // 取消合成
  const cancelCompound = () => {
    setIsCompound(false);
  }

  // 提交合成
  const submitCompound = () => {
    alert('开始合成啦！')
  }

  const [onCompoundConfirmModal] = useModal(
    <CompoundConfirmModal  nfts={selectNfts} onDismiss={() => onCompoundConfirmModal} submitCompound={submitCompound} />,
  )

  // 确认合成
  const confirmCompound = () => {
    const data = nftDatas.filter(item => item.selected)
    setSelectedNfts(data)
  }

  useEffect(() => {
    if (selectNfts.length) {
      onCompoundConfirmModal()
    }
  }, [selectNfts])

  const selectNft = (nft) => {
    const data = cloneDeep(nftDatas)
    data.map((item: NftToken) => {
      const obj = item
      if (obj.tokenId === nft.tokenId) obj.selected = !obj.selected
      return obj
    })
    setNftDatas(data)
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex" }}>
          <div style={{ maxWidth: "200px", marginRight: "50px" }}>
            <SubMenu />
          </div>
          <div style={{ maxWidth: "200px" }}>
            <Select
              options={sortByItems} 
              width={200} 
            />
          </div>
        </div>
        {
          isCompound ? 
          <div>
            <Button variant="primary" scale="md" mr="8px" onClick={cancelCompound}>{t('取消')}</Button>
            <Button variant="primary" scale="md" mr="8px" onClick={confirmCompound}>{t('确认')}</Button>
          </div>
          : 
          <Button variant="primary" scale="md" mr="8px" onClick={startCompound}>{t('合成')}</Button>
        }
        
      </div>
      {isConnectedProfile ? (
        <UserNfts
          // nfts={nfts}
          nfts={nftDatas}
          isCompound={isCompound}
          isLoading={isNftLoading}
          onSuccessSale={refreshUserNfts}
          onSuccessEditProfile={async () => {
            await refreshProfile()
            refreshUserNfts()
          } } 
          selectNft={selectNft}
          />
      ) : (
        <UnconnectedProfileNfts nfts={nfts} isLoading={isNftLoading} />
      )}
    </>
  )
}

NftProfilePage.Layout = NftProfileLayout

export default NftProfilePage
