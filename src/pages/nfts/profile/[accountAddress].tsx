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
import { useSWRContract } from 'hooks/useSWRContract'
import { getDFSNFTContract, getMineContract, getNftMarketContract } from 'utils/contractHelpers'
import { useGetCollections } from 'state/nftMarket/hooks'
import { getDFSNFTAddress, getMineAddress, getNFTComposeAddress } from 'utils/addressHelpers'
import { useDFSMineContract, useDFSNftContract, useNftComposeContract } from 'hooks/useContract'
import { useSWRConfig } from 'swr'
// import BigNumber from 'bignumber.js'
import { BigNumber } from 'ethers'
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

  const { account, library } = useWeb3React()
  const { isMobile } = useMatchBreakpoints();
  const { t } = useTranslation()
  const { route } = useRouter()
  const { query } = useRouter()

  const accountAddress = query.accountAddress as string
  const [selectedNfts, setSelectedNfts] = useState<NftToken[]>([])
  const [stakedNfts, setStakedNfts] = useState<NftToken[]>([])
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

  const composeNFT = useNftComposeContract()
  const dfsNFT = useDFSNftContract()
  const mine = useDFSMineContract()
  let stakedTokenIds = []

  useEffect(() => {
    const keys = Object.keys(collections)
    const flatten: NftToken[] = keys.map(key => Object.values(collections[key].tokens)).flat() as NftToken[]
    flatten.filter(item => item.collectionName === "DFSNFT").map(nft =>
      nft.image.thumbnail = `/images/nfts/${nft.attributes[0].value}`
    )
    mine.getAllStaked().then((res) => {
      stakedTokenIds = res.map(item => item.toString())
      const staked = flatten.filter(item => item.collectionName === "DFSNFT" && res.map(item => item.toString()).includes(item.tokenId))
      setStakedNfts(staked)
    })
    const untsaked = flatten.filter(item =>
      item?.marketData.currentSeller === accountAddress && item?.collectionAddress === dfsNFTAddress && !stakedTokenIds.includes(item?.tokenId)
    )
    if (activeTab === "WithoutStake") {
      setMynfts(untsaked)
    }
  }, [account, status, activeTab])

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
    setSelectedNfts(mynfts)

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


  const submitCompound = async () => {
    const selectedTokenIds = selectedNfts.filter(nft => nft.selected).map(nft => nft.tokenId)
    const composeAddress = getNFTComposeAddress()
    const attribute = selectedNfts[0].attributes[0].value
    let tx
    if (selectedTokenIds.length === 6) {
      tx = await composeNFT.ComposeLv0(selectedTokenIds)
    } else {
      tx = await composeNFT.ComposeLvX(selectedTokenIds, attribute)
    }
    const recipient = await tx.wait()
    const id = BigNumber.from(recipient.events.slice(-1)[0].topics[3])
    const tokenId = id.toString()
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
      },
      staked: false
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

    const selected = selectedNfts.filter(item => item.selected)
    setSelectedNfts(selected)
    setSelectedCount(selected.length)
    const mineAddress = getMineAddress()
    const tokenIds = selected.map(item => item.tokenId)
    const approved = await dfsNFT.isApprovedForAll(account, mineAddress)
    let receipt;
    if (!approved) {
      receipt = await dfsNFT.setApprovalForAll(mineAddress, true)
      await receipt.wait()
    }
    receipt = await mine.stakeNFT(tokenIds)
    await receipt.wait()
    const staked = await mine.getAllStaked()
    selected.map(item => item.staked = !item.staked)
    selected.map(item => item.selected = !item.selected)
    setStakedNfts(staked)
    setIsSelected(false)
    setSelectedNfts([])

    const response
      = await fetch("https://middle.diffusiondao.org/stakeNFT", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: account,
          nfts: selected,
        }),
      })
    const json = await response.json()
    console.log(json)

    if (option === 'stake' && selectedCount > 0) submitStake()
  }

  const submitStake = () => {
    const selected = selectedNfts.filter(item => item.selected)
    setStakedNfts(selected)
    resetPage()
    message.success('Stake success')

  }

  const confirmOpt = async () => {
    const selected = selectedNfts.filter(item => item.selected)
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
          description: t('Your selection of NFTs are from different levels of the hierarchy, please select the same level of NFTs to combine'),
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
      })
    }
  }

  const selectNft = (nft) => {
    if (option === "compose") {
      const level = nft.attributes[0].value
      const data = cloneDeep(mynfts.filter(my => my.attributes[0].value === level))
      data.map((item: NftToken) => {
        const obj = item
        if (obj.attributes[0].value === nft.attributes[0].value) { obj.selected = !obj.selected }
        return obj
      })
      if (level === '0') {
        if (data.length < 6) {
          setNoteContent({
            title: t('Important note'),
            description: t('need 6 pieces'),
            visible: true,
          });
          return;
        }
        const datas = data.slice(0, 6)
        setSelectedNfts(datas)
        setSelectedCount(datas.filter(item => item.selected).length)
      } else {
        if (level === '6') {
          setNoteContent({
            title: t('Important note'),
            description: t('Unable to compose highest level NFT'),
            visible: true,
          });
          return;
        }
        const datas = data.slice(0, 2)
        setSelectedNfts(datas)
        setSelectedCount(datas.filter(item => item.selected).length)
      }
    } else if (option === "stake") {
      nft.selected = !nft.selected
      setSelectedCount(selectedCount + 1)
    }
  }

  return (
    <AccountNftWrap>
      <NftSculptureWrap isMobile={isMobile}>
        <NftSculptureGif isMobile={isMobile} src="/images/nfts/nft-sculpture.png" alt="" />
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
          <BackgroundDes>{t('This is your digital asset treasure silo, stake or combine NFTs to explore more possibilities where you can obtain more fulfilling rewards')}</BackgroundDes>
        </BackgroundText>
      </BackgroundWrap>
      <ConentWrap>
        <SubMenuWrap>
          <Tabs defaultActiveKey={activeTab} onChange={changeTab}>
            <TabPane
              key="WithoutStake"
              tab={
                <span>
                  {`${t('Not Staked')}`}
                  <SelectedCountWrap>{mynfts?.length}</SelectedCountWrap>
                </span>
              }
            />
            <TabPane
              key="Stake"
              tab={
                <span>
                  {`${t('Staked')}`}
                  <SelectedCountWrap>{stakedNfts.length}</SelectedCountWrap>
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
            nfts={activeTab === "WithoutStake" ? (isSelected ? selectedNfts : mynfts) : stakedNfts}
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
