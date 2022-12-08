import { Currency, Pair } from '@pancakeswap/sdk'

type ZapStyle = 'noZap' | 'zap'

// export default function CurrencyInputPanel({
//   value,
//   onUserInput,
//   onInputBlur,
//   onMax,
//   showMaxButton,
//   label,
//   onCurrencySelect,
//   currency,
//   disableCurrencySelect = false,
//   hideBalance = false,
//   zapStyle,
//   beforeButton,
//   pair = null, // used for double token logo
//   otherCurrency,
//   id,
//   showCommonBases,
//   commonBasesType,
//   disabled,
//   error,
//   showBUSD,
// }: CurrencyInputPanelProps) {
//   const { account } = useActiveWeb3React()
//   const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
//   const { t } = useTranslation()

//   const token = pair ? pair.liquidityToken : currency?.isToken ? currency : null
//   const tokenAddress = token ? isAddress(token.address) : null

//   const amountInDollar = useBUSDCurrencyAmount(
//     showBUSD ? currency : undefined,
//     Number.isFinite(+value) ? +value : undefined,
//   )

//   const [onPresentCurrencyModal] = useModal(
//     <CurrencySearchModal
//       onCurrencySelect={onCurrencySelect}
//       selectedCurrency={currency}
//       otherSelectedCurrency={otherCurrency}
//       showCommonBases={showCommonBases}
//       commonBasesType={commonBasesType}
//     />,
//   )

//   return (
//     <Box position="relative" id={id}>
//       <Flex alignItems="center" justifyContent="space-between">
//         <Flex>
//           {beforeButton}
//           <CurrencySelectButton
//             zapStyle={zapStyle}
//             className="open-currency-select-button"
//             selected={!!currency}
//             onClick={() => {
//               if (!disableCurrencySelect) {
//                 onPresentCurrencyModal()
//               }
//             }}
//           >
//             <Flex alignItems="center" justifyContent="space-between">
//               {pair ? (
//                 <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={16} margin />
//               ) : currency ? (
//                 <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '8px' }} />
//               ) : null}
//               {pair ? (
//                 <Text id="pair" bold>
//                   {pair?.token0.symbol}:{pair?.token1.symbol}
//                 </Text>
//               ) : (
//                 <Text id="pair" bold>
//                   {(currency && currency.symbol && currency.symbol.length > 20
//                     ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
//                         currency.symbol.length - 5,
//                         currency.symbol.length,
//                       )}`
//                     : currency?.symbol) || t('Select a currency')}
//                 </Text>
//               )}
//               {!disableCurrencySelect && <ChevronDownIcon />}
//             </Flex>
//           </CurrencySelectButton>
//           {token && tokenAddress ? (
//             <Flex style={{ gap: '4px' }} ml="4px" alignItems="center">
//               <CopyButton
//                 width="16px"
//                 buttonColor="textSubtle"
//                 text={tokenAddress}
//                 tooltipMessage={t('Token address copied')}
//                 tooltipTop={-20}
//                 tooltipRight={40}
//                 tooltipFontSize={12}
//               />
//               <AddToWalletButton
//                 variant="text"
//                 p="0"
//                 height="auto"
//                 width="fit-content"
//                 tokenAddress={tokenAddress}
//                 tokenSymbol={token.symbol}
//                 tokenDecimals={token.decimals}
//                 tokenLogo={token instanceof WrappedTokenInfo ? token.logoURI : undefined}
//               />
//             </Flex>
//           ) : null}
//         </Flex>
//         {account && (
//           <Text
//             onClick={!disabled && onMax}
//             color="textSubtle"
//             fontSize="14px"
//             style={{ display: 'inline', cursor: 'pointer' }}
//           >
//             {!hideBalance && !!currency
//               ? t('Balance: %balance%', { balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading') })
//               : ' -'}
//           </Text>
//         )}
//       </Flex>
//       <InputPanel>
//         <Container as="label" zapStyle={zapStyle} error={error}>
//           <LabelRow>
//             <NumericalInput
//               error={error}
//               disabled={disabled}
//               className="token-amount-input"
//               value={value}
//               onBlur={onInputBlur}
//               onUserInput={(val) => {
//                 onUserInput(val)
//               }}
//             />
//           </LabelRow>
//           <InputRow selected={disableCurrencySelect}>
//             {!!currency && showBUSD && Number.isFinite(amountInDollar) && (
//               <Text fontSize="12px" color="textSubtle" mr="12px">
//                 ~{formatNumber(amountInDollar)} USD
//               </Text>
//             )}
//             {account && currency && !disabled && showMaxButton && label !== 'To' && (
//               <Button onClick={onMax} scale="xs" variant="secondary" style={{ textTransform: 'uppercase' }}>
//                 {t('Max')}
//               </Button>
//             )}
//           </InputRow>
//         </Container>
//         {disabled && <Overlay />}
//       </InputPanel>
//     </Box>
//   )
// }
