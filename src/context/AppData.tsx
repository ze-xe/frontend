import * as React from 'react';
import { DUMMY_ADDRESS } from '../utils/const';
const { Big } = require('big.js');

const AppDataContext = React.createContext<AppDataValue>({} as AppDataValue);

function AppDataProvider({ children }: any) {
	const [activePair, setActivePair] = React.useState<any>({});

	const value: AppDataValue = {
		activePair,
        setActivePair,
	};

	return (
		<AppDataContext.Provider value={value}>
			{children}
		</AppDataContext.Provider>
	);
}

interface AppDataValue {
	activePair: any;
    setActivePair: React.Dispatch<React.SetStateAction<any>>;
}

export { AppDataProvider, AppDataContext };
