import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const RootLayout = () => (
	<>
		<Stack screenOptions={{ headerShown: false }} />
		<StatusBar style="auto" />
	</>
);

export default RootLayout;
