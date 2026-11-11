import { clsx } from "clsx";
import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import type { PressableProps } from "react-native";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends Omit<PressableProps, "children"> {
	children: ReactNode;
	variant?: ButtonVariant;
	loading?: boolean;
	textClassName?: string;
}

const variants: Record<ButtonVariant, { container: string; label: string; spinner: string }> = {
	primary: {
		container: "bg-primary",
		label: "text-primary-foreground",
		spinner: "accent-primary-foreground",
	},
	secondary: {
		container: "bg-secondary",
		label: "text-secondary-foreground",
		spinner: "accent-secondary-foreground",
	},
	ghost: {
		container: "bg-transparent",
		label: "text-primary",
		spinner: "accent-primary",
	},
};

export const Button = ({
	children,
	variant = "primary",
	loading = false,
	disabled,
	className,
	textClassName,
	...props
}: ButtonProps) => {
	const isDisabled = Boolean(disabled || loading);
	const styles = variants[variant];

	return (
		<Pressable
			accessibilityRole="button"
			accessibilityState={{ disabled: isDisabled, busy: loading }}
			disabled={isDisabled}
			className={clsx(
				"min-h-11 flex-row items-center justify-center rounded-ui px-5 active:opacity-80",
				styles.container,
				isDisabled && "opacity-50",
				className,
			)}
			{...props}
		>
			{loading ? (
				<ActivityIndicator colorClassName={styles.spinner} />
			) : (
				<Text className={clsx("text-base font-semibold", styles.label, textClassName)}>
					{children}
				</Text>
			)}
		</Pressable>
	);
};
