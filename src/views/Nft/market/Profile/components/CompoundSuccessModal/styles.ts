import styled from 'styled-components'
import { Box, Flex, Text, BinanceIcon, Input } from '@pancakeswap/uikit'
import { Modal } from 'antd';


export const StyledModal = styled(Modal)`
  width: 60%;
`

export const ContentWrap = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`


export const SyntheticBtn = styled.div`
  color: #fff;
  cursor: pointer;
  width: 150px;
  height: 90px;
  text-align: center;
  line-height: 90px;
`

export const AchievWrap = styled.div`
  width: 100%;
  height: 300px;
  background: url(/images/nfts/final-achiev-wrap.svg);
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
}
`
export const AchievCard = styled.div`
  width: 160px;
  height: 160px;
  background: url('/images/nfts/achievCard-bg.svg');
  background-size: 100% 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  position: relative;
`

export const AchievImg = styled.img`
  width: 140px;
  height: 140px;
  border-radius: 11px;
`

export const CongratulationsTitle = styled.div`
  width: 100%;
  height: 40px;
  text-align: center;
  font-size: 20px;
  font-family: HelveticaNeue-Bold, HelveticaNeue;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 40px;
`
export const CongratulationsDes = styled.div`
  width: 100%;
  height: 15px;
  text-align: center;
  font-size: 13px;
  font-family: HelveticaNeue;
  color: #FFFFFF;
  line-height: 15px;
`

export const StarWrap = styled.div`
  width: 300px;
  height: 60px;
  text-align: center;
  background: url(/images/nfts/ellipse.svg);
  background-repeat: no-repeat;
  background-size: cover;
  position: absolute;
  bottom: 0;
  left: - 150px;
`

export const StarImg = styled.img`
  position: absolute;
  right: -5px;
  top: 20px;
`
