import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import dynamic from "next/dynamic";

const TVChartContainer = dynamic(
	() =>
		import('../TVChartContainer').then(mod => mod.TVChartContainer),
	{ ssr: false },
);

export default function GraphPanel({pair}) {
  return (
    <>
    <Flex flexDir={"column"} justify="center" bgColor="background2" my={2} zIndex={-1} maxH='600'>
       {pair && <TVChartContainer symbol={pair?.tokens[0].symbol + '_' + pair?.tokens[1].symbol}/>}
    </Flex>
    </>
  )
}
