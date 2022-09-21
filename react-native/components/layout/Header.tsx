import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FC } from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackScreenProps } from "../../types";

type HeaderProps = {
	callback?: () => void;
};
const Header: FC<HeaderProps> = ({ callback }) => {
	const navigation =
		useNavigation<RootStackScreenProps<"Game">["navigation"]>();

	const handleBack = () => {
		if (callback) callback();
		navigation.goBack();
	};

	return (
		<SafeAreaView
			style={{
				flexDirection: "row",
				justifyContent: "flex-start",
				paddingRight: 16,
				paddingLeft: 16,
			}}
		>
			<Pressable onPress={handleBack}>
				<Feather name="arrow-left" color="#BE185D" size={30} />
			</Pressable>
		</SafeAreaView>
	);
};

export default Header;
