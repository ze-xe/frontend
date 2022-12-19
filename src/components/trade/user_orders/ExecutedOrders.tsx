import { Box, Text, IconButton, Flex } from "@chakra-ui/react";
import React from "react";
import {
	Table,
	Thead,
	Tbody,
	Tfoot,
	Tr,
	Th,
	Td,
	TableCaption,
	TableContainer,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { MdOutlineCancel } from "react-icons/md";
import CancelOrder from "./CancelOrder";
import { useEffect } from "react";
import { useContext } from "react";
import { DataContext } from "../../../context/DataProvider";
import UpdateOrder from "./UpdateOrder";
import { tokenFormatter } from "../../../utils/formatters";

import {
	Tag,
	TagLabel,
	TagLeftIcon,
	TagRightIcon,
	TagCloseButton,
} from "@chakra-ui/react";

export default function ExecutedOrders({ pair }) {
	const { orderHistory, cancelledOrders } = useContext(DataContext);

	const getOrders = () => {
		let orders = [];
		let _orderHistory = orderHistory[pair?.id];
		for(let i in _orderHistory){
			_orderHistory[i].cancelled = false;
			orders.push(_orderHistory[i]);
		}
		for(let i in cancelledOrders[pair?.id]){
			cancelledOrders[pair?.id][i].cancelled = true;
			orders.push(cancelledOrders[pair?.id][i]);
		}
		return orders;
	};

	return (
		<Box bgColor="background2">
			{getOrders() ? (
				<TableContainer>
					<Table size="sm" borderColor={"gray.800"}>
						<Thead>
							<Tr>
								<Th borderColor="gray.800">Order</Th>
								<Th borderColor="gray.800">Amount</Th>
								<Th borderColor="gray.800">Exchange Rate</Th>
								<Th borderColor="gray.800" isNumeric></Th>
							</Tr>
						</Thead>
						<Tbody>
							{getOrders().map((order: any, index: number) => {
								return (
									<Tr>
										<Td borderColor="gray.900">
											<Text
												fontSize={"xs"}
												fontWeight="bold"
											>
												<Tag
													size={"sm"}
													bgColor={
														order.buy
														? "green.700"
														: "red.700"
													}
													variant="solid"
													rounded={2}
												>
													{order.buy ?
													"BUY"
													: "SELL"}
												</Tag>
											</Text>
										</Td>
										<Td borderColor="gray.900">
											{tokenFormatter(null).format(
												order.fillAmount /
													10 **
														pair.tokens[0]?.decimals
											)}{" "}
											{pair.tokens[0]?.symbol}
										</Td>
										<Td borderColor="gray.900">
											{tokenFormatter(
												pair?.exchangeRateDecimals
											).format(
												order.exchangeRate / 10 ** 18
											)}{" "}
											{pair.tokens[1]?.symbol}/
											{pair.tokens[0]?.symbol}
										</Td>
										<Td borderColor="gray.900" isNumeric maxW={'100px'}>
											{order.cancelled ? (
												<Tag size={'sm'} rounded={1}
												>
													Cancelled
												</Tag>
											) : (
												<Tag size={'sm'} rounded={2}>
													Executed
												</Tag>
											)}
											</Td>
									</Tr>
								);
							})}
						</Tbody>
					</Table>
				</TableContainer>
			) : (
				<Box mx={4}>
					<Text color={"gray"}>No executed orders</Text>
				</Box>
			)}
		</Box>
	);
}
