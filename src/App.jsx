import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider
} from "react-router-dom";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Registration from "./pages/authentication/registration/Registration"
import Login from "./pages/authentication/login/Login";
import RootLayout from "./components/layout/RootLayout";
import Home from "./pages/home/Home"
import Message from "./pages/message/Message";
import Notification from "./pages/notification/Notification";
import Settings from "./pages/settings/Settings";
import ForgetPassword from "./pages/authentication/forgetPassword/ForgetPassword";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/registration" element={<Registration />} />
        <Route path="/" element={<Login />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
            <Route element={<RootLayout/>} >

                <Route path="/home" element={<Home/>} />
                <Route path="/message" element={<Message />} />
                <Route path="/notification" element={<Notification />} />
                <Route path="/settings" element={<Settings />} />

            </Route> 
          
      </Route>
    ))

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  )
}

export default App
