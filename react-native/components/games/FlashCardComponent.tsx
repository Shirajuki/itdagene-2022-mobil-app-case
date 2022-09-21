import { FC, useContext, useEffect, useRef } from "react";
import { Paragraph, Title } from "react-native-paper";
// @ts-ignore
import SwipeCards from "react-native-swipe-cards-deck";
import { GameContext } from "../../context/GameContext";
import { Employee } from "../../hooks/useFetchEmployees";
import { FlashCard } from "../cards/FlashCard";
import { Loading } from "../status/Loading";

type Props = {
    setIsNormalPlay: (isNormalPlay: boolean) => void;
}

export const FlashCardComponent: FC<Props> = ({setIsNormalPlay}) => {
    const {employees, learningArray, setLearningArray} = useContext(GameContext);

    const swipeRef = useRef(null);
    // @ts-ignore
    const forceYup = () => swipeRef.current.swipeYup();
    // @ts-ignore
    const forceNope = () => swipeRef.current.swipeNope();

    useEffect(() => {
        if (learningArray.length === 10) {
            setIsNormalPlay(true);
        }
        console.log(learningArray);
        console.log(learningArray.length);
    }, [learningArray]);

    function handleNope(card: Employee) {
        if (learningArray.length < 10) {
            setLearningArray([...learningArray, card]);
        }
        return true;
    };

    return (
        <>
            <Title style={{textAlign: "center", fontSize: 36, paddingTop: 20, width: "100%", marginLeft: "auto", marginRight: "auto"}}>Lær deg navnene først!</Title>
            <Paragraph style={{width: "75%", textAlign: "center", marginLeft: "auto", marginRight: "auto", fontSize: 12}}>Swipe til venstre om du ikke vet hvem det er, og til høyre om du allerede kjenner personen.</Paragraph>
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
                renderNoMoreCards={() => <Loading />}

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
