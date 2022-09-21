import Constants from "expo-constants";
import React from "react";
import { Text, View, Dimensions, Image, StyleSheet, ScrollView } from "react-native";
import { Title } from "react-native-paper";
import { Wrapper } from "../components/layout/Wrapper";

import { RootTabScreenProps } from "../types";

interface IScoreBox {
	score: number;
	index: number;
}
export const LeaderBoard = ({
	navigation,
}: RootTabScreenProps<"LeaderBoard">) => {
	const ScoreBox = ({ score, index }: IScoreBox) => {
		return (
			<View style={styles.scorebox}>
				<Text>
					{index}. {score} poeng
				</Text>
			</View>
		);
	};

	return (
		<Wrapper>
			<View style={styles.title}>
				<View>
					<Image
						style={styles.image}
						source={{
							uri: "https://cdn.discordapp.com/attachments/443508931453648907/1021905509181313114/unknown.png",
						}}
					/>
				</View>
				<Title>Poengtavle</Title>
			</View>

			<ScrollView>
				<View style={styles.wrapper}>
					<ScoreBox score={1} index={1} />
					<ScoreBox score={2} index={2} />
					<ScoreBox score={3} index={3} />
					<ScoreBox score={4} index={4} />
				</View>
			</ScrollView>
		</Wrapper>
	);
};

const styles = StyleSheet.create({
	title: {
		justifyContent: "center",
		alignItems: "center",
		fontSize: 20,
		fontWeight: "bold",
		backgroundColor: "#FFF9E9",
		paddingBottom: 8,
		marginBottom: 12,
		paddingTop: Constants.statusBarHeight,
	},
	wrapper: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	image: {
		top: 0,
		width: Dimensions.get("window").width / 3,
		height: Dimensions.get("window").width / 3,
		marginTop: 24,
		marginBottom: 12,
	},
	scorebox: {
		width: Dimensions.get("window").width * 0.9,
		backgroundColor: "#fff",
		padding: 16,
		margin: 8,
		borderRadius: 8,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.27,
		shadowRadius: 4.65,
		elevation: 6,
	},
});
