import { useUser } from "@clerk/clerk-react";

function SigninPage() {
  const { user } = useUser();

  // Clerk handles user authentication securely
  // The user object is available throughout the app when authenticated

  return <div>{user?.firstName} hi you are logged in</div>;
}

export default SigninPage;
