import { FC } from 'react'
import { FarmsContext } from './Farms'

export const FarmsPageLayout: FC = ({ children }) => {
  // return <Farms>{children}</Farms>
  return <div>{children}</div>
}

export { FarmsContext }
