import React, { useContext, useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import Constants from "expo-constants";
import { Wrapper } from "../components/layout/Wrapper";
import { RootTabScreenProps } from "../types";

import GameCard from "../components/HomeScreen/GameCard";
import GameModeToggleSwitch from "../components/gamemodetoggle";
import { CurrentScoreContext } from "../context/currentscore/CurrentScoreContext";
import asyncStorageService from "../services/asyncStorageService";

const wordleImg = require("../assets/images/homescreen/wordle_logo2.png");
const bhImg = require("../assets/images/homescreen/behindBox_logo2.png");
const gbImg = require("../assets/images/homescreen/gibberish_logo2.png");
const logo = require("../assets/images/homescreen/logo.png");

export const HomeScreen = ({ navigation }: RootTabScreenProps<"Home">) => {
	const {setCurrentScore, setLeaderBoardScores} = useContext(CurrentScoreContext);

	useEffect(() => {
		const fetchScores = async () => {
			const response = await asyncStorageService("GET");
			console.log(response===undefined);
			setLeaderBoardScores(response);
		};
		fetchScores();
	}, []);

	const handlePress = (gameType: "W" | "B" | "G") => {
		setCurrentScore(0);
		navigation.navigate("Game", { gameType });
	};
	
	return (
		<Wrapper>
			<View style={styles.container}>
				<Image resizeMode="contain" source={logo} style={styles.logo} />
				<View style={styles.cardContainer}>
					<GameCard
						cardTitle="Random"
						description="Moro med tilfeldighet"
						bgcolor="#ffc9c9"
						onPress={() => handlePress("W")}
						large={true}
					/>
					<GameCard
						cardTitle="Nordle"
						imageURL={wordleImg}
						description="Navn med wordle"
						bgcolor="#FFD4BE"
						onPress={() => handlePress("W")}
					/>
					<GameCard
						cardTitle="Behind Box"
						imageURL={bhImg}
						description="Dekket med bokser"
						bgcolor="#F9F871"
						onPress={() => handlePress("B")}
					/>
					<GameCard
						cardTitle="Gibberish"
						imageURL={gbImg}
						description="Rangerte bokstaver"
						bgcolor="lightblue"
						onPress={() => handlePress("G")}
					/>
				</View>
				<View>
					<GameModeToggleSwitch />
				</View>
			</View>
		</Wrapper>
	);
};

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
