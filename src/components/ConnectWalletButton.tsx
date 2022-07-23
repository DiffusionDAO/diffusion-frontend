import { Button, useWalletModal, ButtonProps } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'
import Trans from './Trans'
import styled from 'styled-components'

const BtnB = styled(Button)`

width: calc(50% - 5px);
  height: 40px;
  border-radius: 8px;
  color: #fff;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  background: linear-gradient(90deg, #3C00FF, #EC6EFF);
  background-size: 400% 400%;
  animation: gradient 5s ease infinite;
`
const ConnectWalletButton = ({ children, ...props }: ButtonProps) => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout, t)

  return (
    <Button onClick={onPresentConnectModal} {...props}>
      {children || <Trans>Connect Wallet</Trans>}
    </Button>
  )
}

export default ConnectWalletButton
