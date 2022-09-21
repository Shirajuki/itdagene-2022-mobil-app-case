import { useCallback, useEffect, useState } from "react";
import { Employee, useFetchEmployees } from "../hooks/useFetchEmployees";
import { GameMode } from "../models/gameStateEnum";
import { GameContext } from "./GameContext";


interface gameModeProviderProps {
    children: React.ReactNode;
}


export default function GameProvider({ children }: gameModeProviderProps) {
    const [gameMode, setGameMode] = useState<GameMode>(GameMode.practice);
    const [evaluationArray, setEvaluationArray] = useState<Employee[]>([]);
    const [learningArray, setLearningArray] = useState<Employee[]>([]);

    // const {employees} = useFetchEmployees()


    const providerValues = ({
        gameMode: gameMode, 
        setGameMode: setGameMode, 
        employees: evaluationArray, 
        setEmployees: setEvaluationArray,
        learningArray: learningArray, 
        setLearningArray: setLearningArray
    });

    // const updateContext = useCallback(() => {
    //     let employeList = employees?.slice(0,11)
    //     if(learningArray.length===0) {
    //         if (employeList) setLearningArray(employeList);
    //     }
    //     if(evaluationArray.length===0) {
    //         let employeList = employees?.slice(0,11)
    //         if (employeList) setEvaluationArray(employeList);
    //     }
    // }, [learningArray, employees])


    // useEffect(() => {
    //     updateContext();
    // }, [learningArray, evaluationArray])

    return (
        <GameContext.Provider value={providerValues}>
            {children}
        </GameContext.Provider>
    )
}




