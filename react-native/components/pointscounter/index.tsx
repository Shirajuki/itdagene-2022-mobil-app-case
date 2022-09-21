import React, { useContext } from "react";
import { StyleSheet, Text } from "react-native";
import { CurrentScoreContext } from "../../context/currentscore/CurrentScoreContext";

export default function PriceCounter() {
  const {currentScore} = useContext(CurrentScoreContext);

  return (
    <Text style={styles.text}> Poeng: {currentScore}</Text>      
  );
}
  
const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#BE185D",
    marginRight: 8,

  },
});
