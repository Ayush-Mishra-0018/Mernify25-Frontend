import {
  Route,
  RouterProvider,
  createRoutesFromElements,
  createBrowserRouter,
} from "react-router-dom";

// Citizen layout
import CitizenLayout from "./citizen/layouts/CitizenLayout.jsx";

// Citizen pages
import HomePage from "./citizen/pages/HomePage.jsx";
import AIChatPage from "./citizen/pages/AIChatPage.jsx";

// for login
import Login from "./login/Login";
import AuthCallback from "./login/AuthCallback";
import ProtectedRoute from "./auth/ProtectedRoute";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
       <Route element={<ProtectedRoute userOnly={true} />}>
          <Route path="/" element={<CitizenLayout />}>
            <Route index element={<HomePage />} />
            <Route path="eco-bot" element={<AIChatPage />} />
          </Route>
        </Route>

       <Route path="/login" element={<Login />} />
       <Route path="/auth/callback" element={<AuthCallback />} />

    </>
    )
  );

  return (
      <RouterProvider router={router} />
  );
};

export default App;
