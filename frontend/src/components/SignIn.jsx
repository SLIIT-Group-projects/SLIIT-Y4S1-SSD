import { useUser } from "@clerk/clerk-react";

function SigninPage() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      // Store clerkUserId in localStorage when the user accesses their profile
      localStorage.setItem("clerkUserId", user.id);
    }
  }, [user]);

  return <div>{user.firstName} hi you are logged in</div>;
}

export default SigninPage;
