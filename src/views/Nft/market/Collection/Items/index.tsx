import { useState } from 'react'
import { useRouter } from 'next/router'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { useGetCollection } from 'state/nftMarket/hooks'
import { useTranslation } from 'contexts/Localization'
import Select, { OptionProps } from 'components/Select/Select'
import Container from 'components/Layout/Container'
import { pancakeBunniesAddress } from '../../constants'
import PancakeBunniesCollectionNfts from './PancakeBunniesCollectionNfts'
import CollectionWrapper from './CollectionWrapper'

const Items = () => {
  const collectionAddress = useRouter().query.collectionAddress as string

  const [sortBy, setSortBy] = useState('updatedAt')
  const { t } = useTranslation()
  const collection = useGetCollection(collectionAddress)
  const sortByItems = [
    { label: t('Recently listed'), value: 'updatedAt' },
    { label: t('Lowest price'), value: 'currentAskPrice' },
  ]

  const handleChange = (newOption: OptionProps) => {
    setSortBy(newOption.value)
  }

  return (
    <>
      <CollectionWrapper collection={collection} />
    </>
  )
}

export default Items
