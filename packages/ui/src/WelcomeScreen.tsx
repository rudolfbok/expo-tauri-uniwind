import { useState } from "react";
import { Text, View } from "react-native";

import { Button } from "./Button";

export interface WelcomeScreenProps {
	title: string;
}

export const WelcomeScreen = ({ title }: WelcomeScreenProps) => {
	const [count, setCount] = useState(0);

	return (
		<View className="flex-1 items-center justify-center gap-6 bg-background p-6">
			<Text className="text-3xl font-bold text-foreground">{title}</Text>
			<Text className="text-muted-foreground">Expo · Tauri · Uniwind</Text>
			<Button onPress={() => setCount((c) => c + 1)}>Pressed {count}×</Button>
		</View>
	);
};
