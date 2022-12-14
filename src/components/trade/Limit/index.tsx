import { Box, Button, Flex, Heading, Input, Text } from '@chakra-ui/react';
import React from 'react';

import SellModule from './Sell';
import BuyModule from './Buy';

const LimitOrder = ({ pair }) => {
	return (
		<Flex gap={10}>
			<BuyModule pair={pair} />
			<SellModule pair={pair} />
		</Flex>
	);
};

export default LimitOrder;
