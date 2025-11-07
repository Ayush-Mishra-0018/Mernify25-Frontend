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

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
       <Route path="/" element={<CitizenLayout />}>
         <Route index element={<HomePage />} />
         <Route path="eco-bot" element={<AIChatPage />} />
       </Route>
    </>
    )
  );

  return (
      <RouterProvider router={router} />
  );
};

export default App;
