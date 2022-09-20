import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

const theme = {
	...DefaultTheme,
	// Specify custom property
	myOwnProperty: true,
	// Specify custom property in nested object
	colors: {
		...DefaultTheme.colors,
		primary: "#BADA55",
	},
};

export default function App() {
	const isLoadingComplete = useCachedResources();

	if (!isLoadingComplete) {
		return null;
	} else {
		return (
			<PaperProvider theme={theme}>
				<SafeAreaProvider>
					<Navigation />
					<StatusBar />
				</SafeAreaProvider>
			</PaperProvider>
		);
	}
}
