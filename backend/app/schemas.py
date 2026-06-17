from pydantic import BaseModel, EmailStr
from typing import Optional

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
    cep: str
    cidade: str