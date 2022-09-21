/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";

import Colors from "../constants/Colors";
import { LeaderBoard } from "../screens/LeaderBoardScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { RootStackParamList, RootTabParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { UserSettingsScreen } from "../screens/UserSettingsScreen";
import { GameScreen } from "../screens/GameScreen";
import { Dimensions, Image } from "react-native";

export default function Navigation() {
	return (
		<NavigationContainer linking={LinkingConfiguration}>
			<RootNavigator />
		</NavigationContainer>
	);
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
      />
      <Stack.Screen
        name="Game"
        component={GameScreen}
      />
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {

	return (
		<BottomTab.Navigator
			initialRouteName="Home"
			screenOptions={{
				headerShown: false,
				tabBarShowLabel: false,
				tabBarStyle: {
					borderWidth: 0,
					shadowColor: "transparent",
					elevation: 0,
					borderColor: "transparent",
					borderTopColor: "transparent",
				},
			}}
		>
			<BottomTab.Screen
				name="Home"
				component={HomeScreen}
				options={{
					tabBarIcon: ({ focused }) => (
						<TabBarIcon
							name="home"
							color={focused ? Colors.active : Colors.notSelected}
						/>
					),
				}}
			/>
			<BottomTab.Screen
				name="LeaderBoard"
				component={LeaderBoard}
				options={{
					tabBarIcon: ({ focused }) => (
						<TabBarIcon
							name="bar-chart-2"
							color={focused ? Colors.active : Colors.notSelected}
						/>
					),
				}}
			/>
		</BottomTab.Navigator>
	);
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
	name: React.ComponentProps<typeof Feather>["name"];
	color: string;
}) {
	return <Feather size={30} style={{ marginBottom: -3 }} {...props} />;
}
