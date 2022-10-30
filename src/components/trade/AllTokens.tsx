import { Box, Flex, Input, Text } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'

// list of tokens
const tokens = [
    {
        token0: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
        },
        token1: {
            name: 'USD Coin',
            symbol: 'USDC',
            decimals: 6,
        },
        price: 1.70,
        tags: ['trending', 'eth', 'usd']
    },
]
export default function AllTokens() {
  return (
    <Box>
        <Input placeholder='Search' mb={2}></Input>
        {tokens.map((token, index) => (
        <Flex align={'center'}>
            <Image src={`/assets/crypto_logos/` + token.token0.symbol.toLowerCase() + '.png'} width={35} height={35} alt="eth" style={{'maxHeight': 35}}></Image>
            <Box>
                <Text>{token.token0.name}</Text>
                <Text fontSize={"xs"}>{token.token0.symbol}/{token.token1.symbol}</Text>
            </Box>
        </Flex>))}
    </Box>
  )
}
