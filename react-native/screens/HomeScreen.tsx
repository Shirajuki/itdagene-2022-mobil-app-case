import React, {useEffect, useRef, useState} from "react";
import { Image, StyleSheet, View } from "react-native";
const msc = require("../assets/music/Lobby-Time.mp3");

import { Wrapper } from "../components/layout/Wrapper";
import { RootTabScreenProps } from "../types";
import {Audio, AVPlaybackStatus} from "expo-av"
import GameCard from "../components/HomeScreen/GameCard";
import GameModeToggleSwitch from "../components/gamemodetoggle";
import {Sound} from "expo-av/build/Audio/Sound";
import {PlaySound} from "../utils/PlaySound";

const wordleImg = require("../assets/images/homescreen/wordle_logo.png");
const bhImg = require("../assets/images/homescreen/behindBox_logo.png");
const gbImg = require("../assets/images/homescreen/gibberish_logo.png");
const logo = require("../assets/images/homescreen/logo.png");

interface SoundInterface {
	sound: Sound;
	status: AVPlaybackStatus;
	playAsync?: () => Promise<AVPlaybackStatus>;
}

export const HomeScreen = ({ navigation }: RootTabScreenProps<"Home">) => {
	const styles = StyleSheet.create({
		container: {
			display: "flex",
			backgroundColor: "#EAE8FB",
			height: "100%",
			width: "100%",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "space-evenly",
		},
		logo: {
			alignItems: "center",
			width: "60%",
		},
		cardContainer: {
			flexDirection: "row",
			justifyContent: "flex-start",
			flexWrap: "wrap",
		},
	});



// music
	useEffect( () => {
		async function playSound() {
			const sound: SoundInterface = await Audio.Sound.createAsync(require("../assets/music/Fluffing-a-Duck.mp3"), {shouldPlay: true})
			if (sound.playAsync !== undefined) {
				await sound.playAsync()
			}
		}
		playSound().then(r => console.log(r))
	}, [])


	return (
		<Wrapper>
			<View style={styles.container}>
				<Image resizeMode="contain" source={logo} style={styles.logo} />
				<View style={styles.cardContainer}>
					<GameCard
						cardTitle="Nordle"
						imageURL={wordleImg}
						description="Lær navnene ved å spille wordle 🥳"
						bgcolor="#FFD4BE"
						onPress={() => navigation.navigate("Game", { gameType: "W" })}
					/>
					<GameCard
						cardTitle="Behind Box"
						imageURL={bhImg}
						description="Hvem gjemmer seg bak boksen? 😱"
						bgcolor="#F9F871"
						onPress={() => navigation.navigate("Game", { gameType: "B" })}
					/>
					<GameCard
						cardTitle="Gibberish"
						imageURL={gbImg}
						description="Ranger bokstavene"
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
