import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import dynamic from "next/dynamic";

const Graph = dynamic(() => import("./Graph"), {
  ssr: false
});

export default function GraphPanel({pair}) {
  return (
    <>
    <Flex flexDir={"column"} justify="center" bgColor="background2" my={2} zIndex={-1}>
        <Graph pair={pair}/>
    </Flex>
    </>
  )
}
