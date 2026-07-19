import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";
import { getApiUrl } from "../utils/api";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

// Redirect to login if Auth0 not configured, else Auth0 flow
const Home = () => {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If Auth0 fails (not configured), redirect to simple login
    if (error) {
      router.push("/login");
      return;
    }
    if (isLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    // Authenticated via Auth0
    if (user.email === "admin@gmail.com") {
      router.push("/admin/exam");
    } else {
      axios.get(`${getApiUrl()}/students/email/${user.email}`)
        .then((res) => {
          if (res.data === null) {
            axios.post(`${getApiUrl()}/students`, {
              email: user.email, name: user.name, profileURL: user.picture,
            }).then(() => router.push("/student/dashboard"));
          } else {
            router.push("/student/dashboard");
          }
        });
    }
  }, [user, isLoading, error]);

  return (
    <Backdrop open sx={{ color: "#fff", zIndex: 9999 }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
Home.getLayout = (page: any) => page;
export default Home;
