import styled from 'styled-components'
import { Modal } from 'antd'

export const StyledModal = styled(Modal)`
  width: 60%;
`

export const ContentWrap = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const CardListWrap = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  border-radius: 11px;
  justify-content: space-around;
  margin-top: 20px;
  padding: 20px;
  background: linear-gradient(180deg, rgba(171, 182, 255, 0.05) 0%, rgba(171, 182, 255, 0) 100%);
  border: 0px solid;
  position: relative;
  :after {
    content: ' ';
    position: absolute;
    height: 0;
    width: 0;
    border: solid transparent;
    pointer-events: none;
    border-width: 16px;
    border-color: #fff0;
    margin-left: -16px;
    border-bottom-color: rgba(171, 182, 255, 0.05);
    top: -32px;
    left: 50%;
  }
`
export const CardListTitle = styled.div`
  width: 100%;
  line-height: 40px;
  text-align: center;
  font-size: 13px;
  font-family: HelveticaNeue-Italic, HelveticaNeue;
  font-weight: normal;
  color: #abb6ff;
`

export const CardItem = styled.div`
  width: 60px;
`
export const CardImg = styled.img`
  width: 58px;
  height: 58px;
  border-radius: 11px;
`
export const CardName = styled.div`
  width: 100%;
  line-height: 30px;
  text-align: center;
  font-size: 13px;
  font-family: HelveticaNeue;
  color: #abb6ff;
  line-height: 30px;
`
export const SyntheticBtn = styled.img`
  color: #fff;
  cursor: pointer;
  height: 130px;
`

export const AchievWrap = styled.div`
  width: 100%;
  height: 160px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  position: relative;
}
`
export const BlueHalo = styled.span`
  position: absolute;
  bottom: 50%;
  left: 40px;
  height: 100px;
  width: 100px;
  background-color: #3c00ff;
  border-radius: 50%;
  transform-origin: 100px;
  animation: halo 10s linear infinite;
  animation-duration: 10s;
  animation-direction: reverse;
  mix-blend-mode: plus-lighter;
  filter: blur(50px);
`
export const RedHalo = styled.span`
  position: absolute;
  bottom: 50%;
  right: 40px;
  height: 100px;
  width: 100px;
  background-color: #ec6eff;
  border-radius: 50%;
  transform-origin: 100px;
  animation: halo 10s linear infinite;
  animation-duration: 10s;
  mix-blend-mode: plus-lighter;
  filter: blur(50px);
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
`

export const AchievImg = styled.img`
  width: 140px;
  height: 140px;
  border-radius: 11px;
`
