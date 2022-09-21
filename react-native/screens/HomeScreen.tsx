const msc = require("../assets/music/Lobby-Time.mp3");
import React, { useContext, useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import Constants from "expo-constants";
import { Wrapper } from "../components/layout/Wrapper";
import { RootTabScreenProps } from "../types";
import { Audio, AVPlaybackStatus } from "expo-av";
import GameCard from "../components/HomeScreen/GameCard";
import GameModeToggleSwitch from "../components/gamemodetoggle";
import { Sound } from "expo-av/build/Audio/Sound";
import { PlaySound } from "../utils/PlaySound";
import { CurrentScoreContext } from "../context/currentscore/CurrentScoreContext";
import asyncStorageService from "../services/asyncStorageService";
import { GameContext } from "../context/GameContext";

const wordleImg = require("../assets/images/homescreen/wordle_logo2.png");
const bhImg = require("../assets/images/homescreen/behindBox_logo2.png");
const questionImg = require("../assets/images/homescreen/question_logo2.png");
const gbImg = require("../assets/images/homescreen/gibberish_logo2.png");
const logo = require("../assets/images/homescreen/logo.png");

interface SoundInterface {
	sound: Sound;
	status: AVPlaybackStatus;
	playAsync?: () => Promise<AVPlaybackStatus>;
	unloadAsync?: () => Promise<AVPlaybackStatus>;
}

export const HomeScreen = ({ navigation }: RootTabScreenProps<"Home">) => {
	const { setCurrentScore, setLeaderBoardScores } =
		useContext(CurrentScoreContext);
	const [sound, setSound] = useState<any>();

	useEffect(() => {
		const fetchScores = async () => {
			const response = await asyncStorageService("GET");
			setLeaderBoardScores(response ?? []);
		};
		fetchScores();
	}, []);

	// music
	useEffect(() => {
		console.log("Play Sound", setSound);
		console.log(sound);

		async function playSound() {
			const { sound: nsound } = await Audio.Sound.createAsync(
				require("../assets/music/Fluffing-a-Duck.mp3"),
				{ shouldPlay: true, isLooping: true }
			);
			setSound((sound: any) => {
				if (sound) {
					sound.stopAsync();
					sound.unloadAsync();
				}
				return nsound;
			});
			await nsound.playAsync();
		}

		playSound();
		return sound
			? () => {
					console.log("Unloading Sound");
					sound.unloadAsync();
			  }
			: undefined;
	}, [setSound]);

	const handlePress = (gameType: "W" | "B" | "G") => {
		setCurrentScore(0);
		navigation.navigate("Game", { gameType });
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

	return (
		<Wrapper>
			<View style={styles.container}>
				<Image resizeMode="contain" source={logo} style={styles.logo} />
				<View style={styles.cardContainer}>
					<GameCard
						cardTitle="Random"
						imageURL={questionImg}
						description="Tilfeldighet"
						bgcolor="#ffc9c9"
						onPress={() => handlePress("W")}
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
