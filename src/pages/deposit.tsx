import { Box, Flex } from '@chakra-ui/react';
import React from 'react'
import Deposit from '../components/deposit/Deposit';
import Recent from '../components/deposit/Recent';
import WalletBalance from '../components/deposit/WalletBalance';

export default function deposit() {
  return (
    <Flex mt={2} flex='stretch' gap={2}>
      <Box bgColor='gray.1000' width={'30%'} p={4}>
        <WalletBalance />
      </Box>
      <Box bgColor='gray.1000' width={'50%'} p={4}>
        <Deposit/>
      </Box>
      <Box bgColor='gray.1000' width={'20%'} p={4}>
        <Recent/>
      </Box>
    </Flex>
  )
}
