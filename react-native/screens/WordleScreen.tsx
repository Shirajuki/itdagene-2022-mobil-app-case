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
import { Loading } from "../components/status/Loading";
import { GameContext } from "../context/GameContext";
import { Employee } from "../hooks/useFetchEmployees";
import { getStatuses, getStatusesDisplay, CharStatus } from "../lib/statuses";
import { GameMode } from "../models/gameStateEnum";
import { RootStackScreenProps } from "../types";
import parseFirstName from "../util/parseFirstName";

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
		<SafeAreaView>
			<View>
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

const WordleInner: FC<{employee: Employee, handleNext: () => void}> = ({employee, handleNext}) => {
	const [guesses, setGuesses] = useState<string[]>([]);
	const [guess, setGuess] = useState<string>("");
	const [isSwitchOn, setIsSwitchOn] = useState(true);
	const [wrongGuesses, setWrongGuesses] = useState<number>(0);
	const [score, setScore] = useState<number>(0);

	const navigation = useNavigation<RootStackScreenProps<"Game">['navigation']>();

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
			width: WIDTH,
			height: WIDTH * 1.15,
			borderRadius: 12,
			zIndex: 1,
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
				setScore((score) => score + 1);
				setTimeout(() => {
					setGuesses([]);
				}, 500);
				setTimeout(() => {
					handleNext();
					setIsSwitchOn(true);
				}, 1000);
			} else if (guesses.length === tries - 1) {
				setGuesses([]);
				if (wrongGuesses < 2) {
					setWrongGuesses((wrongGuesses) => wrongGuesses + 1);
				} 
				if (wrongGuesses === 2) {
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
			/>
		</View>
		<View style={styles.keyboardWrapper}>
			<View style={{flexDirection: "row", justifyContent: "center", marginBottom: 8}}>
				<Text style={{marginRight: 8, fontSize: 20, fontWeight: "500", textAlign: "center", color: "#BE185D"}}>Antall poeng: {score}</Text>
				<Text style={{fontSize: 20, fontWeight: "500", textAlign: "center", color: "red"}}>Antall feil: {wrongGuesses}</Text>
			</View>
			<View style={styles.switch}>
				<Text style={{fontWeight: "500"}}>Vis bilde</Text>
				<Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
			</View>
			<WordleKeyboard
				guesses={guesses}
				name={firstName}
				onCallback={guessCallback}
				setGuess={setGuess}
				guess={guess}
			/>
		</View>
		</>
	);
};

const WordleScreen = () => {
	const navigation = useNavigation<RootStackScreenProps<"Game">['navigation']>();
	
	let { employees, gameMode, learningArray } = useContext(GameContext);
	const gameArray = gameMode === GameMode.practice ? learningArray : employees;

	const[currentIndex, setCurrentIndex] = useState<number>(0);

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
		<View>
			<WordleInner employee={employee} handleNext={handleNext} />
		</View>
	);
};

const styles = StyleSheet.create({
	game: {
		justifyContent: "center",
		alignItems: "center",
		height: "50%",
	},

	// Switch
	switch: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignItems: "center",
		marginBottom: 8,
		width: "40%",
		marginLeft: "auto",
		marginRight: "auto",
	},

	// Guess
	guessRow: {
		flexDirection: "row",
		justifyContent: "center",
	},

	// Keyboard
	keyboardWrapper: {
		height: "50%",
		justifyContent: "center",
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
