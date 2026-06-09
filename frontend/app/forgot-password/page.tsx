import AuthLayout from "@/components/auth/AuthLayout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
	return (
		<AuthLayout
			title="Forgot Password"
			subtitle="Enter your email address and a password reset link will be sent to you via email."
		>
			<ForgotPasswordForm />
		</AuthLayout>
	);
}
