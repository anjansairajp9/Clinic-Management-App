"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type PasswordInputProps = {
	name?: string;
	placeholder?: string;
	value?: string;
	onChange?: (
		e: React.ChangeEvent<HTMLInputElement>
	) => void;
};

export default function PasswordInput({
	name,
	placeholder = "Enter password",
	value,
	onChange,
}: PasswordInputProps) {
	const [showPassword, setShowPassword] =
		useState(false);

	return (
		<div
			style={{
				position: "relative",
			}}
		>
			<input
				name={name}
				type={
					showPassword
						? "text"
						: "password"
				}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				style={{
					width: "100%",
					height: "44px",
					borderRadius: "16px",
					border:
						"1px solid rgba(255,255,255,0.08)",
					background:
						"rgba(255,255,255,0.03)",
					padding:
						"0 48px 0 16px",
					color: "#f0f6ff",
					fontSize: "14px",
					outline: "none",
				}}
			/>

			<button
				type="button"
				onClick={() =>
					setShowPassword(
						!showPassword
					)
				}
				style={{
					position: "absolute",
					right: "16px",
					top: "50%",
					transform:
						"translateY(-50%)",
					display: "flex",
					alignItems: "center",
					justifyContent:
						"center",
					color: "#7a9ab8",
					background:
						"transparent",
					border: "none",
					cursor: "pointer",
				}}
			>
				{showPassword ? (
					<EyeOff size={18} />
				) : (
					<Eye size={18} />
				)}
			</button>
		</div>
	);
}