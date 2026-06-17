import { StrictMode } from "react";
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from "react-router-dom";

import Login from './pages/login.jsx';
import Cadastro from './pages/cadastro.jsx';
import TelaInicial from "./pages/telaInicial.jsx";
<<<<<<< HEAD
import TelaCadastroImovel from "./pages/telaCadastroImovel.jsx";
//import TelaSolicitacoes from "./pages/telaSolicitacoesAluguel.jsx"
=======
import TelaListarImoveis from "./pages/telaListarImoveis.jsx";
//import TelaCadastroImovel from "./pages/telaCadastroImovel.jsx";
import TelaDetalhes from "./pages/telaDetalheImovel.jsx";
>>>>>>> 4304cde (feat: Adicionando telas telaListarImoveis e telaDetalheImovel, criação do componente cardImovel.jsx, para facilitar a vizualização de imoveis cadastrados, e em caso de refatoração, tornar mais fácil. Adicionando também, rotas no backend para listar os imoveis existentes e disponiveis)

const router = createHashRouter([
  { path: "/", element: <Login /> },
  { path: "/cadastro", element: <Cadastro /> },
  { path: "/telaInicial", element: <TelaInicial />},
<<<<<<< HEAD
  { path: "/telaCadastroImovel", element: <TelaCadastroImovel />},
  //{ path: "/telaSolicitacoes", element: <TelaSolicitacoes />}
=======
  { path: "/telaListarImoveis", element: <TelaListarImoveis /> },
 // { path: "/telaCadastroImovel", element: <TelaCadastroImovel />},
  { path: "/telaDetalhes/:id", element: <TelaDetalhes /> },
>>>>>>> 4304cde (feat: Adicionando telas telaListarImoveis e telaDetalheImovel, criação do componente cardImovel.jsx, para facilitar a vizualização de imoveis cadastrados, e em caso de refatoração, tornar mais fácil. Adicionando também, rotas no backend para listar os imoveis existentes e disponiveis)
],
);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
