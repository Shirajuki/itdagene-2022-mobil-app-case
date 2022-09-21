import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FC } from "react";
import { Pressable, View } from "react-native";
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
		<View
			style={{
				justifyContent: "flex-start",
				paddingRight: 16,
				paddingLeft: 16,
				width: "100%",
			}}
		>
			<Pressable onPress={handleBack}>
				<Feather name="arrow-left" color="#BE185D" size={30} />
			</Pressable>
		</View>
	);
};

export default Header;
