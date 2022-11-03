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
const dummyPairs = [
	{
		id: '0x0000000000000000000000000000000000000000',
		token0: {
			id: 'TL9XwmUbYYDdNFkMpSs3x2DU2XSLa2XDGk',
			name: 'Ethereum',
			symbol: 'ETH',
			decimals: 18,
		},
		token1: {
			id: 'TBS4yTRWgfvxo8WF2DVZpMFdJqaKoKhekn',
			name: 'USD Coin',
			symbol: 'USDC',
			decimals: 6,
		},
		price: 1670.1231,
		tags: ['trending', 'eth', 'usd'],
	},
	{
		id: '0x0000000000000000000000000000000000000001',
		token0: {
			id: 'TBaZGjW1JfnfHzQfG711bKD9yix4ya2e79',
			name: 'Bitcoin',
			symbol: 'BTC',
			decimals: 18,
		},
		token1: {
			id: 'TBS4yTRWgfvxo8WF2DVZpMFdJqaKoKhekn',
			name: 'USD Coin',
			symbol: 'USDC',
			decimals: 6,
		},
		price: 19870.12,
		tags: ['trending', 'eth', 'usd'],
	},
];

const dummyTokens = [
	{
		id: 'TL9XwmUbYYDdNFkMpSs3x2DU2XSLa2XDGk',
		name: 'Ethereum',
		symbol: 'ETH',
		decimals: 18,
	},
	{
		id: 'TBS4yTRWgfvxo8WF2DVZpMFdJqaKoKhekn',
		name: 'USD Coin',
		symbol: 'USDC',
		decimals: 6,
	},
	{
		id: 'TBaZGjW1JfnfHzQfG711bKD9yix4ya2e79',
		name: 'Bitcoin',
		symbol: 'BTC',
		decimals: 18,
	}
];

function DataProvider({ children }: any) {
	const [isDataReady, setIsDataReady] = React.useState(false);
	const [isFetchingData, setIsFetchingData] = React.useState(false);
	const [dataFetchError, setDataFetchError] = React.useState<string | null>(null);
	const [pairs, setPairs] = React.useState<any[]>([]);
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
		]).then((res) => {
			// set balance in token
			let newTokens = _tokens.map((token, index) => {
				token.balance = res[0].balance[index].toString();
				token.allowance = res[1].balance[index].toString();
				token.tradingBalance = res[2].balance[index].toString();
				return token;
			})
			setTokens(newTokens);
		})
	};

	const fetchData = async (tronWeb: any, address: string) => {
		setIsFetchingData(true);
		setDataFetchError(null);
		try {
			// fetch data
			Promise.all([axios.get('https://api.zexe.io/allpairs'), axios.get('https://api.zexe.io/alltokens')]).then((res) => {
				setPairs(res[0].data.data);
				console.log('pairs', res[0].data.data);
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

	const value: DataValue = {
		isDataReady,
		pairs,
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
	tokens: any[];
	dataFetchError: string | null;
	dollarFormatter: any;
	tokenFormatter: any;
	isFetchingData: boolean;
	orders: any;
	fetchData: (_:any, __:string) => void;
}

export { DataProvider, DataContext };
