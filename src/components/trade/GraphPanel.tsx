import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import dynamic from "next/dynamic";

const Graph = dynamic(() => import("./Graph"), {
  ssr: false
});

export default function GraphPanel({pair}) {
  return (
    <>
    <Flex flexDir={"column"} justify="center" bgColor="gray.800" my={2}>
        <Graph/>
    </Flex>
    </>
  )
}
