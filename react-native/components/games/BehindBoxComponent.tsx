import { Dimensions, Image, KeyboardAvoidingView, Pressable, Text, View } from "react-native";
import { Employee } from "../../hooks/useFetchEmployees";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { Paragraph, TextInput, Title } from "react-native-paper";
import parseFirstName from "../../util/parseFirstName";
import pointCalculate from "../../util/pointCalculate";
import { Loading } from "../status/Loading";

type Props = {
    employee: Employee;
    handleNext: () => void;
}

type BoxProps = {
    show: boolean;
}

const initialState: BoxProps[] = [
    {
        show: true
    },
    {
        show: true
    },
    {
        show: true
    },
    {
        show: true
    },
    {
        show: true
    },
    {
        show: true
    },
    {
        show: true
    },
    {
        show: true
    },
    {
        show: true
    },
    {
        show: true
    },
];

const BehindBoxComponent = ({ employee, handleNext }: Props) => {
    const {width, height} = Dimensions.get("window");
    const [displayBox, setDisplayBox] = useState<BoxProps[]>(initialState);
    const [textInput, setTextInput] = useState<string>("");
    const [isCorrect, setIsCorrect] = useState<boolean>(false);
    const [counter, setCounter] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    
    useEffect(() => {
        let counterTimer = setTimeout(() => {
            setCounter((prev) => prev + 1);
        }, 1000);
        if (counter % 10 === 0) {
            handleRemove();
        }

        // cleanup function
        return () => {
            clearTimeout(counterTimer);
        }
    }, [counter]);

    const employeeName = parseFirstName(employee?.name);

    const imageHeight = height / 2;
    const imageWidth = 0.9 * width;

    const boxHeight = imageHeight / 3;
    const boxWidth = imageWidth / 3;

    const handleNextPlayer = () => {
        const newDisplayBox = _.cloneDeep(displayBox);
        newDisplayBox.forEach((box) => box.show = true);
        setDisplayBox(newDisplayBox);
        handleNext();
    }

    const handleRemove = () => {
        let randomNumber = _.random(0, 8);
        while (!displayBox[randomNumber].show) {
            randomNumber = _.random(0, 8);
        }
        setDisplayBox((prev) => {
            prev[randomNumber].show = false;
            return [...prev];
        });
    };
    
    const handleChange = (text: string) => {
        setTextInput(text);
        if (text === employeeName) {
            setScore((prev) => prev += pointCalculate(counter));
            setIsCorrect(true);
            setTextInput("");
            setTimeout(() => {
                setCounter(0);
                handleNextPlayer();
            }, 1000);
        } else {
            setIsCorrect(false);
        }
    }

    const shouldDisplay = (index: number) => !displayBox[index].show ? 0 : 1;

    if (employee !== undefined) { 
        return (
            <KeyboardAvoidingView style={{alignItems: "center"}}>
                <Title style={{textAlign: "center", fontSize: 36, paddingTop: 10, width: "100%", marginLeft: "auto", marginRight: "auto"}}>Hvem er bak boksen?</Title>
                <Paragraph style={{ width: "75%", textAlign: "center", marginLeft: "auto", marginRight: "auto", fontSize: 12}}>En luke fjerner seg hvert 10. sekund. Jo raskere du finner navnet, jo fler poeng!</Paragraph>
                <Text>{employee.name}</Text>
                <View style={{height: "50%", marginTop: 8}}>
                    <Image source={{ uri: employee?.image }} style={{width: imageWidth, height: imageHeight, zIndex: 1, borderRadius: 12}} />
                    <View style={{position: "absolute", zIndex: 2, flexWrap: "wrap", height: imageHeight}}>
                        <View style={{width: boxWidth, height: boxHeight, backgroundColor: "#FFD4BE", zIndex: 2, borderTopStartRadius: 12, opacity: shouldDisplay(0)}} />
                        <View style={{width: boxWidth, height: boxHeight, backgroundColor: "#FFD6EB", zIndex: 2, opacity: shouldDisplay(1)}}/>
                        <View style={{width: boxWidth, height: boxHeight, backgroundColor: "#FFD4BE", zIndex: 2, borderBottomStartRadius: 12, opacity: shouldDisplay(2)}} />
                        <View style={{width: boxWidth, height: boxHeight, backgroundColor: "#FFD6EB", zIndex: 2, opacity: shouldDisplay(3)}} />
                        <View style={{width: boxWidth, height: boxHeight, backgroundColor: "#FFD4BE", zIndex: 2, opacity: shouldDisplay(4)}} />
                        <View style={{width: boxWidth, height: boxHeight, backgroundColor: "#FFD6EB", zIndex: 2, opacity: shouldDisplay(5)}} />
                        <View style={{width: boxWidth, height: boxHeight, backgroundColor: "#FFD4BE", zIndex: 2, borderTopEndRadius: 12, opacity: shouldDisplay(6)}} />
                        <View style={{width: boxWidth, height: boxHeight, backgroundColor: "#FFD6EB", zIndex: 2, opacity: shouldDisplay(7)}} />
                        <View style={{width: boxWidth, height: boxHeight, backgroundColor: "#FFD4BE", zIndex: 2, borderBottomEndRadius: 12, opacity: shouldDisplay(8)}} />
                    </View>
                </View>
                <KeyboardAvoidingView style={{height: "50%"}}>
                    <TextInput label="Svar" value={textInput} onChangeText={(text) => handleChange(text)} style={{minWidth: "80%", maxHeight: 60, backgroundColor: '#fff'}} autoFocus/>
                    <Paragraph style={{color: isCorrect ? "green": "#fff"}}>{isCorrect ? "Riktig svar!" : ""}</Paragraph>
                    <Text style={{fontSize: 20, fontWeight: "500", textAlign: "center", color: "#BE185D"}}>Antall poeng: {score}</Text>
                </KeyboardAvoidingView>
            </KeyboardAvoidingView>
        );
    } else {
        return <Loading />;
    }
};

export default BehindBoxComponent;