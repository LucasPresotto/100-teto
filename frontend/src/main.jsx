import { StrictMode } from "react";
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from "react-router-dom";

import Login from './pages/login.jsx';
import Cadastro from './pages/cadastro.jsx';
import TelaInicial from "./pages/telaInicial.jsx";
import TelaCadastroImovel from "./pages/telaCadastroImovel.jsx";
//import TelaSolicitacoes from "./pages/telaSolicitacoesAluguel.jsx"

const router = createHashRouter([
  { path: "/", element: <Login /> },
  { path: "/cadastro", element: <Cadastro /> },
  { path: "/telaInicial", element: <TelaInicial />},
  { path: "/telaCadastroImovel", element: <TelaCadastroImovel />},
  //{ path: "/telaSolicitacoes", element: <TelaSolicitacoes />}
],
);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
