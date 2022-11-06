import React from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import PlacedOrders from './PlacedOrders'
import ExecutedOrders from './ExecutedOrders';
import CancelledOrders from './CancelledOrders';

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
      <ExecutedOrders pair={pair}/>
    </TabPanel>
    <TabPanel>
      <CancelledOrders pair={pair}/>
    </TabPanel>
  </TabPanels>
</Tabs>
    </>
  )
}
