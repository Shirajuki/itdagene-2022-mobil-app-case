import { createContext } from "react";
import { Employee } from "../hooks/useFetchEmployees";
import { GameMode } from "../models/gameStateEnum";
import {Sound} from "expo-av/build/Audio/Sound";

export interface GameContextType {
	gameMode: GameMode;
	setGameMode: (value: GameMode) => void;
	employees: Employee[];
	setEmployees: (employee: Employee[]) => void;
	learningArray: Employee[];
	setLearningArray: (employee: Employee[]) => void;
	sound: any;
	setSound: (sound: Sound) => void;
}

export const GameContext = createContext<GameContextType>({
	setSound: () => {},
	gameMode: GameMode.practice,
	setGameMode: () => {},
	employees: [],
	setEmployees: () => {},
	learningArray: [],
	setLearningArray: () => {},
	sound: {}
});
