import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import LendingTable from "../components/lever/lend/LendTable";
import BorrowTable from "../components/lever/borrow/BorrowTable";

import { LeverDataContext } from "../context/LeverDataProvider";
import { dollarFormatter, tokenFormatter } from '../utils/formatters';
import {useEffect} from 'react';
import { AppDataContext } from "../context/AppData";
import { DataContext } from "../context/DataProvider";
import { call, getContract, send } from "../utils/contract";
import { useAccount } from 'wagmi';
import { ChainID } from '../utils/chains';

// https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png
const imageIds = {
	ETH: "1027",
	BTC: "1",
	USDC: "3408",
	DAI: "4943",
};

export default function lend() {
	const { markets, availableToBorrow, totalBorrowBalance, totalCollateralBalance } = React.useContext(LeverDataContext);
	const { chain } = React.useContext(DataContext);
	const {address} = useAccount();
	const [claimLoading, setClaimLoading] = React.useState(false);

	const [zexeAccrued, setZexeAccrued] = React.useState(null);
	const boxStyle = {
		px: 4,
		py: 10,
		my: 1,
		bgColor: "background2",
		width: 100/3 + "%"
	}

	useEffect(() => {
		if(!zexeAccrued){
			getContract('Lever', chain)
			.then(lever => {
				call(lever, 'compAccrued', [address], chain ?? ChainID.ARB_GOERLI)
				.then((res: any) => {
					setZexeAccrued(res.toString());
				})
			})
		}
	})

	const claim = () => {
		setClaimLoading(true);
		getContract('Lever', chain)
		.then(lever => {
			send(lever, 'claimComp(address)', [address], chain ?? ChainID.ARB_GOERLI)
			.then((res: any) => {
				setClaimLoading(false);
			})
		})
	}
	return (
		<>
			<Box py={10} mt={1} bgColor={"background2"}>
				<Heading mx={4}>Lend your assets</Heading>
				<Text mt={2} mx={4}>
					Earn with high APR % 💰
				</Text>
			</Box>

			<Flex flexDir={"column"}>
				<Box width={"100%"}>
					<Flex justify="space-between" gap={1}>
						<Box
							{...boxStyle}
						>
							<Text fontSize={"md"}>My Balance</Text>
							<Text mt={1} fontSize="2xl" fontWeight={"bold"}>
								{dollarFormatter(null).format(
									parseFloat(totalCollateralBalance)
								)}
							</Text>
						</Box>

						<Box
						    {...boxStyle}
						>
							<Text fontSize={"md"}>$ZEXE Rewards</Text>
							<Flex gap={5} align='center'>

							<Text mt={1} fontSize="2xl" fontWeight={"bold"}>
								{tokenFormatter(null).format(
									zexeAccrued / 10 ** 18
									)} ZEXE
							</Text>
							<Button size={'sm'} onClick={claim} isLoading={claimLoading} loadingText='Claiming...'>Claim 💸</Button>
							</Flex>
						</Box>

                        <Box
						    {...boxStyle}
						>
							<Text fontSize={"md"}>Earning APR (%)</Text>
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
					<Flex justify="space-between" gap={1}>
						<Box
						    {...boxStyle}
						>
							<Text fontSize={"md"}>Borrow Balance</Text>
							<Text mt={1} fontSize="2xl" fontWeight={"bold"}>
								{dollarFormatter(null).format(
									parseFloat(totalCollateralBalance)
								)}
							</Text>
						</Box>

						

						<Box
						    {...boxStyle}
						>
							<Text fontSize={"md"}>Available to borrow</Text>
							<Text mt={1} fontSize="2xl" fontWeight={"bold"}>
								{dollarFormatter(null).format(
									parseFloat(availableToBorrow)
								)}
							</Text>
						</Box>

                        <Box
						    {...boxStyle}
						>
							<Text fontSize={"md"}>Interest APR (%)</Text>
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
