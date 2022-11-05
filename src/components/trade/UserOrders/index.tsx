import React from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import PlacedOrders from './PlacedOrders'

export default function index({pair}) {
  return (
    <>
    <Tabs colorScheme={'gray'} size='sm'>
  <TabList>
    <Tab>Placed Orders</Tab>
    <Tab>Order History</Tab>
    <Tab>Cancelled Orders</Tab>
  </TabList>

  <TabPanels>
    <TabPanel>
      <PlacedOrders pair={pair}/>
    </TabPanel>
    <TabPanel>
      <p>two!</p>
    </TabPanel>
    <TabPanel>
      <p>three!</p>
    </TabPanel>
  </TabPanels>
</Tabs>
    </>
  )
}
