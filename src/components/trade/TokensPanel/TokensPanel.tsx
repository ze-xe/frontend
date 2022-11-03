import React from 'react';
import {
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	Input,
    Box,
    Text
} from '@chakra-ui/react';
import AllTokens from './AllTokens';
import TrendingTokens from './TrendingTokens';
import NewTokens from './NewTokens';
import { Divider } from '@chakra-ui/react';

export default function TokensPanel() {
	return (
		<Box >
            <Box pt={3} px={4}>
                <Text fontSize={'md'} fontWeight='bold'>Markets</Text>
            </Box>
            <Divider my={3}/>
			<Box mt={4} >
			<Input size={'md'} fontSize='sm' placeholder="Search token" mb={0} borderRadius={0} variant={'outlined'}  bgColor='gray.900'></Input>
			</Box>
			<Tabs
                mt={3}
				// variant="enclosed"
				size={'sm'}
				colorScheme="gray"
				overflow={'auto'}>
				<TabList px={4}>
					<Tab>All</Tab>
					<Tab>Trending</Tab>
					<Tab>New</Tab>
				</TabList>
				<TabPanels>
					<TabPanel px={0}>
						<AllTokens />
					</TabPanel>
					<TabPanel>
						<TrendingTokens />
					</TabPanel>
					<TabPanel>
						<NewTokens />
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Box>
	);
}
