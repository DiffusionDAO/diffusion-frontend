import { useTranslation } from '@pancakeswap/localization'
import { ZHCN } from '@pancakeswap/localization/src/config/languages'
import { NftToken } from 'state/nftMarket/types'
import {
  StyledModal,
  ContentWrap,
  CardListWrap,
  CardListTitle,
  CardItem,
  CardImg,
  CardName,
  SyntheticBtn,
  AchievWrap,
  AchievCard,
  AchievImg,
  BlueHalo,
  RedHalo,
} from './styles'

interface CompoundConfirmModalProps {
  nfts: NftToken[]
  onDismiss: () => void
  submitCompose: () => void
}

const ComposeConfirmModal: React.FC<CompoundConfirmModalProps> = ({ onDismiss, submitCompose, nfts }) => {
  const { t, currentLanguage } = useTranslation()

  return (
    <StyledModal title={t('Compose')} onCancel={onDismiss} open centered maskClosable={false} footer={[]}>
      <ContentWrap>
        <AchievWrap>
          <AchievCard>
            <AchievImg src={nfts[0]?.image.thumbnail} />
          </AchievCard>
          <BlueHalo />
          <RedHalo />
        </AchievWrap>
        <CardListWrap>
          <CardListTitle>{t('Consumption')}</CardListTitle>
          {nfts.length &&
            nfts.map((nft) => {
              const { marketData, location } = nft
              return (
                <CardItem key={`${nft?.tokenId}-${nft?.collectionName}`}>
                  <CardImg src={nft?.image.thumbnail} />
                  <CardName>{nft.name}</CardName>
                </CardItem>
              )
            })}
        </CardListWrap>
        <SyntheticBtn
          src={currentLanguage === ZHCN ? '/images/nfts/compose-zhcn.svg' : '/images/nfts/compose-en.svg'}
          onClick={submitCompose}
        />
      </ContentWrap>
    </StyledModal>
  )
}

export default ComposeConfirmModal
