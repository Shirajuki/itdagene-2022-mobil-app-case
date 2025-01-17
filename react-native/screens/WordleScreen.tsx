import { useNavigation } from "@react-navigation/native";
import React, {
	Dispatch,
	FC,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";
import {
	SafeAreaView,
	StyleSheet,
	TouchableOpacity,
	Text,
	View,
	Image,
	Dimensions,
} from "react-native";
import { Switch } from "react-native-paper";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	Easing,
	withTiming,
	FadeIn,
} from "react-native-reanimated";
import { Health } from "../components/Health";
import PriceCounter from "../components/pointscounter";
import { Loading } from "../components/status/Loading";
import { CurrentScoreContext } from "../context/currentscore/CurrentScoreContext";
import { GameContext } from "../context/GameContext";
import { Employee } from "../hooks/useFetchEmployees";
import { getStatuses, getStatusesDisplay, CharStatus } from "../lib/statuses";
import { Audio, AVPlaybackStatus } from "expo-av";
import { Sound } from "expo-av/build/Audio/Sound";
import { GameMode } from "../models/gameStateEnum";
import { RootStackScreenProps } from "../types";
import parseFirstName from "../util/parseFirstName";

interface IWordleStats {
	guesses: string[];
	name: string;
	guess: string;
	tries: number;
}
interface IWordleKeyboard {
	guesses: string[];
	name: string;
	onCallback: (value: string) => void;
	setGuess: Dispatch<SetStateAction<string>>;
	guess: string;
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
			<View style={{zIndex: 0}}>
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
}: IWordleKeyboard) => {
	const charStatuses = getStatuses(name, guesses);

	const onClick = (value: string) => {
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

const WordleInner: FC<{ employee: Employee; handleNext: () => void }> = ({
	employee,
	handleNext,
}) => {
	const [guesses, setGuesses] = useState<string[]>([]);
	const [guess, setGuess] = useState<string>("");
	const [isSwitchOn, setIsSwitchOn] = useState(true);
	const [health, setHealth] = useState<number>(3);

	const { currentScore, setCurrentScore } = useContext(CurrentScoreContext);

	const navigation =
		useNavigation<RootStackScreenProps<"Game">["navigation"]>();

	const firstName = parseFirstName(employee.name);

	const fade = useSharedValue(0);
	const animatedStyles = useAnimatedStyle(() => {
		return {
			opacity: fade.value ?? 0,
		};
	});

	const innerStyles = StyleSheet.create({
		// Image
		image: {
			position: "absolute",
			marginTop: 16,
			width: WIDTH * 0.9,
			height: WIDTH * 1.15 * 0.9,
			borderRadius: 12,
			zIndex: 2,
		},
	});

	const onToggleSwitch = () => {
		setIsSwitchOn(!isSwitchOn);
	};

	const guessCallback = (guess: string) => {
		if (guess.length === firstName.length) {
			setGuesses((guesses) => [...guesses, guess]);
			setGuess("");
			if (guess.toLocaleUpperCase() === firstName.toLocaleUpperCase()) {
				setCurrentScore(currentScore + 50);
				setTimeout(() => {
					setGuesses([]);
				}, 500);
				setTimeout(() => {
					handleNext();
					setIsSwitchOn(true);
				}, 1000);
			} else if (guesses.length === tries - 1) {
				setGuesses([]);
				if (health > 1) {
					setHealth((wasHealth) => wasHealth - 1);
				}
				if (health === 1) {
					navigation.goBack();
				}
				handleNext();
				setIsSwitchOn(true);
			}
		} else console.log("error");
	};

	useEffect(() => {
		fade.value = withTiming(isSwitchOn ? 1 : 0, {
			duration: 800,
			easing: Easing.out(Easing.exp),
		});
	}, [isSwitchOn]);

	const tries = 6;

	return (
		<View>
			<View style={styles.game}>
				<Animated.View
					entering={FadeIn}
					style={[innerStyles.image, animatedStyles]}
				>
					<Text>{firstName}</Text>
					<Image source={{ uri: employee.image }} style={innerStyles.image} />
				</Animated.View>
				<WordleDisplay
					guesses={guesses}
					name={firstName}
					guess={guess}
					tries={tries}
				/>
			</View>
			<View style={styles.keyboardWrapper}>
				<View style={styles.switch}>
					<Text style={{ fontWeight: "500" }}>Vis bilde</Text>
					<Switch
						value={isSwitchOn}
						onValueChange={onToggleSwitch}
						trackColor={{ false: "#767577", true: "#BE185D" }}
						thumbColor={isSwitchOn ? "#ffffff" : "#f4f3f4"}
						ios_backgroundColor="#3e3e3e"
					/>
				</View>
				<WordleKeyboard
					guesses={guesses}
					name={firstName}
					onCallback={guessCallback}
					setGuess={setGuess}
					guess={guess}
				/>
				<SafeAreaView
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						backgroundColor: "#FFD4BE",
						borderRadius: 8,
						shadowColor: "#000",
						shadowOffset: {
							width: 0,
							height: 2,
						},
						shadowOpacity: 0.25,
						shadowRadius: 3.84,
						width: "90%",
						minHeight: 30,
					}}
				>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							padding: 12,
							minHeight: 30,
							width: "100%",
						}}
					>
						<PriceCounter />
						<Health health={health} />
					</View>
				</SafeAreaView>
			</View>
		</View>
	);
};

const WordleScreen = () => {
	const navigation =
		useNavigation<RootStackScreenProps<"Game">["navigation"]>();

	let { employees, gameMode, learningArray } = useContext(GameContext);
	const gameArray = gameMode === GameMode.practice ? learningArray : employees;

	const [currentIndex, setCurrentIndex] = useState<number>(0);

	const employee = gameArray[currentIndex];

	const handleNext = () => {
		if (currentIndex < gameArray.length - 1) {
			setCurrentIndex((currentIndex) => currentIndex + 1);
		} else {
			navigation.goBack();
		}
	};

	if (!employee || !employees || !learningArray) return <Loading />;

	return (
		<SafeAreaView style={{flex: 1, paddingBottom: 8}}>
			<WordleInner employee={employee} handleNext={handleNext} />
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	game: {
		justifyContent: "center",
		alignItems: "center",
		height: "50%",
		marginTop: 8,
	},

	// Switch
	switch: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignItems: "center",
		marginBottom: 8,
		width: "40%",
		marginLeft: "auto",
	},

	// Guess
	guessRow: {
		flexDirection: "row",
		justifyContent: "center",
	},

	// Keyboard
	keyboardWrapper: {
		height: "50%",
		justifyContent: "space-around",
		alignItems: "center",
	},
	keyboard: { flexDirection: "column" },
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
