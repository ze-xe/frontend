import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'

export default function GraphPanel() {
  return (
    <>
    <Flex flexDir={"column"} justify="center" height={"40vh"} bgColor="gray.800" my={5} rounded={10}>
        <Text textAlign={"center"} fontSize="sm" color={"gray.400"}>Graph Panel</Text>
    </Flex>
    </>
  )
}
