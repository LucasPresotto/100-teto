import { StrictMode } from "react";
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from "react-router-dom";

import Login from './pages/login.jsx';
import Cadastro from './pages/cadastro.jsx';

const router = createHashRouter([
  { path: "/", element: <Login /> },
  { path: "/cadastro", element: <Cadastro /> }

],
);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
