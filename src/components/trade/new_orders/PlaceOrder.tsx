import { Alert, AlertIcon, Box, Button, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import Big from "big.js";
import { ethers, TypedDataDomain } from "ethers";
import Link from "next/link";
import React, { useContext } from "react";
import { useAccount, useSignTypedData } from "wagmi";
import { DataContext } from "../../../context/DataProvider";
import { WalletContext } from "../../../context/Wallet";
import { getAddress } from "../../../utils/contract";

export default function PlaceOrder({
    orderAmount,
	amountToPlace,
	token0,
	token1,
	price,
	buy,
	nextStep,
}) {
	const [loading, setLoading] = React.useState(false);
	const [response, setResponse] = React.useState(null);
	const [hash, setHash] = React.useState(null);
	const [confirmed, setConfirmed] = React.useState(false);

	const { data, isError, isLoading, isSuccess, signTypedDataAsync } = useSignTypedData();

	const { chain, explorer } = useContext(DataContext);
	const { address: TronAddress } = useContext(WalletContext);
	const { address: EvmAddress } = useAccount();

	const place = async () => {
		setLoading(true);
		setConfirmed(false);
		setHash(null);
		setResponse("");

		let _amount = Big(amountToPlace)
			// .times(10 ** token0.decimals)
			.toFixed(0);

		const domain: any = {
			name: "zexe",
			version: "1",
			chainId: chain.toString(),
			verifyingContract: getAddress("Exchange", chain),
		};

		// The named list of all type definitions
		const types = {
			Order: [
				{ name: "maker", type: "address" },
				{ name: "token0", type: "address" },
				{ name: "token1", type: "address" },
				{ name: "amount", type: "uint256" },
				{ name: "buy", type: "bool" },
				{ name: "salt", type: "uint32" },
				{ name: "exchangeRate", type: "uint216" },
			],
		};

		const value = {
			maker: TronAddress ?? EvmAddress,
			token0: token0.id,
			token1: token1.id,
			amount: _amount,
			buy,
			salt: (Math.random() * 1000000).toFixed(0),
			exchangeRate: ethers.utils.parseEther((price).toString()).toString(),
		};

		signTypedDataAsync({
			domain,
			types,
			value,
		}).then((signature) => {
			console.log(signature);
			axios
				.post("http://localhost:3010/order/create", {
					signature,
					data: value,
					chainId: chain.toString(),
				})
				.then((res) => {
					setLoading(false);
					setConfirmed(true);
					setResponse("Order created successfully!");
					console.log(res);
				})
				.catch((err) => {
					setLoading(false);
					setConfirmed(true);
					setResponse("Order failed. Please try again!");
					console.log("err", err);
				});
		});
	};


	return (
		<Box>
            <Text fontSize={"sm"} color="gray" mt={1}>Order amount</Text>
            <Text>{orderAmount}</Text>

            <Text fontSize={"sm"} color="gray" mt={1}>Executed amount</Text>
            <Text>{Big(orderAmount).minus(Big(amountToPlace).div(10 ** 18)).toFixed(10)}</Text>

			{amountToPlace == 0 ? (
                <>
				<Box my={4}>
                    <Text fontSize={'lg'} fontWeight='bold'>Limit order was executed successfully!</Text>
                </Box>
                    <Button width={'100%'} onClick={nextStep}>Close</Button>
                </>
			) : (
				<>
                <Text fontSize={"sm"} color="gray" mt={1}>Order amount to place</Text>
                <Text>{Big(amountToPlace).div(10**18).toFixed(10)}</Text>

					<Flex flexDir={"column"} width={"100%"} mt={4}>
						{response ? (
							<Box mb={2}>
								<Box width={"100%"} mb={2}>
									<Alert
										status={
											response.includes("confirm")
												? "info"
												: confirmed &&
												  response.includes("success")
												? "success"
												: "error"
										}
										variant="subtle"
									>
										<AlertIcon />
										<Box>
											<Text fontSize="md" mb={0}>
												{response}
											</Text>
											{hash && (
												<Link
													href={explorer() + hash}
													target="_blank"
												>
													{" "}
													<Text fontSize={"sm"}>
														View on explorer
													</Text>
												</Link>
											)}
										</Box>
									</Alert>
								</Box>
								<Button onClick={nextStep} width="100%">
									Close
								</Button>
							</Box>
						) : (
							<>
								<Button
									bgColor={buy ? "green2" : "red2"}
									mt={4}
									width="100%"
									onClick={place}
									loadingText="Sign the transaction in your wallet"
									isLoading={loading}
								>
									Place {buy? 'buy' : 'sell'} order
								</Button>
								{/* <Button onClick={onClose} mt={2}>
										Cancel
									</Button>{' '} */}
							</>
						)}
					</Flex>
				</>
			)}
		</Box>
	);
}
