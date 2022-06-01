import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'
import { useProfileForAddress } from 'state/profile/hooks'
import { NftProfileLayout } from 'views/Nft/market/Profile'
import SubMenu from 'views/Nft/market/Profile/components/SubMenu'
import UnconnectedProfileNfts from 'views/Nft/market/Profile/components/UnconnectedProfileNfts'
import UserNfts from 'views/Nft/market/Profile/components/UserNfts'
import { SubMenuWrap, SelectWrap, CompoundBtnWrap, CountWrap } from 'views/Nft/market/Profile/components/styles'
import useNftsForAddress from 'views/Nft/market/hooks/useNftsForAddress'
import { Button, useModal } from '@pancakeswap/uikit'
import Select, { OptionProps } from 'components/Select/Select'
import { useTranslation } from 'contexts/Localization'
import { useState, useEffect } from 'react'
import { NftToken } from 'state/nftMarket/types'
import cloneDeep from "lodash/cloneDeep";
import CompoundConfirmModal from 'views/Nft/market/Profile/components/CompoundConfirmModal'
import { nftDatasMock } from './MockNftDatas'

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
        <SubMenu />
        <SelectWrap>
          <Select
              options={sortByItems}
              style={{ width: "200px"}} 
            />
        </SelectWrap>
      </SubMenuWrap>
        <CompoundBtnWrap isCompound={isCompound}>
          {
            isCompound ? 
            <>
              <div>
                {t('Selected')} 
                <CountWrap>{selectedCount}</CountWrap>
              </div>
              <div>
                <Button variant="primary" scale="md" mr="8px" onClick={confirmCompound}>{t('Save')}</Button>
                <Button variant="primary" scale="md" onClick={cancelCompound}>{t('Cancel')}</Button>
              </div>
            </> :
            <div role="button" aria-hidden="true" onClick={startCompound}>{t('Synthetic')}</div>
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
    </>
  )
}

NftProfilePage.Layout = NftProfileLayout

export default NftProfilePage
