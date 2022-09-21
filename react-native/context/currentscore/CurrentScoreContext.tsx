import { createContext } from "react";
import { GameMode } from "../../models/gameStateEnum";

export interface CurrentScoreContextType {
    currentScore: number;
    setCurrentScore: (value: number) => void;
}


export const CurrentScoreContext = createContext<CurrentScoreContextType>({
    currentScore: 0,
    setCurrentScore: () => { },
})