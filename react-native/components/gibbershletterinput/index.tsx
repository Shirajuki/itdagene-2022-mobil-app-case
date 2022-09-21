import React, { useState } from "react";

import { Dimensions, StyleSheet, TextInput } from "react-native";
import { View } from "react-native";

const IMAGE_WIDTH = Dimensions.get("window").width;
interface LetterInputProp {
  letterIndex: number;
  addToUserInputDict: (index:number, input:string) => void;
  currentNameSize: number;
}
  
export default function GibberishLetterInput({letterIndex, addToUserInputDict, currentNameSize}: LetterInputProp) {
  const [userInput, setUserInput] = useState<string>("");
  
  let factor = currentNameSize? currentNameSize : 10;
  const widthOfBox = (IMAGE_WIDTH - (10 + (factor * 10))) / factor;

  function handleInput(letter: string) {
      setUserInput(letter);
      addToUserInputDict(letterIndex, letter);
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={{ 
          height: 40,
          width: widthOfBox,
          margin: 5,
          borderWidth: 1,
          borderColor: "#BE185D",
          borderRadius: 12,
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          fontWeight: "500",
        }}
        onChangeText={(input:string) => handleInput(input)}
        value={userInput}
        maxLength={1}
        autoFocus={letterIndex === 0}
      />
    </View>
  );
}
  
const styles = StyleSheet.create({
  container: {
    flexDirection:"row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginRight: 10,
  }, 
});
