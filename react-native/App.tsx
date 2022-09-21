import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import React from 'react';
import CurrentScoreProvider from './context/currentscore/CurrentScoreProvider';
import GameProvider from './context/GameProvider';

const theme = {
	...DefaultTheme,
	// Specify custom property
	myOwnProperty: true,
	// Specify custom property in nested object
	colors: {
		...DefaultTheme.colors,
		primary: "black",
		
	},
};

export default function App() {
	const isLoadingComplete = useCachedResources();

	if (!isLoadingComplete) {
		return null;
	} else {
		return (
			<PaperProvider theme={theme}>
				<GameProvider>
					<CurrentScoreProvider>

					<SafeAreaProvider>
						<Navigation />
						<StatusBar />
					</SafeAreaProvider>
					</CurrentScoreProvider>
          		</GameProvider>
			</PaperProvider>
		);
	}
}
