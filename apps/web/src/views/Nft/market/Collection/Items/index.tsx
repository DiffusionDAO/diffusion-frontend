import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Box, Flex, Text,Select,OptionProps } from '@pancakeswap/uikit'
import { useGetCollection } from 'state/nftMarket/hooks'
import { useTranslation } from '@pancakeswap/localization'
import CollectionWrapper from './CollectionWrapper'

const Items = () => {
  const collectionAddress = useRouter().query.collectionAddress as string
  const [sortBy, setSortBy] = useState('updatedAt')
  const { t } = useTranslation()
  const collection = useGetCollection(collectionAddress)

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
