import RegisterForm from "@/components/auth/RegisterForm";
import AuthLayout from "@/components/auth/AuthLayout";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create account"
      subtitle="Create your clinic account and start managing clinic operations."
    >
      <RegisterForm />
    </AuthLayout>
  );
}