import { FC, useState } from 'react'
import { HaloWrap, BlueHalo, RedHalo } from './style'

const Halo: FC = () => {
  return (
    <>
      {/* 左边光晕展示 */}
      <HaloWrap style={{ left: '20%', top: '150px' }}>
        <BlueHalo />
        <RedHalo />
      </HaloWrap>

      {/* 右边光晕展示 */}
      <HaloWrap style={{ right: '0px', top: '0' }}>
        <BlueHalo />
        <RedHalo />
      </HaloWrap>
    </>
  )
}
export default Halo
