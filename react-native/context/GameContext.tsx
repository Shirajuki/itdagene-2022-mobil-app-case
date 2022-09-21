import { createContext } from "react";
import { Employee } from "../hooks/useFetchEmployees";
import { GameMode } from "../models/gameStateEnum";

export interface GameContextType {
	gameMode: GameMode;
	setGameMode: (value: GameMode) => void;
	employees: Employee[];
	setEmployees: (employee: Employee[]) => void;
	learningArray: Employee[];
	setLearningArray: (employee: Employee[]) => void;
}

export const GameContext = createContext<GameContextType>({
	gameMode: GameMode.practice,
	setGameMode: () => {},
	employees: [],
	setEmployees: () => {},
	learningArray: [],
	setLearningArray: () => {},
});
