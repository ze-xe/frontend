import { Box, Button, Flex, Heading, Input, Text } from '@chakra-ui/react';
import React from 'react';

import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import SellModule from './Sell';
import BuyModule from './Buy';

const Swap = ({pair}) => {
	return <Box bgColor={"gray.1100"}>
			<Tabs
				variant="line"
				size={'sm'}
				colorScheme="gray"
				overflow={'auto'}
				pt={0}>
				<TabList>
					<Tab>Limit</Tab>
					<Tab>Market</Tab>
					<Tab disabled={true}>Stop</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<Flex gap={10}>
							<BuyModule pair={pair} />
							<SellModule pair={pair} />
						</Flex>
					</TabPanel>
					<TabPanel>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Box>
	
}

export default Swap;


