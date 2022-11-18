import { ChainID } from './chains';
export const DUMMY_ADDRESS = 'TU6nPbkDzMfhtg13nUnTMbuVFFMpLSs3P3';
export const HELPER = '';
export const EXCHANGE = '';
export const VAULT = '';
export const SYSTEM = '';

export const ADDRESSES = {
	[ChainID.NILE]: {
		System: 'TS4vQFq4uWtJi8MNW5fbPzGQNiJmoUB5iX',
		Helper: 'TSXXTkC6MsihVqqSnh7KQbgvwgqyPPq7Qt',
		Exchange: 'TQ32dozWeUuXYN8amYJhSGqJJpSU8oR6YV',
		Vault: 'TRDs6u17ACqoQXi1BTxWTWGBnZwDB7x4nN',
	},
    [ChainID.AURORA]: {
		System: '0x9F749C59D0332eC4F865360d0a6fF6Cdcf83Bd12',
		Helper: '0x13ace582a4B80913db1fe81135EA04983068267B',
		Exchange: '0x047d17892cd3D3226C455B12E5edef7d75b3E50D',
		Vault: '0x4811419e3c5e1d91Ac83427562a455C22B5eA95F',
	},
};

export const Endpoints = {
	[ChainID.NILE]: 'https://api.zexe.io/',
	[ChainID.AURORA]: 'https://aurora.api.zexe.io/',
};