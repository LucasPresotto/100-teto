import { useNavigate } from "react-router-dom";

export default function CardImovel({ imovel }) {
    const navigate = useNavigate();
    return (
        <div className="card shadow-sm h-100">
            <img
                src={imovel.imagem}
                className="card-img-top"
                alt={imovel.titulo}
                style={{
                    height: "220px",
                    objectFit: "cover"
                }}
            />

            <div className="card-body">
                <h5 className="card-title">
                    {imovel.titulo}
                </h5>

                <p className="card-text text-muted">
                    {imovel.cidade}
                </p>

                <p>
                     {imovel.quartos} quartos
                </p>

                <h4>
                    R$ {Number(imovel.preco_aluguel).toLocaleString("pt-BR")}
                </h4>

                <button className="btn btn-primary w-100" onClick={navigate.bind(null, `/telaDetalhes/${imovel.id}`)}>
                    Ver detalhes
                </button>
            </div>
        </div>
    );
}