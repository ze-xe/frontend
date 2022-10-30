import React from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

const tokens = [
    {
        name: 'ETH/USD',
        price: 1.70,
        tags: ['trending', 'eth', 'usd']
    }
]

export default function TokensPanel() {
  return (
        <Tabs variant='soft-rounded' size={"sm"} colorScheme='gray' overflow={"auto"}>
                    <TabList>
                        <Tab>All</Tab>
                        <Tab>Trending</Tab>
                        <Tab>New</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                        <p>one!</p>
                        </TabPanel>
                        <TabPanel>
                        <p>two!</p>
                        </TabPanel>
                        <TabPanel>
                        <p>one!</p>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
  )
}
