import { Box, Button, Flex, Heading, Input, Text } from '@chakra-ui/react';
import React from 'react';
import {
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
} from '@chakra-ui/react';

import {
	Slider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
	SliderMark,
} from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

export default function Swap() {
	return (
		<Box bgColor={"gray.900"}>
			<Tabs
				// align="start"
				variant="line"
				size={'sm'}
				colorScheme="gray"
				overflow={'auto'}>
				<TabList>
					<Tab>Limit</Tab>
					<Tab>Market</Tab>
					<Tab disabled={true}>Stop</Tab>

				</TabList>
				<TabPanels>
					<TabPanel>
						<Flex gap={10}>
							<BuyModule />
							<BuyModule />
						</Flex>
					</TabPanel>
					<TabPanel>
						<></>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Box>
	);
}

const BuyModule = () => {
	return (
		<Flex flexDir={'column'} gap={4} width={'50%'}>
			<Flex flexDir={'column'} gap={1}>
				<Text fontSize={'sm'}>Price (TOKEN1)</Text>
				<NumberInput min={0} precision={2} variant="filled" border={"1px"} borderRadius="6" borderColor={'gray.700'}>
					<NumberInputField />
					<NumberInputStepper>
						<NumberIncrementStepper />
						<NumberDecrementStepper />
					</NumberInputStepper>
				</NumberInput>
			</Flex>

			<Flex flexDir={'column'} gap={1}>
				<Text fontSize={'sm'}>Amount (TOKEN0)</Text>
				<NumberInput min={0} precision={2} variant="filled" border={"1px"} borderRadius="6" borderColor={'gray.700'}>
					<NumberInputField />
					<NumberInputStepper>
						<NumberIncrementStepper />
						<NumberDecrementStepper />
					</NumberInputStepper>
				</NumberInput>
			</Flex>

			<Flex flexDir={'column'} gap={1}>
				<Text fontSize={'sm'}>Total (TOKEN1)</Text>
				<NumberInput min={0} precision={2} variant="filled" border={"1px"} borderRadius="6" borderColor={'gray.700'}>
					<NumberInputField />
					<NumberInputStepper>
						<NumberIncrementStepper />
						<NumberDecrementStepper />
					</NumberInputStepper>
				</NumberInput>
				<Slider colorScheme="green" defaultValue={30}>
					<SliderTrack>
						<SliderFilledTrack />
					</SliderTrack>
					<SliderThumb />
				</Slider>
			</Flex>

			<Button width={'100%'} my="2" colorScheme={'green'}>
				Buy
			</Button>
		</Flex>
	);
};
