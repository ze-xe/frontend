import { Flex } from '@chakra-ui/react'
import React from 'react'
import BuyModule from './Buy'
import SellModule from './Sell'

export default function MarketOrder({pair}) {
  return (
    <Flex gap={10}>
        <BuyModule pair={pair}/>
        <SellModule pair={pair}/>
    </Flex>
  )
}
