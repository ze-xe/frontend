import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import LendingTable from "../components/lever/lend/LendTable";
import BorrowTable from "../components/lever/borrow/BorrowTable";

import { LeverDataContext } from "../context/LeverDataProvider";
import { dollarFormatter, tokenFormatter } from '../utils/formatters';

// https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png
const imageIds = {
	ETH: "1027",
	BTC: "1",
	USDC: "3408",
	DAI: "4943",
};

export default function lend() {
	const { markets } = React.useContext(LeverDataContext);
	const { availableToBorrow, totalBorrowBalance, totalCollateralBalance } =
		React.useContext(LeverDataContext);

        const boxStyle = {
            px: 4,
            py: 10,
            my: 2,
            bgColor: "background2",
            width: "33%"
        }
	return (
		<>
			<Box py={10} mt={2} bgColor={"background2"}>
				<Heading mx={4}>Lend your assets</Heading>
				<Text mt={2} mx={4}>
					Earn with high APR %
				</Text>
			</Box>

			<Flex flexDir={"column"}>
				<Box width={"100%"}>
					<Flex justify="space-between">
						<Box
							{...boxStyle}
						>
							<Text fontSize={"lg"}>My Balance</Text>
							<Text mt={1} fontSize="2xl" fontWeight={"bold"}>
								{dollarFormatter(null).format(
									parseFloat(totalCollateralBalance)
								)}
							</Text>
						</Box>

						<Box
						    {...boxStyle}
						>
							<Text fontSize={"lg"}>Yield Accrued</Text>
							<Text mt={1} fontSize="2xl" fontWeight={"bold"}>
								{dollarFormatter(null).format(
									parseFloat(availableToBorrow)
								)}
							</Text>
						</Box>

                        <Box
						    {...boxStyle}
						>
							<Text fontSize={"lg"}>Earning APR (%)</Text>
							<Text mt={1} fontSize="2xl" fontWeight={"bold"}>
								{tokenFormatter(null).format(
									0
								)}
							</Text>
						</Box>

					</Flex>
					<LendingTable />
				</Box>
				<Box width={"100%"}>
					<Flex justify="space-between">
						<Box
						    {...boxStyle}
						>
							<Text fontSize={"lg"}>Borrow Balance</Text>
							<Text mt={1} fontSize="2xl" fontWeight={"bold"}>
								{dollarFormatter(null).format(
									parseFloat(totalCollateralBalance)
								)}
							</Text>
						</Box>

						

						<Box
						    {...boxStyle}
						>
							<Text fontSize={"lg"}>Available to borrow</Text>
							<Text mt={1} fontSize="2xl" fontWeight={"bold"}>
								{dollarFormatter(null).format(
									parseFloat(availableToBorrow)
								)}
							</Text>
						</Box>

                        <Box
						    {...boxStyle}
						>
							<Text fontSize={"lg"}>Interest APR (%)</Text>
							<Text mt={1} fontSize="2xl" fontWeight={"bold"}>
								{tokenFormatter(null).format(
									0
								)}
							</Text>
						</Box>
					</Flex>
					<BorrowTable />
				</Box>
			</Flex>
		</>
	);
}
