import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { View } from "react-native";
import BehindBoxComponent from "../components/games/BehindBoxComponent";
import { GameContext } from "../context/GameContext";
import { GameMode } from "../models/gameStateEnum";
import { RootStackScreenProps } from "../types";

const BehindBoxScreen = () => {
    const {employees, learningArray, gameMode} = useContext(GameContext);

    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const isEvaluation = gameMode === GameMode.evaluation;

    const gameArray = isEvaluation ? employees : learningArray;

    const navigation = useNavigation<RootStackScreenProps<"Game">['navigation']>();

    const handleNext = () => {
		if (currentIndex < gameArray.length - 1) {
			setCurrentIndex((currentIndex) => currentIndex + 1);
		} else {
			navigation.goBack();
		}
	};
    
    return (
        <View>
            <BehindBoxComponent 
                employee={gameArray[currentIndex]} 
                handleNext={handleNext}
            />
        </View>
    )
};

export default BehindBoxScreen;