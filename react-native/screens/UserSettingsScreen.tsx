import { FC } from "react";
import { Text, View } from "react-native";
import { Wrapper } from "../components/layout/Wrapper";

export const UserSettingsScreen: FC = () => (
    <Wrapper>
        <View style={{height: "100%", width: "100%", justifyContent: "center", alignItems: "center"}}>
            <Text style={{fontSize: 40, fontWeight: "500", textAlign: "center"}}>Side for bruker innstillinger</Text>
        </View>
    </Wrapper>
);
