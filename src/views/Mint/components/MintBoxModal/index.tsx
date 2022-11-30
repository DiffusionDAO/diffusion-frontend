import { useRouter } from 'next/router'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import { Grid } from '@material-ui/core'
import { levelToName } from 'pages/profile/[accountAddress]'
import { StyledModal, ContentWrap, CardItem, CardImg, CardText, BtnWrap, TakeCardBtn, JumpBtnCont } from './styles'

interface BondModalProps {
  data: any[]
  onClose: () => void
}

const MintBoxModal: React.FC<BondModalProps> = ({ data, onClose }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const router = useRouter()
  // Object.keys(data).reduce((accum, cur)=>{data[cur]}, {key:[]})
  // for (let i =0;i<data.length;++i){
  //   let startTokenId = data[i].tokenIds[0]
  //   for (let j=0;j<data[i].tokenIds.length;++j){
  //     if (data[i].tokenIds[j+1] - data[i].tokenIds[j] > 1) {
  //       continuousTokenId[data[i].level].push(`${startTokenId}-${data[i].tokenIds[j]}`)
  //       startTokenId = data[i].tokenIds[j+1]
  //     }
  //   }
  // }
  // console.log(continuousTokenId)
  return (
    <StyledModal width={528} onCancel={onClose} open centered maskClosable={false} footer={[]}>
      <ContentWrap>
        <Grid container spacing={2}>
          {data.length &&
            data.map((card) =>
              card.tokenIds.length ? (
                <Grid item lg={6} md={6} sm={6} xs={6} key={card.id}>
                  <CardItem key={card.id}>
                    <CardImg src={`/images/nfts/socialnft/${card.level}`} />
                    <CardText>
                      {t('amount')}: {card.tokenIds.length} {t(levelToName[card.level])}{' '}
                      {card.tokenIds.length > 10
                        ? `#${card.tokenIds[0]}-#${card.tokenIds[card.tokenIds.length - 1]}`
                        : card.tokenIds.map((tokenId) => `#${tokenId}`)}
                    </CardText>
                  </CardItem>
                </Grid>
              ) : null,
            )}
        </Grid>
        <BtnWrap>
          <TakeCardBtn onClick={onClose}>{t('Continue to Mint')}</TakeCardBtn>
          <TakeCardBtn onClick={() => router.push(`/profile/${account.toLowerCase()}`)}>
            <JumpBtnCont>{t('Continue to Compose NFTs')}</JumpBtnCont>
          </TakeCardBtn>
        </BtnWrap>
      </ContentWrap>
    </StyledModal>
  )
}

export default MintBoxModal
