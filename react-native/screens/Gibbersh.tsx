import React, { useEffect } from "react";
import { View, StyleSheet, Text, Image, Dimensions, TextInput, KeyboardAvoidingView } from "react-native";
import { Button } from "react-native-paper";
import GibberishLetterInput from "../components/gibbershletterinput";
import PriceCounter from "../components/pointscounter";
import { CurrentScoreContext } from "../context/currentscore/CurrentScoreContext";
import { Employee } from "../hooks/useFetchEmployees";


export type GameProp = {
    employees: Employee[];
}

const IMAGE_WIDTH = Dimensions.get("window").width;
const IMAGE_HEIGHT = IMAGE_WIDTH * 1.3;
let currentNameSize = 10;

function shuffleString(str: string) {
    let a = str.split(""),
        n = a.length;

    for(let i = n - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a.join("");
}



export const GibbershScreen = ({employees}:GameProp) => {
    const [currentEmployee, setCurrentEmployee] = React.useState<Employee>(employees[0]);
    const [currentEmployeeIndex, setCurrentEmployeeIndex] = React.useState<number>(0);
    const [currentEmployeeFirstName, setCurrentEmployeeFirstName] = React.useState<string>(currentEmployee.name.split(' ')[0]);
    const [currentNameShuffle, setCurrentNameShuffle] = React.useState<string>(currentEmployee.name.split(' ')[0]);


    const {currentScore, setCurrentScore} = React.useContext(CurrentScoreContext);


    const [userInputDict, setUserInputDict] = React.useState<Map<number, string>>(new Map<number, string>())






function addToUserInputDict(letterIndex: number, letter: string) {
  setUserInputDict(new Map(userInputDict.set(letterIndex, letter)));
}


function checkIfCorrectAnswer():boolean {  {
return Array.from(userInputDict.values()).some((value:string, key:number) => value.toUpperCase() === currentEmployeeFirstName[key].toUpperCase());
}


}

useEffect(() => {
  console.log("tirgger");
  if(userInputDict.size == currentEmployeeFirstName.length) {
    let correct = checkIfCorrectAnswer()
    console.log("correct", correct, currentEmployeeFirstName, userInputDict.values());
    if(correct) {
      setCurrentScore(currentScore + 1);
      
    }
    setNextEmployee();
    setUserInputDict(new Map<number, string>());

  }
},[userInputDict])
    

    useEffect(() => {
        setCurrentNameShuffle(shuffleString(currentEmployeeFirstName))
        currentNameSize = currentEmployeeFirstName.length;
    
    }, [currentEmployeeFirstName])

useEffect(() => {
    setCurrentEmployeeFirstName(currentEmployee.name.split(' ')[0].toUpperCase())

}, [currentEmployee])

    const setNextEmployee = () => {
        if(currentEmployeeIndex < employees.length-1){
        setCurrentEmployeeIndex(currentEmployeeIndex + 1)
        setCurrentEmployee(employees[currentEmployeeIndex + 1])
        setCurrentEmployeeFirstName(currentEmployee.name.split(' ')[0].toUpperCase())
        // setUserInput("");
        setUserInputDict(new Map<number, string>());
  
        }
    }


    const exit = () => { 

        setCurrentEmployeeIndex(0)
        setCurrentEmployee(employees[0])
        setCurrentScore(0)

    }





    return (
      <KeyboardAvoidingView style={styles.container}>
        <PriceCounter/>



        {currentEmployeeIndex === employees.length -1 
        ? 
        <>
           <Image
          style={styles.image}
          key={currentEmployee.name}
          source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Done.png/640px-Done.png" }}
          resizeMode="cover"
          />
        <Text style={styles.title}>"Spillet er ferdig"</Text>
        <Button onPress={exit}>Avslutt</Button>
        </>

        :
        <>
    <Image
          style={styles.image}
          key={currentEmployee.name}
          source={{ uri: currentEmployee.image }}
          resizeMode="cover"
          />

        <Text style={styles.title}>{currentNameShuffle}</Text>
        </>
    
  }

        <View style={{flexDirection:"row"}}>
          {currentEmployeeFirstName.split("").map((letter, index) => {
            return <GibberishLetterInput currentNameSize={currentNameSize} key= {currentEmployeeFirstName +index} letterIndex={index}  addToUserInputDict={addToUserInputDict}  />
          }
          )}
        </View>

    <Button onPress={exit}>Restart</Button>
        
      </KeyboardAvoidingView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginTop: 35,
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
      },


      }
  );
  