import AuthForm from "@/components/auth-form";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/lib/actions/auth-actions";

const SignInPage = async () => {
  const { data: session } = await getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (session?.user) {
    redirect("/");
  }

  return <AuthForm />;
};

export default SignInPage;
