import * as React from 'react';
import { DUMMY_ADDRESS, HELPER, Endpoints } from '../utils/const';
const { Big } = require('big.js');
import tronWeb from '../utils/tronWeb';
import axios from 'axios';
import { call, getABI, getAddress, getContract } from '../utils/contract';
import { ChainID, chains, chainMapping } from '../utils/chains';

const DataContext = React.createContext<DataValue>({} as DataValue);

// http://localhost:3010/allpairs
// http://localhost:3010/orders/1a7f0acc09e078a414a7d74d2d00434427ef2c021a09d075996d2441f0d4ab9c

// list of tokens
const coingeckoIds = {
	'BTC': 'bitcoin',
	'ETH': 'ethereum',
	'USDT': 'tether',
	'USDD': 'usdd',
	'WTRX': 'tron',
	'BTT': 'bittorrent',
	'NEAR': 'near',
	'AURORA': 'aurora-near',
	'USDC': 'usd-coin',
};

const dummyPrices = {
	'BTC': '18000',
	'ETH': '1200',
	'USDT': '1',
	'USDD': '1',
	'WTRX': '0.006',
	'BTT': '0.0000008',
	'NEAR': '3.2',
	'AURORA': '0.8',
	'USDC': '1',
};


function DataProvider({ children }: any) {
	const [isDataReady, setIsDataReady] = React.useState(false);
	const [isFetchingData, setIsFetchingData] = React.useState(false);
	const [dataFetchError, setDataFetchError] = React.useState<string | null>(null);
	const [pairs, setPairs] = React.useState<any[]>([]);
	const [pairData, setPairData] = React.useState<any>({});
	const [pairExecutedData, setPairExecutedData] = React.useState<any>({});
	const [pairStats, setPairStats] = React.useState<any>({});

	const [orders, setOrders] = React.useState<any>({});
	const [placedOrders, setPlacedOrders] = React.useState<any>({});
	const [orderHistory, setOrderHistory] = React.useState<any>({});
	const [cancelledOrders, setCancelledOrders] = React.useState<any>({});

	const [tokens, setTokens] = React.useState<any[]>([]);
	const [userDepositWithdraws, setUserDepositWithdraws] = React.useState<any>([]);
	const [chain, setChain] = React.useState(null);

	const [dollarFormatter, setDollarFormatter] = React.useState<null | {}>(
		new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		})
	);
	const [tokenFormatter, setTokenFormatter] = React.useState<null | {}>(
		new Intl.NumberFormat('en-US', {
			minimumFractionDigits: 2,
		})
	);

	React.useEffect(() => {}, [])	


	const explorer = () => {
		return chain === ChainID.NILE ? 'https://nile.tronscan.org/#/transaction/' : chainMapping[chain]?.blockExplorers.default.url+'tx/';
	}

	const getWalletBalances = async (address: string, _tokens = tokens, chain: number) => {
		let multicall = await getContract('Helper', chain);
		Promise.all([
			call(multicall, 'balanceOf', [_tokens.map(token => token.id), address], chain), 
			call(multicall, 'allowance', [_tokens.map(token => token.id), address, getAddress('Vault', chain)], chain), 
			call(multicall, 'tradingBalanceOf', [getAddress('Vault', chain), _tokens.map(token => token.id), address], chain), 
		]).then(async (res) => {
			// set balance in token
			let newTokens = []
			for(let index in _tokens) {
				let token = _tokens[index];
				token.balance = res[0][index].toString();
				token.allowance = res[1][index].toString();
				token.tradingBalance = res[2][index].toString();
				newTokens.push(token);
			}
			setTokens(newTokens);
		})
	};

	const getPrice = (token: string) => {
		return new Promise((resolve, reject) => {
			axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoIds[token]}&vs_currencies=usd`)
			.then((res) => {
				resolve(res.data[coingeckoIds[token]].usd);
			})
			.catch((e) => {
				resolve(dummyPrices[token]);
			})
		})
	}

	const fetchData = async (address: string|null, chain: ChainID, firstTime = true, _tokens=tokens, _pairs=pairs) => {
		setIsFetchingData(firstTime);
		setDataFetchError(null);
		try {
			// fetch data
			const requests = [axios.get(Endpoints[chain]+'allpairs')]
			if(firstTime) requests.push(axios.get(Endpoints[chain]+'alltokens'))
			Promise.all(requests).then(async (res) => {
				_pairs = res[0].data.data;
				setPairs(_pairs);
				fetchPairData(_pairs, chain);
				fetchPairStatus(_pairs, chain);

				if(firstTime) {
					_tokens = res[1].data.data;
					for(let i in _tokens){
						let token = _tokens[i];
						token.price = await getPrice(token.symbol)
					}
					setTokens(_tokens);
					console.log('pairs', _pairs);
					console.log('tokens', _tokens);
				}

				if(address) {
					getWalletBalances(address, _tokens, chain);
					fetchPlacedOrders(address, _pairs, chain)
					fetchCancelledOrders(address, _pairs, chain)
					fetchExecutedOrders(address, _pairs, chain)
					fetchUserDepositsWithdraws(address, chain)
				}
				fetchOrders(_pairs, chain)
				fetchExecutedPairData(_pairs, chain);
				setTimeout(() => fetchData(address, chain, false, _tokens, _pairs), 8000);
			})
		} catch (error) {
			setDataFetchError(error.message);
		}
		setIsFetchingData(false);
	};

	const fetchOrders = (pairs: any[], chain: number) => {
		let orderRequests = pairs.map((pair) => {
			return axios.get(Endpoints[chain]+`orders/${pair.id}`);
		})
		Promise.all(orderRequests).then((res) => {
			let newOrders = {};
			res.forEach((order, index) => {
				return newOrders[order.data.data.pair] = order.data.data;
			})
			setOrders(newOrders);
		})
	}

	const fetchPlacedOrders = (address: string, pairs: any[], chain: number) => {
		let orderRequests = pairs.map((pair) => {
			return axios.get(Endpoints[chain]+`orders_placed/${address}/${pair.id}`);
		})
		Promise.all(orderRequests).then((res) => {
			let newOrders = {};
			res.forEach((order, index) => {
				return newOrders[pairs[index].id] = order.data.data;
			})
			setPlacedOrders(newOrders);
		})
	}
	
	// api.zexe.io/pair/pricetrend/{pair}?interval=300000
	const fetchPairData = (pairs: any[], chain: number) => {
		let pairRequests = pairs.map((pair) => {
			return axios.get(Endpoints[chain]+`pair/pricetrend/${pair.id}?interval=300000`);
		})
		Promise.all(pairRequests).then((res) => {
			let newPairs = {};
			res.forEach((pair, index) => {
				return newPairs[pairs[index].id] = pair.data.data;
			})
			setPairData(newPairs);
		})
	}
	
	// /pair/orders/history/:id
	const fetchExecutedPairData = async (pairs: any[], chain: number) => {
		let pairRequests = pairs.map((pair) => {
			return axios.get(Endpoints[chain]+`pair/orders/history/${pair.id}`);
		})
		Promise.all(pairRequests).then((res) => {
			let newPairs = {};
			res.forEach((pair, index) => {
				return newPairs[pairs[index].id] = pair.data.data;
			})
			setPairExecutedData(newPairs);
		})
	}

	// /orders_history/:taker/:pairId
	const fetchExecutedOrders = async (address: string, pairs: any[], chain: number) => {
		let pairRequests = pairs.map((pair) => {
			return axios.get(Endpoints[chain]+`orders_history/${address}/${pair.id}`);
		})
		Promise.all(pairRequests).then((res) => {
			let newPairs = {};
			res.forEach((pair, index) => {
				return newPairs[pairs[index].id] = pair.data.data;
			})
			setOrderHistory(newPairs);
		})
	}

	// /user/order/cancelled/:maker/:pairId
	const fetchCancelledOrders = async (address: string, pairs: any[], chain: number) => {
		let pairRequests = pairs.map((pair) => {
			return axios.get(Endpoints[chain]+`user/order/cancelled/${address}/${pair.id}`);
		})
		Promise.all(pairRequests).then((res) => {
			let newPairs = {};
			res.forEach((pair, index) => {
				return newPairs[pairs[index].id] = pair.data.data;
			})
			setCancelledOrders(newPairs);
		})
	}

	// /pair/trading/status/:pairId
	const fetchPairStatus = async (pairs: any[], chain: number) => {
		let pairRequests = pairs.map((pair) => {
			return axios.get(Endpoints[chain]+`pair/trading/status/${pair.id}`);
		})
		Promise.all(pairRequests).then((res) => {
			let newPairs = {};
			res.forEach((pair, index) => {
				return newPairs[pairs[index].id] = pair.data.data;
			})
			setPairStats(newPairs);
		})
	}

	// /user/deposits/withdraws/:id
	const fetchUserDepositsWithdraws = async (address: string, chain: number) => {
		axios.get(Endpoints[chain]+'user/deposits/withdraws/' + address).then((res) => {
			setUserDepositWithdraws(res.data.data);
		})
	}

	const value: DataValue = {
		isDataReady,
		pairs,
		pairData,
		tokens,
		dataFetchError,
		dollarFormatter,
		tokenFormatter,
		isFetchingData,
		fetchData,
		orders,
		placedOrders,
		pairExecutedData,
		cancelledOrders,
		orderHistory,
		pairStats,
		userDepositWithdraws,
		chain, setChain,
		explorer
	};

	return (
		<DataContext.Provider value={value}>{children}</DataContext.Provider>
	);
}

interface DataValue {
	isDataReady: boolean;
	pairs: any[];
	pairData: any[];
	tokens: any[];
	dataFetchError: string | null;
	dollarFormatter: any;
	tokenFormatter: any;
	isFetchingData: boolean;
	orders: any;
	fetchData: (address :string, chainId: ChainID) => void;
	placedOrders: any,
	pairExecutedData: any,
	cancelledOrders: any,
	orderHistory: any,
	pairStats: any,
	userDepositWithdraws: any,
	chain: number, setChain: (chain: number) => void,
	explorer: () => string
}

export { DataProvider, DataContext };
