import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Navbar from "./components/navbar/Navbar";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import "./style.scss";
import React, { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext, User } from "./context/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const { user } = useContext(AuthContext);

  const { darkMode } = useContext(DarkModeContext);

  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <div className={`theme-${darkMode ? "dark" : "light"}`}>
          <Navbar />
          <div style={{ display: "flex" }}>
            <LeftBar />
            <div style={{ flex: 6 }}>
              <Outlet />
            </div>
            <RightBar />
          </div>
        </div>
      </QueryClientProvider>
    );
  };

  // React.FC<{
  //   user: User | null;
  //   children?: React.ReactNode;
  // }>

  const ProtectedRoute: React.FC<
    React.PropsWithChildren<{ user: User | null }>
  > = ({ user, children }) => {
    const location = useLocation();
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <>{children}</>;
  };

  // * The above method is more readable and easier to understand and is equivalent to the following (second method):

  // interface ProtectedRouteProps {
  //   user: User | null;
  //   component: React.ComponentType;
  // }

  // const ProtectedRoute = ({
  //   user,
  //   component: Component,
  // }: ProtectedRouteProps) => {
  //   if (!user) {
  //     return <Navigate to="/login" />;
  //   }
  //   return <Component />;
  // };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute user={user}>
          <Layout />
        </ProtectedRoute>

        // * This piece of code is used for the second method
        // <ProtectedRoute user={user} component={Layout} />
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
