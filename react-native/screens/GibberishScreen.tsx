import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import { Paragraph, Title } from "react-native-paper";
import GibberishLetterInput from "../components/gibbershletterinput";
import { Health } from "../components/Health";
import PriceCounter from "../components/pointscounter";
import { Loading } from "../components/status/Loading";
import { CurrentScoreContext } from "../context/currentscore/CurrentScoreContext";
import { GameContext } from "../context/GameContext";
import { GameMode } from "../models/gameStateEnum";
import { RootStackScreenProps } from "../types";
import parseFirstName from "../util/parseFirstName";
import shuffleString from "../util/shuffleString";

let currentNameSize = 10;

export const GibberishScreen = () => {
  const [userInputDict, setUserInputDict] = useState<Map<number, string>>(
    new Map<number, string>()
  );
  const [currentEmployeeIndex, setCurrentEmployeeIndex] = useState<number>(0);
  const [health, setHealth] = useState<number>(3);
  const [shuffledName, setShuffledName] = useState<string>("");
  
  const { gameMode, employees, learningArray } = useContext(GameContext);
  const { currentScore, setCurrentScore } = useContext(CurrentScoreContext);

  const navigation = useNavigation<RootStackScreenProps<"Game">['navigation']>();

  const isPracticeMode = gameMode === GameMode.practice;
  const gameArray = isPracticeMode ? learningArray : employees;
  const currentEmployee = gameArray?.[currentEmployeeIndex];
  const firstName = parseFirstName(currentEmployee?.name).toUpperCase();

  function addToUserInputDict(letterIndex: number, letter: string) {
    setUserInputDict(new Map(userInputDict.set(letterIndex, letter)));
  }

  function checkIfCorrectAnswer(): boolean {{
    let nameInput = ""
    for (let i=0; i<userInputDict.size; i++) { 
      nameInput += userInputDict.get(i)
    }
    return nameInput.trim().toUpperCase() === firstName.trim().toUpperCase()
  }}

  useEffect(() => {
    if (userInputDict.size == firstName.length && firstName.length > 0) {
      if (checkIfCorrectAnswer()) {
        //@ts-ignore
        setCurrentScore((wasScore) => wasScore + 1);
      } else {
        if (health > 1) {
          setHealth((prev) => prev - 1);
        } else if (health === 1) {
          navigation.goBack();
          setHealth(3);
          setCurrentEmployeeIndex(0);
          setUserInputDict(new Map<number, string>());
          setCurrentScore(0);
        }
      }
      setNextEmployee()
      setUserInputDict(new Map<number, string>());
    }
  }, [userInputDict]);

  useEffect(() => {
    setShuffledName(shuffleString(firstName));
    currentNameSize = firstName.length;
  }, [firstName, gameArray]);

  const setNextEmployee = () => {
    if (currentEmployeeIndex < gameArray.length - 1) {
      setCurrentEmployeeIndex(currentEmployeeIndex + 1);
      setUserInputDict(new Map<number, string>());
    } else {
      navigation.goBack();
    }
  };


  if (!currentEmployee) return <Loading />;

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={{height: "50%", width: "100%", justifyContent: "center", alignItems: "center"}}>
        <Title style={{textAlign: "center", fontSize: 36, paddingTop: 10, width: "100%", marginLeft: "auto", marginRight: "auto"}}>Hvem er dette?</Title>
        <Paragraph style={{ width: "75%", textAlign: "center", marginLeft: "auto", marginRight: "auto", fontSize: 12}}>Bak gibberishen finner du navnet til personen på bildet.</Paragraph>
        <Image
          style={styles.image}
          key={currentEmployee.name}
          source={{ uri: currentEmployee.image }}
          resizeMode="cover"
        />
        <Text style={styles.title}>{shuffledName}</Text>
      </View>
      <View style={{height: "50%", width: "100%", justifyContent: "space-between", alignItems: "center", paddingBottom: 20}}>
        <View style={{ flexDirection: "row" }}>
          {firstName.split("").map((letter, index) => {
            return (
              <GibberishLetterInput
                currentNameSize={currentNameSize}
                key={firstName + index}
                letterIndex={index}
                addToUserInputDict={addToUserInputDict}
              />
            );
          })}
        </View>
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 16,
          padding: 10,
          backgroundColor: "#FFD4BE",
          borderRadius: 12,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          width: "100%",
        }}>
          <PriceCounter />
          <Health health={health} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 36,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 12,
  },
  text_lives: {
    fontSize: 20,
    fontWeight: "bold",
    color: "red",
    marginRight: 10,
  },
});
