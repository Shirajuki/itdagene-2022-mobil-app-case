import { useState } from "react";
import { CurrentScoreContext } from "./CurrentScoreContext";



interface currentScoreProviderProps {
    children: React.ReactNode;
}


export default function CurrentScoreProvider({ children }: currentScoreProviderProps) {
    const [currentScore, setCurrentScore] = useState<number>(0);


    const providerValues = ({currentScore: currentScore, setCurrentScore: setCurrentScore});

    return (
        <CurrentScoreContext.Provider value={providerValues}>
            {children}
        </CurrentScoreContext.Provider>
    )
}




