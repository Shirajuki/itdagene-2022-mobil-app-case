import React, {
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";
import {
	SafeAreaView,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	Text,
	View,
	Image,
	Dimensions,
} from "react-native";
import { Button, Card, Paragraph, Switch, Title } from "react-native-paper";
import { Wrapper } from "../components/layout/Wrapper";
import Constants from "expo-constants";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	Easing,
	withTiming,
	FadeIn,
} from "react-native-reanimated";
import { GameContext } from "../context/GameContext";
import { Employee } from "../hooks/useFetchEmployees";
import { getStatuses, getStatusesDisplay, CharStatus } from "../lib/statuses";

const testData: Employee[] = [
	{
		name: "Robin Aleksander Finstad",
		gender: "male",
		originalUrl:
			"https://itvemployeeimages.blob.core.windows.net/employees/Robin Aleksander Finstad.png?sp=r&st=2022-08-15T07:28:13Z&se=2023-01-01T16:28:13Z&spr=https&sv=2021-06-08&sr=c&sig=WShi5DW8MNleTPN0H5bs9vlhbzyabJgG45h0%2FLeNHvM%3D",
		image:
			"https://itvemployeeimages.blob.core.windows.net/employees/Robin Aleksander Finstad.png?sp=r&st=2022-08-15T07:28:13Z&se=2023-01-01T16:28:13Z&spr=https&sv=2021-06-08&sr=c&sig=WShi5DW8MNleTPN0H5bs9vlhbzyabJgG45h0%2FLeNHvM%3D",
	},
	{
		name: "Praveen Kirubaharan",
		gender: "male",
		originalUrl:
			"https://itvemployeeimages.blob.core.windows.net/employees/Praveen Kirubaharan.png?sp=r&st=2022-08-15T07:28:13Z&se=2023-01-01T16:28:13Z&spr=https&sv=2021-06-08&sr=c&sig=WShi5DW8MNleTPN0H5bs9vlhbzyabJgG45h0%2FLeNHvM%3D",
		image:
			"https://itvemployeeimages.blob.core.windows.net/employees/Praveen Kirubaharan.png?sp=r&st=2022-08-15T07:28:13Z&se=2023-01-01T16:28:13Z&spr=https&sv=2021-06-08&sr=c&sig=WShi5DW8MNleTPN0H5bs9vlhbzyabJgG45h0%2FLeNHvM%3D",
	},
];

interface IWordleStats {
	guesses: string[];
	name: string;
	guess: string;
	tries: number;
	gameOver: boolean;
}
interface IWordleKeyboard {
	guesses: string[];
	name: string;
	onCallback: (value: string) => void;
	setGuess: Dispatch<SetStateAction<string>>;
	guess: string;
	gameOver: boolean;
}
interface IWordleKey {
	value: string;
	onClick: (value: string) => void;
	status?: CharStatus;
}
interface IWordleChar {
	value: string;
	nameLength: number;
	status?: CharStatus;
}

const WIDTH = Math.min(Dimensions.get("window").width - 24, 380);

const WordleChar = ({ value, nameLength, status = "none" }: IWordleChar) => {
	let bgcolor = "rgba(0,0,0,0.1)";
	let color = "#000";
	if (status === "present") bgcolor = "#e4ce6b";
	else if (status === "absent") bgcolor = "#8a9295";
	else if (status === "correct") bgcolor = "#7cbe76";
	if (["present", "absent", "correct"].includes(status)) color = "#fff";

	const innerStyles = StyleSheet.create({
		guessSquare: {
			backgroundColor: bgcolor,
			borderColor: color !== "#fff" ? "#ccc" : "#777",
			borderWidth: 2,
			width: Math.min(270 / nameLength, 55),
			height: Math.min(270 / nameLength, 55),
			alignItems: "center",
			justifyContent: "center",
			margin: 5,
		},
		guessLetter: {
			fontSize: 20,
			fontWeight: "bold",
			color: color,
		},
	});

	return (
		<View style={innerStyles.guessSquare}>
			<Text style={innerStyles.guessLetter}>{value}</Text>
		</View>
	);
};

const WordleDisplay = ({ guesses, name, guess, tries }: IWordleStats) => {
	const charStatuses = getStatusesDisplay(name, guesses);

	return (
		<SafeAreaView>
			<View style={styles.display}>
				{new Array(tries).fill(0).map((_, i) => {
					return (
						<View key={i} style={styles.guessRow}>
							{name.split("").map((_, j) => {
								const char = guesses[i]?.substring(j, j + 1);
								if (!char && guesses.length === i) {
									return (
										<WordleChar
											key={j}
											value={guess[j] ?? ""}
											nameLength={name.length}
										/>
									);
								} else if (guesses.length > i && char) {
									return (
										<WordleChar
											key={j}
											value={char}
											nameLength={name.length}
											status={charStatuses[i][j]}
										/>
									);
								} else
									return (
										<WordleChar key={j} value="" nameLength={name.length} />
									);
							})}
						</View>
					);
				})}
			</View>
		</SafeAreaView>
	);
};

