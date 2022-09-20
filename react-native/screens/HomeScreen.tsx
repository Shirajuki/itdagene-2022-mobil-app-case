import React from "react";
import {Image, StyleSheet, View} from "react-native";

import { Wrapper } from "../components/layout/Wrapper";

import { Text } from "../components/Themed";
import { RootTabScreenProps } from "../types";

import GameCard from "../components/HomeScreen/GameCard";
const wordleImg = require("../assets/images/homescreen/wordle_logo.png");
const bhImg = require("../assets/images/homescreen/behindBox_logo.png");
const logo = require("../assets/images/homescreen/logo.png");

export const HomeScreen = ({ navigation }: RootTabScreenProps<"Home">) => {
    const styles = StyleSheet.create({
        container: {
            display: "flex",
            backgroundColor: "#EAE8FB",
            height: "100%",
            width: "100%",
            flexDirection: "column",

        },
        logo: {
            alignItems: "center",
            marginTop: 16,
            marginBottom: 16
        },
        cardContainer: {
            flexDirection: "row",
            justifyContent: "flex-start",
            flexWrap: "wrap",
        },
    })

    return (
        <Wrapper>
            <View style={styles.container}>
                <View style={styles.logo}>
                    <Image source={logo} style={styles.logo}/>
                </View>
                <View style={styles.cardContainer}>
                    <GameCard cardTitle="Nordle" imageURL={wordleImg} description="Lær navnene ved å spille wordle 🥳" bgcolor="#FFD4BE"/>
                    <GameCard cardTitle="Behind Box" imageURL={bhImg} description="Hvem gjemmer seg bak boksen? 😱" bgcolor="#F9F871" />
                    <GameCard cardTitle="Gibberish" imageURL={bhImg} description="Hvem gjemmer seg bak boksen? 😱" bgcolor="grey" />
                </View>
            </View>
        </Wrapper>
    );
};
