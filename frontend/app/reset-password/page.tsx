import AuthLayout from "@/components/auth/AuthLayout";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
	return (
		<AuthLayout
			title="Reset Password"
			subtitle="Create a new secure password for your clinic account."
		>
			<ResetPasswordForm />
		</AuthLayout>
	);
}
