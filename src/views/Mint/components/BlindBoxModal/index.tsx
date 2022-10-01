import { useRouter } from 'next/router'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import { Grid } from '@material-ui/core'
import { StyledModal, ContentWrap, CardItem, CardImg, CardText, BtnWrap, TakeCardBtn, JumpBtnCont } from './styles'

interface BondModalProps {
  data: any[]
  onClose: () => void
}

const BlindBoxModal: React.FC<BondModalProps> = ({ data, onClose }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const router = useRouter()
  return (
    <StyledModal width={528} onCancel={onClose} open centered maskClosable={false} footer={[]}>
      <ContentWrap>
        <Grid container spacing={2}>
          {data.length &&
            data.map((card) =>
              card.count ? (
                <Grid item lg={6} md={6} sm={6} xs={6} key={card.id}>
                  <CardItem key={card.id}>
                    <CardImg src={`/images/nfts/${card.type}`} />
                    <CardText>
                      {t('Count')}: {card.count}
                    </CardText>
                  </CardItem>
                </Grid>
              ) : null,
            )}
        </Grid>
        <BtnWrap>
          <TakeCardBtn onClick={onClose}>{t('Continue to Draw Card')}</TakeCardBtn>
          <TakeCardBtn onClick={() => router.push(`${nftsBaseUrl}/profile/${account.toLowerCase()}`)}>
            <JumpBtnCont>{t('Continue to Combine NFTs >')}</JumpBtnCont>
          </TakeCardBtn>
        </BtnWrap>
      </ContentWrap>
    </StyledModal>
  )
}

export default BlindBoxModal
