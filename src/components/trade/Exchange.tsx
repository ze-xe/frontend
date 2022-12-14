import { Box, Tooltip } from '@chakra-ui/react';
import React from 'react';

import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import LimitOrder from './Limit/index';
import MarketOrder from './Market';

const Exchange = ({pair}) => {
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
                    <Tooltip size={'sm'} hasArrow label='Coming Soon' bg='white' color={'gray.800'}>
					<Tab isDisabled>Stop</Tab>
                    </Tooltip>
				</TabList>
				<TabPanels>
					<TabPanel>
						<LimitOrder pair={pair}/>
					</TabPanel>
					<TabPanel>
                        <MarketOrder pair={pair}/>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Box>
}

export default Exchange;


