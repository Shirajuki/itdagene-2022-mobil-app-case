import { SafeAreaView, View } from "react-native"
import { ActivityIndicator } from "react-native-paper"

export const Loading = () => {
    return (
        <View style={{height: "100%", justifyContent: "center", alignItems: "center"}}>
            <ActivityIndicator animating color="black" size="large" />
        </View>
    )
}