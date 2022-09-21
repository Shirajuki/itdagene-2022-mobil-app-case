import React, { Dispatch, useState } from "react";

import { StyleSheet, Switch, Text } from "react-native";
import { View } from "react-native";
import { GameContext } from "../../context/GameContext";


import { GameMode } from "../../models/gameStateEnum";



export default function GameModeToggleSwitch() {

    const {gameMode, setGameMode} = React.useContext(GameContext);
    const isLearning = gameMode === GameMode.practice;

    
    // useEffect(()=> {
    //     console.log("oppdaget endring i context", gameMode);
    //     if(gameMode=== GameMode.practice) console.log("practice")
    //     if(gameMode=== GameMode.evaluation) console.log("evaluation")
        
        
    // }, [gameMode, setGameMode]);
    
    const toggleSwitch = () => {isLearning ? setGameMode(GameMode.evaluation) : setGameMode(GameMode.practice)};;

  
    return (
      <View style={styles.container}>
            
        <Text style={styles.text}> Læremodus?</Text>

      
        <Switch
          trackColor={{ false: "#767577", true: "#BE185D" }}
          thumbColor={isLearning ? "#ffffff" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isLearning}
          />
        
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
        flexDirection:"row",
    alignItems: "center",
    justifyContent: "center",
    },

    text: {
        fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginRight: 10,

    }

    
  });
