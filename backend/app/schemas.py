from pydantic import BaseModel, EmailStr

class UsuarioLogin(BaseModel):
    email: EmailStr
    senha: str

class UsuarioCadastro(BaseModel):
    nome: str
    telefone: str
    cpf: str
    email: EmailStr
    senha: str
