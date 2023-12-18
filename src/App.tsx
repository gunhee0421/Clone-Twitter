import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Layout from "./component/layout.tsx";
import Home from "./routes/home.tsx";
import Profile from "./routes/profile.tsx";
import Login from "./routes/login.tsx";
import CreateAccount from "./routes/create-account.tsx";
import styled, {createGlobalStyle} from "styled-components";
import reset from "styled-reset";
import {useEffect, useState} from "react";
import LoadingScreen from "./component/loading-screen.tsx";
import {auth} from "./firebase.ts";
import ProtectedRoute from "./component/protected-route.tsx";

const router = createBrowserRouter([
    {
        path:"/",
        element: (
            <ProtectedRoute>
                <Layout/>
            </ProtectedRoute>
        ),
        children: [
            {
                path:"",
                element: <Home/>,

            },
            {
                path: "profile",
                element: <Profile/>,
            }
        ]
    },
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/create-account", element:<CreateAccount/>
    }
]);

const GlobalStyles = createGlobalStyle`
  ${reset};
  *{
    box-sizing: border-box;
  }
  body {
    background-color: black;
    color: white;
  }
`;

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
`;
function App() {
    const [isLoading, setIsLoading] = useState(true);
    const init = async()=>{
        await auth.authStateReady();
        setIsLoading(false);
    }
    useEffect(() => {
        init();
    }, []);
    return(
        <Wrapper>
            <GlobalStyles/>
            {isLoading ? <LoadingScreen /> : <RouterProvider router={router}/>}
        </Wrapper>
    )
}

export default App
