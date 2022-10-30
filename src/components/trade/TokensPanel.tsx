import React from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import AllTokens from './AllTokens'
import TrendingTokens from './TrendingTokens';
import NewTokens from './NewTokens';

const tokens = [
    {
        name: 'ETH/USD',
        price: 1.70,
        tags: ['trending', 'eth', 'usd']
    }
]

export default function TokensPanel() {
  return (
        <Tabs variant='enclosed' size={"sm"} colorScheme='gray' overflow={"auto"}>
                    <TabList>
                        <Tab>All</Tab>
                        <Tab>Trending</Tab>
                        <Tab>New</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                        <AllTokens/>
                        </TabPanel>
                        <TabPanel>
                        <TrendingTokens/>
                        </TabPanel>
                        <TabPanel>
                        <NewTokens/>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
  )
}
