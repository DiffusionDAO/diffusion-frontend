import { useTranslation } from '@pancakeswap/localization'
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
  submitCompound: () => void
}

const CompoundConfirmModal: React.FC<CompoundConfirmModalProps> = ({ onDismiss, submitCompound, nfts }) => {
  const { t } = useTranslation()

  return (
    <StyledModal title={t('Compose')} onCancel={onDismiss} visible centered maskClosable={false} footer={[]}>
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
        <SyntheticBtn src="/images/nfts/synthetic-btn.svg" onClick={submitCompound} />
      </ContentWrap>
    </StyledModal>
  )
}

export default CompoundConfirmModal
