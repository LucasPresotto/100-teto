import { useNavigate } from "react-router-dom";
import React from "react";

export default function CardImovel({ imovel }) {
    const navigate = useNavigate();

    const fotoCapa = imovel.fotos && imovel.fotos.length > 0
        ? imovel.fotos[0].url_imagem
        : "https://via.placeholder.com/400x250?text=Sem+Foto";

    return (
        <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
            <img
                src={fotoCapa}
                className="card-img-top"
                alt={imovel.titulo}
                style={{ height: "200px", objectFit: "cover" }}
            />
            <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title fw-bold text-truncate mb-0" style={{ maxWidth: "70%" }}>
                        {imovel.titulo}
                    </h5>
                    <span className="badge bg-primary fs-6">
                        R$ {imovel.preco_aluguel.toFixed(2)}
                    </span>
                </div>

                <p className="text-muted small mb-3">{imovel.cidade} - {imovel.tipo}</p>

                <div className="d-flex gap-3 mb-4 text-muted small">
                    <span>{imovel.quartos} Quartos</span>
                    <span>{imovel.banheiros} Banhos</span>
                    {imovel.area_m2 && <span> {imovel.area_m2}m²</span>}
                </div>

                <button className="btn btn-primary w-100" onClick={() => navigate(`/telaDetalheImovel/${imovel.id}`)}>
                    Ver detalhes
                </button>
            </div>
        </div>
    );
}