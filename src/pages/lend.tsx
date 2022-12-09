import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import React from 'react'
import LendingTable from '../components/lever/lend/LendTable';
import BorrowTable from '../components/lever/borrow/BorrowTable';

import { LeverDataContext } from '../context/LeverDataProvider'

// https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png
const imageIds = {
    "ETH": "1027",
    "BTC": "1",
    "USDC": "3408",
    "DAI": "4943"
}

export default function lend() {
    const {markets} = React.useContext(LeverDataContext);

  return (
    <>
    <Box py={10} my={2} bgColor={'background2'}>
    <Heading  mx={4}>Lend your assets</Heading>
    <Text mt={2} mx={4}>Earn with high APR %</Text>
    </Box>
    <Flex gap={2}>
        <Box width={'50%'}>

    <LendingTable/>
        </Box>
        <Box width={'50%'}>

    <BorrowTable/>
        </Box>
    </Flex>
    </>
  )
}
