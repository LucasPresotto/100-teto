from fastapi import FastAPI , Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import engine
from app.models.db_model import Base
from app.database import get_db
from app.models.db_model import Usuario, Imovel
from app.schemas import UsuarioCadastro
from app.security import gerar_hash
from app.schemas import UsuarioLogin, ImovelCadastro
from app.security import verificar_senha, criar_token_acesso, verificar_token_acesso
from fastapi.security import OAuth2PasswordBearer

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API 100teto",
)

origins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"mensagem": "Bem-vindo a API dos 100teto"}

@app.post("/cadastro")
def cadastrar_usuario(
    dados: UsuarioCadastro, 
    db: Session = Depends(get_db)
    ):
    
    usuario_existente = db.query(Usuario).filter(Usuario.email == dados.email).first()
    
    if usuario_existente:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    usuario : Usuario = Usuario(
        nome=dados.nome,
        email=dados.email,
        senha_hash=gerar_hash(dados.senha),
        telefone=dados.telefone,
        cpf=dados.cpf
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return {
            "Usuario criado com sucesso": {
                "id": usuario.id,
            }
    }

auth_scheme = OAuth2PasswordBearer(tokenUrl="/login")

@app.post("/login")
def login(
    dados: UsuarioLogin,
    db: Session = Depends(get_db)
):
    usuario = db.query(Usuario).filter(Usuario.email == dados.email).first()
    
    if not usuario:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email ou senha incorretos")
    
    if not verificar_senha(dados.senha, usuario.senha_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email ou senha incorretos")
    
    token_acesso = criar_token_acesso({"sub": str(usuario.id), "email": usuario.email})

    return {
        "access_token": token_acesso,
        "token_type": "bearer",
        "usuario": {"id": usuario.id, "nome": usuario.nome}
        }

def usuario_autenticado(token: str = Depends(auth_scheme)):
    payload = verificar_token_acesso(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token de acesso inválido")
    
    return payload

@app.post("/imoveis")
def cadastrar_imovel(
    dados: ImovelCadastro, db: Session = Depends(get_db), usuario: dict = Depends(usuario_autenticado)
):
    id_usuario = usuario.get("sub")

    novo_imovel = Imovel(
        locador_id=id_usuario,
        titulo=dados.titulo,
        descricao=dados.descricao,
        tipo=dados.tipo,
        preco_aluguel=dados.preco_aluguel,
        cep=dados.cep,
        cidade=dados.cidade
    )

    db.add(novo_imovel)
    db.commit()
    db.refresh(novo_imovel)

    return {"mensagem": "Imóvel cadastrado com sucesso", "imovel_id": novo_imovel.id}