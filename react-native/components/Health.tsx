import { Feather } from "@expo/vector-icons";
import { FC } from "react";
import { View } from "react-native";

type HealthProps = {
    health: number;
}

export const Health: FC<HealthProps> = ({health}) => {

    const createHearts = () => {
        let hearts = [];
        for (let i = 0; i < health; i++) {
            hearts.push(<Feather key={i} name="heart" size={24} color="#BE185D" style={{marginLeft: 2.5, marginRight: 2.5}}/>);
        }
        return hearts;
    }
    return (
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            {createHearts()}
        </View>
    );
};