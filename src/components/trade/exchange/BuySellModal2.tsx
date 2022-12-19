import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Flex,
	Skeleton,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import React, { useContext } from "react";
const Big = require("big.js");

import axios from "axios";

import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
} from "@chakra-ui/react";

import { DataContext } from "../../../context/DataProvider";
import { useAccount, useSignTypedData } from "wagmi";
import { Endpoints } from "../../../utils/const";
import OrdersToExecute from "./OrdersToExecute";

import { Step, Steps, useSteps } from "chakra-ui-steps";
import PlaceOrder from "./PlaceOrder";
import { useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import {
	getAddress,
	getContract,
	getInterface,
	send,
} from "../../../utils/contract";
import { ethers } from "ethers";
import { tokenFormatter } from "../../../utils/formatters";

export default function BuySellModal2({
	pair,
	token1,
	token0,
	token1Amount, // needed for market orders
	token0Amount,
	price, // needed for limit orders
	buy,
	limit,
}) {
	if (token0Amount == "") token0Amount = "0";
	if (token1Amount == "") token1Amount = "0";
	if (price == "") price = "0";

	const toast = useToast();
	const toastIdRef = React.useRef();

	const { isOpen, onOpen, onClose } = useDisclosure();
	const [orders, setOrders] = React.useState<any[] | null>(null);
	const [orderToPlace, setOrderToPlace] = React.useState(null);

	const [loading, setLoading] = React.useState(false);

	const { address, isConnected: isEvmConnected } = useAccount();

	const { chain, incrementAllowance } = useContext(DataContext);
	const { data, isError, isLoading, isSuccess, signTypedDataAsync } =
		useSignTypedData();

	const amountExceedsBalance = () => {
		const amount = buy ? token0Amount * price : token0Amount;
		const balance = buy
			? token1?.balance / 10 ** token1?.decimals
			: token0?.balance / 10 ** token0?.decimals;

		if (isNaN(Number(amount))) return false;
		return Big(amount).gt(balance);
	};

	useEffect(() => {
		if (token0Amount > 0 && token0 && !orderToPlace) {
			setOrderToPlace(
				Big(token0Amount)
					.times(10 ** token0?.decimals)
					.toFixed(0)
			);
		}
	});

	const approve = async () => {
		setLoading(true);
		const token = await getContract("ERC20", chain, tokenToSpend.id);
		send(
			token,
			"approve",
			[getAddress("Exchange", chain), ethers.constants.MaxUint256],
			chain
		)
			.then(async (res: any) => {
				await res.wait(1);
				setLoading(false);
				incrementAllowance(
					tokenToSpend.id,
					ethers.constants.MaxUint256.toString()
				);
			})
			.catch((err: any) => {
				setLoading(false);
				console.log(err);
			});
	};

	const _onOpen = () => {
		onOpen();
		let _amount = Big(token0Amount)
			.times(10 ** token0.decimals)
			.toFixed(0);
		if (buy && !limit) {
			_amount = Big(token1Amount)
				.times(10 ** token1.decimals)
				.toFixed(0);
		}

		axios
			.get(
				Endpoints[chain] +
					`order/${limit ? "limit" : "market"}/matched/` +
					pair.id,
				{
					params: {
						amount: _amount,
						exchangeRate: Big(price)
							.times(10 ** 18)
							.toFixed(0),
						buy,
						chainId: chain,
					},
				}
			)
			.then((resp) => {
				let _orders = resp.data.data;
				console.log(_orders);
				setOrders(_orders);
			});
	};

	const execute = async () => {
		setLoading(true);
		let _amount = Big(token0Amount)
			.times(10 ** token0.decimals)
			.toFixed(0);
		// if we're buying && market order: use token1Amount
		if (buy && !limit) {
			_amount = Big(token1Amount)
				.times(10 ** token1.decimals)
				.toFixed(0);
		}

		try{
		const _orders = (
			await axios.get(
				Endpoints[chain] +
					`order/${limit ? "limit" : "market"}/matched/` +
					pair.id,
				{
					params: {
						amount: _amount,
						exchangeRate: Big(price)
							.times(10 ** 18)
							.toFixed(0),
						buy,
						chainId: chain,
					},
				}
			)
		).data.data;

		console.log(_orders);
		if (_orders.length > 0) {
			const exchange = await getContract("Exchange", chain);
			toast.close(toastIdRef.current);
			toastIdRef.current = toast({
				title: "Sending transaction...",
				description: `Executing orders within ${tokenFormatter(null).format(price)} ${token1.symbol}/${token0.symbol} limit`,
				status: "loading",
				duration: null,
			});
			console.log(_amount);
			const res = await send(
				exchange,
				(buy && !limit) ? "executeMultipleMarketOrders": "executeMultipleLimitOrders",
				[
					_orders.map((order: any) => order.signature),
					_orders.map((order: any) => order.value),
					_amount,
				],
				chain
			);
			const receipt = await res.wait(1);
			const exchangeItf = await getInterface("Exchange", chain);
			let total = Big(0);
			receipt.logs.forEach((log: any) => {
				try {
					const parsed = exchangeItf.parseLog(log);
					if (parsed.name == "OrderExecuted") {
						console.log(parsed);
						total = total.plus(parsed.args.fillAmount);
					}
				} catch (err) {}
			});
			
			_amount = Big(_amount).sub(total).toFixed(0);
		}
		if (Big(_amount).gt(0) && limit) {
			toast.close(toastIdRef.current);
			toastIdRef.current = toast({
				title: "Placing order...",
				description: `Creating limit order of ${tokenFormatter(null).format(_amount/1e18)} ${token0.symbol} at ${tokenFormatter(null).format(price)} ${token1.symbol}/${token0.symbol}`,
				status: "loading",
				duration: null,
			});
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
				maker: address,
				token0: token0.id,
				token1: token1.id,
				amount: _amount,
				buy,
				salt: (Math.random() * 1000000).toFixed(0),
				exchangeRate: ethers.utils
					.parseEther(price.toString())
					.toString(),
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
						toast.close(toastIdRef.current);
						toast({
							title: "Order created successfully!",
							description: "Order created successfully!",
							status: "success",
						});
					})
					.catch((err) => {
						setLoading(false);
						toast.close(toastIdRef.current);
						toast({
							title: "Order failed. Please try again!",
							description: err.response.data.error,
							status: "error",
						});
					});
			});
		} else {
			setLoading(false);
			toast.close(toastIdRef.current);
			toast({
				title: "Order executed successfully!",
				description: "Amount was filled within limit!",
				status: "success",
			});
		}
	} catch(err) {
		console.log(err);
		setLoading(false);
		toast.close(toastIdRef.current);
		toast({
			title: "Order failed. Please try again!",
			description: 'Order failed',
			status: "error",
		});
	}
	};

	const { nextStep, prevStep, setStep, reset, activeStep } = useSteps({
		initialStep: 0,
	});

	const _onClose = () => {
		setOrderToPlace(null);
		setOrders(null);
		onClose();
		reset();
	};

	const tokenAmountToSpend = buy ? token1Amount : token0Amount;
	const tokenToSpend = buy ? token1 : token0;

	return (
		<>
			{Big(tokenAmountToSpend).lt(tokenToSpend?.allowance ?? 1e50) ? (
				<Button
					width={"100%"}
					mt="2"
					bgColor={buy ? "green2" : "red2"}
					onClick={execute}
					disabled={
						loading ||
						!Big(token0Amount).gt(0) ||
						!isEvmConnected ||
						amountExceedsBalance() ||
						price == "" ||
						Number(price) <= 0
					}
					loadingText="Executing..."
					isLoading={loading}
				>
					{!isEvmConnected
						? "Connect Wallet"
						: !Big(token0Amount).gt(0)
						? "Enter Amount"
						: amountExceedsBalance()
						? "Insufficient Trading Balance"
						: (limit ? "Limit " : "Market ") + (buy ? "Buy" : "Sell")}
				</Button>
			) : (
				<Button
					width={"100%"}
					mt="2"
					onClick={approve}
					loadingText="Approving..."
					isLoading={loading}
				>
					Approve {tokenToSpend?.symbol}
				</Button>
			)}
			<Modal
				isOpen={isOpen}
				onClose={_onClose}
				isCentered
				size={"xl"}
				scrollBehavior="inside"
			>
				<ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
				<ModalOverlay />
				<ModalContent bgColor={"gray.1000"} pb={4}>
					<ModalHeader>
						{orders
							? orders.length > 0 && !(activeStep >= 1)
								? "Execute orders within limit"
								: "Place order"
							: "Review Order"}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex flexDir="column" width="100%">
							{orders ? (
								limit ? (
									orders.length > 0 ? (
										<Steps activeStep={activeStep}>
											<Step label={"Execute"}>
												<Box mt={4}>
													<OrdersToExecute
														limit={limit}
														price={price}
														orders={orders}
														pair={pair}
														amountToFill={
															token0Amount
														}
														close={_onClose}
														nextStep={nextStep}
														buy={buy}
														token0={token0}
														token1={token1}
														setOrderToPlace={
															setOrderToPlace
														}
													/>
												</Box>
											</Step>
											<Step label={"Place"}>
												<Box mt={4}>
													<PlaceOrder
														orderAmount={
															token0Amount
														}
														amountToPlace={
															orderToPlace
														}
														nextStep={_onClose}
														buy={buy}
														token0={token0}
														token1={token1}
														price={price}
													/>
												</Box>
											</Step>
										</Steps>
									) : (
										<PlaceOrder
											orderAmount={token0Amount}
											amountToPlace={orderToPlace}
											nextStep={_onClose}
											buy={buy}
											token0={token0}
											token1={token1}
											price={price}
										/>
									)
								) : (
									<OrdersToExecute
										limit={limit}
										price={price}
										orders={orders}
										pair={pair}
										amountToFill={token0Amount}
										close={_onClose}
										nextStep={nextStep}
										buy={buy}
										token0={token0}
										token1={token1}
										setOrderToPlace={setOrderToPlace}
									/>
								)
							) : (
								<>
									<Skeleton
										height="40px"
										bg="green.500"
										color="white"
										mt={4}
										fadeDuration={1}
									></Skeleton>
									<Skeleton
										height="40px"
										bg="green.500"
										color="white"
										mt={2}
										fadeDuration={1}
									></Skeleton>
									<Skeleton
										height="40px"
										bg="green.500"
										color="white"
										mt={2}
										mb={4}
										fadeDuration={1}
									></Skeleton>
								</>
							)}
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
}
