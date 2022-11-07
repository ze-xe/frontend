import * as React from 'react';
import { DUMMY_ADDRESS, HELPER } from '../utils/const';
const { Big } = require('big.js');
import tronWeb from '../utils/tronWeb';
import axios from 'axios';
import { getABI, getAddress } from '../utils/contract';

const DataContext = React.createContext<DataValue>({} as DataValue);

// http://localhost:3010/allpairs
// http://localhost:3010/orders/1a7f0acc09e078a414a7d74d2d00434427ef2c021a09d075996d2441f0d4ab9c

// list of tokens
const coingeckoIds = {
	'BTC': 'bitcoin',
	'ETH': 'ethereum',
	'USDT': 'tether',
	'USDD': 'usdd',
	'TRX': 'tron',
	'BTT': 'bittorrent',
};

const dummyPrices = {
	'BTC': '20000',
	'ETH': '1400',
	'USDT': '1',
	'USDD': '1',
	'TRX': '0.006',
	'BTT': '0.0000000008',
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

	const getWalletBalances = async (address: string, _tokens = tokens) => {
		let multicall = await tronWeb.contract(getABI('Helper'), getAddress('Helper'));
		Promise.all([
			multicall.balanceOf(_tokens.map(token => token.id), address).call(), 
			multicall.allowance(_tokens.map(token => token.id), address, getAddress('Vault')).call(),
			multicall.tradingBalanceOf(getAddress('Vault'), _tokens.map(token => token.id), address).call(),
		]).then(async (res) => {
			// set balance in token
			let newTokens = []
			for(let index in _tokens) {
				let token = _tokens[index];
				token.balance = res[0].balance[index].toString();
				token.allowance = res[1].balance[index].toString();
				token.tradingBalance = res[2].balance[index].toString();
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

	const fetchData = async (tronWeb: any, address: string|null, firstTime = true, _tokens=tokens, _pairs=pairs) => {
		setIsFetchingData(firstTime);
		setDataFetchError(null);
		try {
			// fetch data
			const requests = [axios.get('https://api.zexe.io/allpairs')]
			if(firstTime) requests.push(axios.get('https://api.zexe.io/alltokens'))
			Promise.all(requests).then(async (res) => {
				_pairs = res[0].data.data;
				setPairs(_pairs);
				fetchPairData(_pairs);
				fetchPairStatus(_pairs);

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
					getWalletBalances(address, _tokens);
					fetchPlacedOrders(address, _pairs)
					fetchCancelledOrders(address, _pairs)
					fetchExecutedOrders(address, _pairs)
					fetchUserDepositsWithdraws(address)
				}
				fetchOrders(_pairs)
				fetchExecutedPairData(_pairs);
				setTimeout(() => fetchData(tronWeb, address, false, _tokens, _pairs), 8000);
			})
		} catch (error) {
			setDataFetchError(error.message);
		}
		setIsFetchingData(false);
	};


	const fetchOrders = (pairs: any[]) => {
		let orderRequests = pairs.map((pair) => {
			return axios.get(`https://api.zexe.io/orders/${pair.id}`);
		})
		Promise.all(orderRequests).then((res) => {
			let newOrders = {};
			res.forEach((order, index) => {
				return newOrders[order.data.data.pair] = order.data.data;
			})
			setOrders(newOrders);
		})
	}

	const fetchPlacedOrders = (address: string, pairs: any[]) => {
		let orderRequests = pairs.map((pair) => {
			return axios.get(`https://api.zexe.io/orders_placed/${address}/${pair.id}`);
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
	const fetchPairData = (pairs: any[]) => {
		let pairRequests = pairs.map((pair) => {
			return axios.get(`https://api.zexe.io/pair/pricetrend/${pair.id}?interval=300000`);
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
	const fetchExecutedPairData = async (pairs: any[]) => {
		let pairRequests = pairs.map((pair) => {
			return axios.get(`https://api.zexe.io/pair/orders/history/${pair.id}`);
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
	const fetchExecutedOrders = async (address: string, pairs: any[]) => {
		let pairRequests = pairs.map((pair) => {
			return axios.get(`https://api.zexe.io/orders_history/${address}/${pair.id}`);
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
	const fetchCancelledOrders = async (address: string, pairs: any[]) => {
		let pairRequests = pairs.map((pair) => {
			return axios.get(`https://api.zexe.io/user/order/cancelled/${address}/${pair.id}`);
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
	const fetchPairStatus = async (pairs: any[]) => {
		let pairRequests = pairs.map((pair) => {
			return axios.get(`https://api.zexe.io/pair/trading/status/${pair.id}`);
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
	const fetchUserDepositsWithdraws = async (address: string) => {
		axios.get('https://api.zexe.io/user/deposits/withdraws/' + address).then((res) => {
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
		userDepositWithdraws
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
	fetchData: (_:any, __:string) => void;
	placedOrders: any,
	pairExecutedData: any,
	cancelledOrders: any,
	orderHistory: any,
	pairStats: any,
	userDepositWithdraws: any
}

export { DataProvider, DataContext };
