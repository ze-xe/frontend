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
	const [orders, setOrders] = React.useState<any>({});
	const [tokens, setTokens] = React.useState<any[]>([]);

	const [dollarFormatter, setDollarFormatter] = React.useState<null | {}>(
		new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		})
	);
	const [tokenFormatter, setTokenFormatter] = React.useState<null | {}>(
		new Intl.NumberFormat('en-US')
	);

	React.useEffect(() => {
	  getWalletBalances(DUMMY_ADDRESS);
	}, [])
	

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
				token.price = await getPrice(token.symbol)
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

	const fetchData = async (tronWeb: any, address: string) => {
		setIsFetchingData(true);
		setDataFetchError(null);
		try {
			// fetch data
			Promise.all([axios.get('https://api.zexe.io/allpairs'), axios.get('https://api.zexe.io/alltokens')]).then((res) => {
				setPairs(res[0].data.data);
				console.log('pairs', res[0].data.data);
				fetchPairData(res[0].data.data);
				setTokens(res[1].data.data);
				console.log('tokens', res[1].data.data);
				getWalletBalances(address, res[1].data.data);
				let orderRequests = res[0].data.data.map((pair) => {
					return axios.get(`https://api.zexe.io/orders/${pair.id}`);
				})
				Promise.all(orderRequests).then((res) => {
					let newOrders = {};
					res.forEach((order, index) => {
						return newOrders[order.data.data.pair] = order.data.data;
					})
					console.log(newOrders);
					setOrders(newOrders);
					setIsFetchingData(false);
					setIsDataReady(true);
				})
			})
		} catch (error) {
			setDataFetchError(error.message);
		}
		setIsFetchingData(false);
	};

	const fetchPairData = async (pairIds: any[]) => {
		// api.zexe.io/pair/pricetrend/{pair}?interval=300000
		let pairData = {};
		for(let i in pairIds) {
			let pair = pairIds[i].id;
			pairData[pair] = (await axios.get(`https://api.zexe.io/pair/pricetrend/${pair}?interval=300000`)).data.data;
		}
		setPairData(pairData);
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
		orders
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
}

export { DataProvider, DataContext };
