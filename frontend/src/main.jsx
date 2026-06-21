import { StrictMode } from "react";
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from "react-router-dom";

import Login from './pages/login.jsx';
import Cadastro from './pages/cadastro.jsx';
import TelaInicial from "./pages/telaInicial.jsx";
import TelaListarImoveis from "./pages/telaListarImoveis.jsx";
import TelaCadastroImovel from "./pages/telaCadastroImovel.jsx";
import TelaDetalhes from "./pages/telaDetalheImovel.jsx";
import TelaListarSoli from "./pages/telaListarSolicitacoes.jsx"
import TelaMeusImoveis from "./pages/telaMeusImoveis.jsx"

const router = createHashRouter([
  { path: "/", element: <Login /> },
  { path: "/cadastro", element: <Cadastro /> },
  { path: "/telaInicial", element: <TelaInicial />},
  { path: "/telaListarImoveis", element: <TelaListarImoveis /> },
  { path: "/telaCadastroImovel", element: <TelaCadastroImovel />},
  { path: "/telaDetalhes/:id", element: <TelaDetalhes /> },
  { path: "/telaListarSolicitacoes", element: <TelaListarSoli /> },
  { path: "/telaMeusImoveis", element: <TelaMeusImoveis /> }
],
);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
