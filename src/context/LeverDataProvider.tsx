import * as React from 'react';
import { DUMMY_ADDRESS, HELPER, Endpoints, ADDRESSES } from '../utils/const';
const { Big } = require('big.js');
import tronWeb from '../utils/tronWeb';
import axios from 'axios';
import { call, getABI, getAddress, getContract } from '../utils/contract';
import { ChainID, chains, chainMapping } from '../utils/chains';
import { getBalancesAndApprovals } from '../utils/balances';
import { BigNumber, ethers } from 'ethers';
import { Interface } from 'ethers/lib/utils.js';

const LeverDataContext = React.createContext<DataValue>({} as DataValue);

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

import erc20 from '../abis/ERC20.json'
import multicall from '../abis/Multicall2.json'


function LeverDataProvider({ children }: any) {
	const [isDataReady, setIsDataReady] = React.useState(false);
	const [isFetchingData, setIsFetchingData] = React.useState(false);
	const [dataFetchError, setDataFetchError] = React.useState<string | null>(null);
	const [markets, setMarkets] = React.useState<any[]>([]);

	React.useEffect(() => {
        // fetch data if not fetched yet / is not fetching
        // if (!isDataReady && !isFetchingData) {
        //     fetchData();
        // }
    }, [])	

	const getWalletBalances = async (address: string, _markets = markets, chain: ChainID) => {
		const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    const itf = new Interface(erc20.abi);
    const multicallContract = new ethers.Contract(
        ADDRESSES[chain].Multicall,
        multicall.abi,
        provider.getSigner()
    );

    let calls = []
    for (let i = 0; i<_markets.length; i++) {
        calls.push([_markets[i].inputToken.id, itf.encodeFunctionData('balanceOf', [address])])
        calls.push([_markets[i].inputToken.id, itf.encodeFunctionData('allowance', [address, _markets[i].id])])
        calls.push([_markets[i].id, itf.encodeFunctionData('balanceOf', [address])])
    }

	return multicallContract.callStatic.aggregate(calls)
		.then((res) => {
			for(let i = 0; i < res[1].length; i+=3){
				_markets[i/3].balance = BigNumber.from(res[1][i]).toString();
				_markets[i/3].allowance = BigNumber.from(res[1][i+1]).toString();
				_markets[i/3].cTokenBalance = BigNumber.from(res[1][i+2]).toString();
			}
			setMarkets(_markets);
		})
	};

	const fetchData = async (address: string, chain: ChainID) => {
		setIsFetchingData(true);
		setDataFetchError(null);
		try {
			// fetch data
			const requests = [axios.post('https://api.thegraph.com/subgraphs/name/ze-xe/lever', {
                query: 
                `{
					markets{
						id
						inputToken{
							id
							name
							symbol
							lastPriceUSD
						}
						rates {
							rate
						}
						exchangeRate
						inputTokenPriceUSD
						totalDepositBalanceUSD
						totalBorrowBalanceUSD
					}
				}`
            })]
			Promise.all(requests).then(async (res) => {
                if(res[0].data.errors){
                    setDataFetchError(res[0].data.errors[0].message)
                    return
                }                
                setMarkets(res[0].data.data.markets)
				getWalletBalances(address, res[0].data.data.markets, chain);
			})
		} catch (error) {
			setDataFetchError(error.message);
		}
		setIsFetchingData(false);
	};

	const value: DataValue = {
		isDataReady,
        markets,
		dataFetchError,
		isFetchingData,
		fetchData,
	};

	return (
		<LeverDataContext.Provider value={value}>{children}</LeverDataContext.Provider>
	);
}

interface DataValue {
	isDataReady: boolean;
	markets: any[];
	dataFetchError: string | null;
	isFetchingData: boolean;
	fetchData: (address :string, chainId: ChainID, loop?: boolean) => void;
}

export { LeverDataProvider, LeverDataContext };
