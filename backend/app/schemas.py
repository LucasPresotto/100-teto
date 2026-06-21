from pydantic import BaseModel, EmailStr
from typing import Optional, List

class UsuarioLogin(BaseModel):
    email: EmailStr
    senha: str

class UsuarioCadastro(BaseModel):
    nome: str
    telefone: str
    cpf: str
    email: EmailStr
    senha: str

class ImovelCadastro(BaseModel):
    titulo: str
    descricao: Optional[str] = None
    tipo: str
    preco_aluguel: float
    area_m2: Optional[int] = None
    quartos: int = 0
    banheiros: int = 0
    cep: str
    cidade: str

comodidades_ids: List[int] = []
fotos: List[str] = []

class SolicitacaoImovel(BaseModel):
    imovel_id: str
    usuario_id: str
    status: bool
    