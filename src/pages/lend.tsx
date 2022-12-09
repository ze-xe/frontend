import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import React from 'react'
import LendingTable from '../components/lever/lend/LendTable';
import BorrowTable from '../components/lever/borrow/BorrowTable';

import { LeverDataContext } from '../context/LeverDataProvider'
import { dollarFormatter } from '../utils/formatters';

// https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png
const imageIds = {
    "ETH": "1027",
    "BTC": "1",
    "USDC": "3408",
    "DAI": "4943"
}

export default function lend() {
    const {markets} = React.useContext(LeverDataContext);
	const { availableToBorrow, totalBorrowBalance, totalCollateralBalance } = React.useContext(LeverDataContext);


  return (
    <>
    <Box py={10} mt={2} bgColor={'background2'}>
    <Heading  mx={4}>Lend your assets</Heading>
    <Text mt={2} mx={4}>Earn with high APR %</Text>
    </Box>

    <Flex justify='space-between'>
        <Box px={4} py={10} my={2} bgColor={'background2'} width='33%'>
            <Text fontSize={'lg'}>Collateral</Text>
            <Text mt={1} fontSize='2xl' fontWeight={'bold'}>{dollarFormatter(null).format(parseFloat(totalCollateralBalance))}</Text>
        </Box>

        <Box px={4} py={10} my={2} bgColor={'background2'} width='33%'>
            <Text fontSize={'lg'}>Borrowed</Text>
            <Text mt={1} fontSize='2xl' fontWeight={'bold'}>{dollarFormatter(null).format(parseFloat(totalBorrowBalance))}</Text>
        </Box>

        <Box px={4} py={10} my={2} bgColor={'background2'} width='33%'>
            <Text fontSize={'lg'}>Available to borrow</Text>
            <Text mt={1} fontSize='2xl' fontWeight={'bold'}>{dollarFormatter(null).format(parseFloat(availableToBorrow))}</Text>
        </Box>
    </Flex>


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
