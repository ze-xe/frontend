import React from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import OrderBook from './OrderBook'
import OrderHistory from './OrderHistory'

export default function OrdersPanel() {
  return (
        <Tabs align='end' variant='soft-rounded' size={"sm"} colorScheme='gray' overflow={"auto"}>
                    <TabList>
                        <Tab>Order Book</Tab>
                        <Tab>Order History</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                        <OrderBook />
                        </TabPanel>
                        <TabPanel>
                        <OrderHistory />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
  )
}
