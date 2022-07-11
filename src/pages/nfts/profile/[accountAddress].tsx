/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable no-await-in-loop */
/* eslint-disable vars-on-top */
/* eslint-disable block-scoped-var */
/* eslint-disable block-scoped-var */
/* eslint-disable array-callback-return */

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
import { NftLocation, NftToken } from 'state/nftMarket/types'
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
const dfsName = { 0: "Lord fragment", 1: "Lord", 2: "Golden Lord", 3: "General", 4: "Golden General", 5: "Congressman", 6: "Golden Congressman" }
const greeceNumber = { 0: "I", 1: "II", 2: "III", 3: "IV", 4: "V", 5: "VI", 6: "VII" }

function NftProfilePage() {
  const { data: collections, status } = useGetCollections() as any

  const { account } = useWeb3React()
  const { isMobile } = useMatchBreakpoints();
  const { t } = useTranslation()
  const { route } = useRouter()
  const { query } = useRouter()

  const accountAddress = query.accountAddress as string
  const [selectedNfts, setSelectedNfts] = useState<NftToken[]>([])
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

  useEffect(() => {
    // console.log("collections:", collections)
    const keys = Object.keys(collections)
    // console.log("keys:", keys)
    const initNfts = keys.map(key => collections[key].tokens.filter(item =>
      item.marketData.currentSeller === accountAddress && item.collectionAddress === dfsNFTAddress
    )).flat()
    initNfts.map(nft =>
      nft.image.thumbnail = `/images/nfts/${nft.attributes[0].value}`
    )
    // console.log("nfts:", nfts)
    setMynfts(initNfts)
    setSelectedNfts(initNfts)
  }, [account,status])

  const resetPage = () => {
    setIsSelected(false)
    setSelectedCount(0)
    const nftData = mynfts.map(item => { item.selected = false; return item })
    setMynfts(nftData)
    setSelectedNfts(nftData)
  }
  const changeTab = (key) => {
    resetPage()
    setActiveTab(key)
  }
  const dfsNFTAddress = getDFSNFTAddress()
  const startCompound = () => {
    setIsSelected(true)
    setOption('compose')
    const dfsnft = mynfts.filter(item => item.collectionAddress === dfsNFTAddress)
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
    const selectedTokenIds = selectedNfts.filter(nft => nft.selected).map(nft => nft.tokenId)
    console.log("selectedTokenIds:", selectedTokenIds)
    const composeAddress = getNFTComposeAddress()
    const attribute = selectedNfts[0].attributes[0].value
    let tx
    if (selectedTokenIds.length === 6) {
      tx = await composeNFT.ComposeLv0(selectedTokenIds)
    } else {
      tx = await composeNFT.ComposeLvX(selectedTokenIds, attribute)
    }
    const recipient = await tx.wait()
    const id = new BigNumber(recipient.events.slice(-1)[0].topics[3])
    const tokenId = id.toString()
    console.log("tokenId:", tokenId)
    const level = await dfsNFT.getItems(tokenId)
    const newNft: NftToken = {
      "tokenId": tokenId,
      "name": greeceNumber[level],
      "description": dfsName[level],
      "collectionName": dfsName[level],
      "collectionAddress": dfsNFTAddress,
      "image": {
        "original": "string",
        "thumbnail": `/images/nfts/${level}`
      },
      "attributes": [
        {
          "traitType": "",
          "value": level,
          "displayType": ""
        }
      ],
      "createdAt": "",
      "updatedAt": "",
      "location": NftLocation.FORSALE,
      "marketData": {
        "tokenId": tokenId,
        "collection": {
          "id": tokenId
        },
        "currentAskPrice": "",
        "currentSeller": accountAddress,
        "isTradable": true
      }
    }
    setComposedNFT([newNft])
    mynfts.map((nft, i) => {
      if (selectedTokenIds.includes(nft.tokenId)) {
        mynfts.splice(i, 1)
      }
    })
    mynfts.push(newNft)
    setMynfts(mynfts)

    setConfirmModalVisible(false)
    setSuccessModalVisible(true)
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
    const selected = selectedNfts.filter(item => item.selected)
    setSelectedNfts(selected)
    if (!selected.length) {
      setNoteContent({
        title: t('Important note'),
        description: t('Please select one NFT at least'),
        visible: true,
      })
      return
    }
    if (option === 'compose') {
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
    const level = nft.attributes[0].value
    const data = cloneDeep(mynfts.filter(my => my.attributes[0].value === level))
    data.map((item: NftToken) => {
      const obj = item
      if (obj.attributes[0].value === nft.attributes[0].value) { obj.selected = !obj.selected }
      return obj
    })
    if (level === '0') {
      const datas = data.slice(0, 6)
      setSelectedNfts(datas)
      setSelectedCount(datas.filter(item => item.selected).length)
    } else {
      const datas = data.slice(0, 2)
      setSelectedNfts(datas)
      setSelectedCount(datas.filter(item => item.selected).length)
    }

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
              strings={['Diffusion DAO']}
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
                  <SelectedCountWrap>{selectedNfts?.length}</SelectedCountWrap>
                </span>
              }
            />
            <TabPane
              key="Stake"
              tab={
                <span>
                  {`${t('Has staked')}`}
                  <SelectedCountWrap>{selectedNfts?.length}</SelectedCountWrap>
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
            nfts={selectedNfts}
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
          <CompoundConfirmModal nfts={selectedNfts} onDismiss={() => setConfirmModalVisible(false)} submitCompound={submitCompound} />
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
