import { createContext } from "react";

export interface CurrentScoreContextType {
    currentScore: number;
    setCurrentScore: (value: number) => void;
    leaderBoardScores: {score: number, game: string}[];
    setLeaderBoardScores: (value: {score: number, game: string}[]) => void;
}


export const CurrentScoreContext = createContext<CurrentScoreContextType>({
    currentScore: 0,
    setCurrentScore: () => {},
    leaderBoardScores: [],
    setLeaderBoardScores: () => {},
})