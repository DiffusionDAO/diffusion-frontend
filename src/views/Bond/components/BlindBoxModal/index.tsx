import { FC, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Grid } from "@material-ui/core";
import { NftToken } from 'state/nftMarket/types'
import { StyledModal, ContentWrap, CardItem, CardImg, TakeCardBtn } from './styles'


interface BondModalProps {
  nftData: NftToken[];
  onClose: () => void;
}

const BlindBoxModal: React.FC<BondModalProps> = ({
  nftData,
  onClose,
}) => {
  const { t } = useTranslation()
  return (
    <StyledModal
      width={500}
      onCancel={onClose}
      visible
      centered
      maskClosable={false}
      footer={[]}
    >
      <ContentWrap>
        <Grid container spacing={2}>
          {
            nftData.length && nftData.map((nft) => (
              <Grid item lg={6} md={6} sm={6} xs={6} key={nft.tokenId}>
                  <CardItem key={`${nft?.tokenId}-${nft?.collectionName}`}>
                    <CardImg src={nft?.image.thumbnail} />
                  </CardItem>
              </Grid>
            ))
          }
        </Grid>
        <TakeCardBtn>{t('Continue to take card')}</TakeCardBtn>
        <TakeCardBtn>{t('You have synthetic NFT >')}</TakeCardBtn>
      </ContentWrap>
    </StyledModal>
  )
}

export default BlindBoxModal