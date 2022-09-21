import React from "react";
import { Image, StyleSheet, View } from "react-native";
import Constants from "expo-constants";
import { Wrapper } from "../components/layout/Wrapper";
import { RootTabScreenProps } from "../types";

import GameCard from "../components/HomeScreen/GameCard";
import GameModeToggleSwitch from "../components/gamemodetoggle";

const wordleImg = require("../assets/images/homescreen/wordle_logo2.png");
const bhImg = require("../assets/images/homescreen/behindBox_logo2.png");
const gbImg = require("../assets/images/homescreen/gibberish_logo2.png");
const logo = require("../assets/images/homescreen/logo.png");

export const HomeScreen = ({ navigation }: RootTabScreenProps<"Home">) => {
	const styles = StyleSheet.create({
		container: {
			display: "flex",
			height: "100%",
			width: "100%",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "space-evenly",
			paddingTop: Constants.statusBarHeight,
		},
		logo: {
			alignItems: "center",
			width: "60%",
		},
		cardContainer: {
			flexDirection: "row",
			justifyContent: "center",
			flexWrap: "wrap",
		},
	});

	return (
		<Wrapper>
			<View style={styles.container}>
				<Image resizeMode="contain" source={logo} style={styles.logo} />
				<View style={styles.cardContainer}>
					<GameCard
						cardTitle="Random"
						description="Moro med tilfeldighet"
						bgcolor="#ffc9c9"
						onPress={() => navigation.navigate("Game", { gameType: "W" })}
						large={true}
					/>
					<GameCard
						cardTitle="Nordle"
						imageURL={wordleImg}
						description="Navn med wordle"
						bgcolor="#FFD4BE"
						onPress={() => navigation.navigate("Game", { gameType: "W" })}
					/>
					<GameCard
						cardTitle="Behind Box"
						imageURL={bhImg}
						description="Dekket med bokser"
						bgcolor="#F9F871"
						onPress={() => navigation.navigate("Game", { gameType: "B" })}
					/>
					<GameCard
						cardTitle="Gibberish"
						imageURL={gbImg}
						description="Rangerte bokstaver"
						bgcolor="lightblue"
						onPress={() => navigation.navigate("Game", { gameType: "G" })}
					/>
				</View>
				<View>
					<GameModeToggleSwitch />
				</View>
			</View>
		</Wrapper>
	);
};