const WordleKey = ({ value, onClick, status = "none" }: IWordleKey) => {
	let bgcolor = "rgba(255,255,255,1)";
	let color = "#000";
	if (status === "present") bgcolor = "#e4ce6b";
	else if (status === "absent") bgcolor = "#8a9295";
	else if (status === "correct") bgcolor = "#7cbe76";
	if (["present", "absent", "correct"].includes(status)) color = "#fff";

	const innerStyles = StyleSheet.create({
		key: {
			backgroundColor: bgcolor,
			padding: 8,
			margin: 2,
			borderRadius: 5,
		},
		keyLetter: {
			color: color,
			fontWeight: "500",
			fontSize: 15,
		},
	});
	return (
		<TouchableOpacity onPress={() => onClick(value)}>
			<View style={innerStyles.key}>
				<Text style={innerStyles.keyLetter}>{value}</Text>
			</View>
		</TouchableOpacity>
	);
};

const WordleKeyboard = ({
	guesses,
	name,
	onCallback,
	setGuess,
	guess,
	gameOver,
}: IWordleKeyboard) => {
	const charStatuses = getStatuses(name, guesses);

	const onClick = (value: string) => {
		if (gameOver) return;
		if (value === "ENTER") {
			onCallback(guess);
		} else if (value === "DELETE") {
			setGuess((guess) => guess.substring(0, guess.length - 1));
		} else {
			setGuess((guess) => (guess.length < name.length ? guess + value : guess));
		}
	};

	return (
		<View style={styles.keyboard}>
			<View style={styles.keyboardRow}>
				{["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Å"].map((key) => (
					<WordleKey
						value={key}
						key={key}
						onClick={onClick}
						status={charStatuses[key]}
					/>
				))}
			</View>
			<View style={styles.keyboardRow}>
				{["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ø", "Æ"].map((key) => (
					<WordleKey
						value={key}
						key={key}
						onClick={onClick}
						status={charStatuses[key]}
					/>
				))}
			</View>
			<View style={styles.keyboardRow}>
				<WordleKey value="ENTER" onClick={onClick} />
				{["Z", "X", "C", "V", "B", "N", "M"].map((key) => (
					<WordleKey
						value={key}
						key={key}
						onClick={onClick}
						status={charStatuses[key]}
					/>
				))}
				<WordleKey value="DELETE" onClick={onClick} />
			</View>
		</View>
	);
};

const WordleScreen = () => {
	const [guesses, setGuesses] = useState<string[]>([]);
	const [guess, setGuess] = useState<string>("");
	const [gameOver, setGameOver] = useState<boolean>(false);
	const [isSwitchOn, setIsSwitchOn] = useState(true);
	let { employees } = useContext(GameContext);
	const employee = employees[0];

	const fade = useSharedValue(0);
	const animatedStyles = useAnimatedStyle(() => {
		return {
			opacity: fade.value ?? 0,
		};
	});

	useEffect(() => {
		fade.value = withTiming(isSwitchOn ? 1 : 0, {
			duration: 800,
			easing: Easing.out(Easing.exp),
		});
	}, [isSwitchOn]);

	const firstName = employee?.name?.split(" ")[0];
	const tries = 6;

	const onToggleSwitch = () => {
		if (gameOver) return;
		setIsSwitchOn(!isSwitchOn);
	};
	const guessCallback = (guess: string) => {
		if (guess.length === firstName.length) {
			setGuesses((guesses) => [...guesses, guess]);
			setGuess("");
			if (guess.toLocaleUpperCase() === firstName.toLocaleUpperCase()) {
				console.log("WIN");
				setGameOver(true);
				setIsSwitchOn(false);
			} else if (guesses.length === tries - 1) {
				console.log("LOSE");
				setGameOver(true);
				setIsSwitchOn(false);
			}
		} else console.log("error");
	};

	const innerStyles = StyleSheet.create({
		// Image
		image: {
			position: "absolute",
			marginTop: 16,
			width: WIDTH,
			height: WIDTH * 1.15,
			borderRadius: 12,
			zIndex: 1,
		},
	});

	if (!employee)
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text>No employees found!</Text>
			</View>
		);

	return (
		<View>
			{!employee ? (
				<Text>Loading...</Text>
			) : (
				<>
					<View style={styles.game}>
						<Animated.View
							entering={FadeIn}
							style={[innerStyles.image, animatedStyles]}
						>
							<Image
								source={{ uri: employee.image }}
								style={innerStyles.image}
							/>
						</Animated.View>
						<WordleDisplay
							guesses={guesses}
							name={firstName}
							guess={guess}
							tries={tries}
							gameOver={gameOver}
						/>
					</View>
					<View style={styles.switch}>
						<Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
						<Text style={{ marginTop: -4 }}>Show image</Text>
					</View>
					<View style={styles.keyboardWrapper}>
						<WordleKeyboard
							guesses={guesses}
							name={firstName}
							onCallback={guessCallback}
							setGuess={setGuess}
							guess={guess}
							gameOver={gameOver}
						/>
					</View>
				</>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	game: {
		position: "relative",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: Constants.statusBarHeight,
	},

	// Switch
	switch: {
		alignItems: "center",
		marginBottom: 8,
	},

	// Guess
	display: {
		marginTop: 32,
		minHeight: Dimensions.get("window").height - 280,
	},
	guessRow: {
		flexDirection: "row",
		justifyContent: "center",
	},

	// Keyboard
	keyboardWrapper: {
		minHeight: Dimensions.get("window").height / 2,
	},
	keyboard: { flexDirection: "column", marginTop: 10 },
	keyboardRow: {
		flexDirection: "row",
		justifyContent: "center",
		marginBottom: 10,
	},
	key: {
		backgroundColor: "#fff",
		padding: 8,
		margin: 2,
		borderRadius: 5,
	},
	keyLetter: {
		fontWeight: "500",
		fontSize: 15,
	},
});

export default WordleScreen;
