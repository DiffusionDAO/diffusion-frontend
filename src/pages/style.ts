import styled, { css }  from 'styled-components'

export const HaloWrap = styled.span`
  position: absolute;
  height: 400px;
  width: 400px;
`
export const BlueHalo = styled.span`
  position: absolute;
  height: 400px;
  width: 400px;
  background-color: #3C00FF;
  border-radius: 50%;
  transform-origin: 100px;
  animation: halo 10s linear infinite;
  animation-duration: 8s;
  animation-direction: reverse;
  mix-blend-mode: plus-lighter;
  filter: blur(200px)
`
export const RedHalo = styled.span`
  position: absolute;
  height: 200px;
  width: 200px;
  background-color: #EC6EFF;
  border-radius: 50%;
  transform-origin: 100px;
  animation: halo 10s linear infinite;
  animation-duration: 5s;
  mix-blend-mode: plus-lighter;
  filter: blur(100px)
`