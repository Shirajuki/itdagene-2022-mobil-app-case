import * as React from "react";
import { Button, Card, Title, Paragraph } from "react-native-paper";
import {
	Image,
	View,
	StyleSheet,
	ImageSourcePropType,
	Dimensions,
} from "react-native";

interface Card {
	cardTitle: string;
	imageURL?: ImageSourcePropType;
	description: string;
	bgcolor: string;
	onPress: () => void;
	large?: boolean;
}

const IMAGE_WIDTH = Dimensions.get("window").width;
const IMAGE_HEIGHT = IMAGE_WIDTH * 1.3;

const GameCard = ({
	cardTitle,
	imageURL,
	description,
	bgcolor,
	onPress,
	large = false,
}: Card) => {
	const styles = StyleSheet.create({
		container: {
			margin: 8,
		},
		logo: {
			marginTop: 8,
			width: "70%",
			marginBottom: 32,
		},
		logoWrapper: {
			width: 10,
			height: 10,
		},
		card: {
			margin: 12,
			marginLeft: "auto",
			marginRight: "auto",
			width: large
				? Dimensions.get("window").width - 24
				: Dimensions.get("window").width / 2 - 24,
			height: large ? 80 : 180,
			backgroundColor: bgcolor,
			justifyContent: "center",
			borderRadius: 16,
			overflow: "hidden",
		},
		cardWrapper: {
			padding: 4,
			alignItems: "center",
		},
		cardContent: {
			flexDirection: "column",
			alignItems: "center",
		},
		cardTitle: {
			color: "black",
			textAlign: "center",
		},
		img: {
			position: "absolute",
			width: large ? "130%" : "120%",
			height: large ? "340%" : "80%",
			top: large ? 10 : 85,
			opacity: 0.6,
		},
		cardParagraph: {
			color: "black",
			textAlign: "center",
			fontSize: 12,
			marginTop: -5,
		},
	});

	return (
		<Card style={styles.card} onPress={onPress}>
			<View style={styles.cardWrapper}>
				{imageURL && (
					<Image source={imageURL} resizeMode="contain" style={styles.logo} />
				)}
				<Card.Content style={styles.cardContent}>
					<Title>{cardTitle}</Title>
					<Paragraph style={styles.cardParagraph}>{description}</Paragraph>
				</Card.Content>
				<Image
					source={require("../../assets/images/homescreen/curve.png")}
					style={styles.img}
				/>
			</View>
		</Card>
	);
};

export default GameCard;
