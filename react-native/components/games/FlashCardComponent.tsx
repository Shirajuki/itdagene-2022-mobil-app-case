import { FC, useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { Paragraph, Title } from "react-native-paper";
// @ts-ignore
import SwipeCards from "react-native-swipe-cards-deck";
import { Employee } from "../../hooks/useFetchEmployees";
import { FlashCard } from "../cards/FlashCard";
import {Sound} from "expo-av/build/Audio/Sound";
import {Audio, AVPlaybackStatus} from "expo-av";

type Props = {
    employees: Employee[];
    setIsNormalPlay: (isNormalPlay: boolean) => void;
}
interface SoundInterface {
    sound: Sound;
    status: AVPlaybackStatus;
    playAsync?: () => Promise<AVPlaybackStatus>;
}
export const FlashCardComponent: FC<Props> = ({employees, setIsNormalPlay}) => {
    const [array, setArray] = useState<Employee[]>([]);

    const swipeRef = useRef(null);
    // @ts-ignore
    const forceYup = () => swipeRef.current.swipeYup();
    // @ts-ignore
    const forceNope = () => swipeRef.current.swipeNope();

    useEffect(() => {
        if (array.length === 10) {
            setIsNormalPlay(true);
        }
    }, [array]);

    function handleNope(card: Employee) {
        setArray([...array, card]);
        return true;
    };

    useEffect( () => {
        async function playSound() {
            const sound: SoundInterface = await Audio.Sound.createAsync(require("../../assets/music/Monkeys-Spinning-Monkeys.mp3"), {shouldPlay: true})
            if (sound.playAsync !== undefined) {
                await sound.playAsync()
            }
        }
        playSound().then(r => console.log(r))
    }, [])

    return (
        <>
            <Title style={{textAlign: "center", fontSize: 36, padding: 20, top: 100, width: "100%", marginLeft: "auto", marginRight: "auto"}}>Lær deg navnene først!</Title>
            <Paragraph style={{top: 75, width: "75%", textAlign: "center", marginLeft: "auto", marginRight: "auto", fontSize: 12}}>Swipe til venstre om du ikke vet hvem det er, og til høyre om du allerede kjenner personen.</Paragraph>
            <SwipeCards 
                cards={employees} 
                renderCard={(cardData: Employee) => 
                <FlashCard 
                    employee={cardData} 
                    forceNope={forceNope} 
                    forceYup={forceYup} 
                    handleNope={handleNope}
                />
                } 
                keyExtractor={(cardData: Employee) => cardData.name}
                renderNoMoreCards={() => console.log("no more cards")}

                stack
                stackDepth={3}
                ref={swipeRef}
                dragY={false}
                actions={{
                    yup: {
                        text: "Kjenner personen",
                        containerStyle: {
                            margin: 16,
                        },
                    },
                    nope: {
                        text: "Kjenner ikke personen",
                        containerStyle: {
                            margin: 16,
                        },
                        onAction: handleNope,
                    }
                }}
            />
        </>
    );
};
