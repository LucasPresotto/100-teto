from fastapi import FastAPI, Depends, HTTPException, Header, status, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from app.database import engine
from app.models.db_model import Base
from app.models.db_model import Imovel
from app.database import get_db
from app.models.db_model import Usuario, Imovel, Comodidade, FotoImovel, solicitacoes
from app.schemas import UsuarioCadastro
from app.security import gerar_hash
from app.schemas import UsuarioLogin, ImovelCadastro
from app.security import verificar_senha, criar_token_acesso, verificar_token_acesso
from fastapi.security import OAuth2PasswordBearer
from fastapi.staticfiles import StaticFiles
import os
import shutil
import json
from pydantic import BaseModel

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="API 100teto",
)


os.makedirs("uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="uploads"), name="static")

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
    

    return {
        "mensagem": "Login realizado com sucesso!",
        "access_token": str(usuario.id), 
        "usuario": {
            "id": str(usuario.id),
            "nome": usuario.nome
        }
        }

def usuario_autenticado(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token de acesso inválido")
    
    usuario_id = authorization.replace("Bearer ", "").strip()
    
    if not usuario_id:
         raise HTTPException(status_code=401, detail="Token de acesso inválido")
         
    return {"sub": usuario_id}

@app.get("/comodidades")
def listar_comodidades(db: Session = Depends(get_db)):
    comodidades = db.query(Comodidade).all()

    if not comodidades:
        basicas = ["Wi-Fi", "Mobiliado", "Garagem", "Ar Condicionado", "Piscina", "Permite Pets", "Churrasqueira", "Varanda"]
        for nome in basicas:
            db.add(Comodidade(nome=nome))
        db.commit()
        comodidades = db.query(Comodidade).all()
    
    return comodidades

@app.post("/imoveis")
def cadastrar_imovel(
    titulo: str = Form(...),
    tipo: str = Form(...),
    preco_aluguel: float = Form(...),
    area_m2: int = Form(None),
    quartos: int = Form(0),
    banheiros: int = Form(0),
    cep: str = Form(...),
    cidade: str = Form(...),
    descricao: str = Form(None),
    comodidades: str = Form("[]"), 
    fotos: list[UploadFile] = File(default=[]), 
    
    db: Session = Depends(get_db),
    usuario: dict = Depends(usuario_autenticado)
):
    id_usuario = usuario.get("sub")

    try:
        novo_imovel = Imovel(
            locador_id=id_usuario,
            titulo=titulo,
            tipo=tipo,
            preco_aluguel=preco_aluguel,
            area_m2=area_m2,
            quartos=quartos,
            banheiros=banheiros,
            cep=cep,
            cidade=cidade,
            descricao=descricao
        )

        ids_comodidades = json.loads(comodidades)
        if ids_comodidades:
            comodidades_db = db.query(Comodidade).filter(Comodidade.id.in_(ids_comodidades)).all()
            novo_imovel.comodidades = comodidades_db

        db.add(novo_imovel)
        db.commit()
        db.refresh(novo_imovel)

        if fotos and fotos[0].filename:
            for index, foto in enumerate(fotos):
                extensao = foto.filename.split(".")[-1]
                nome_arquivo = f"{novo_imovel.id}_{index}.{extensao}"
                caminho_arquivo = os.path.join("uploads", nome_arquivo)
                
                with open(caminho_arquivo, "wb") as buffer:
                    shutil.copyfileobj(foto.file, buffer)
                
                url_imagem = f"http://localhost:8000/static/{nome_arquivo}"
                nova_foto = FotoImovel(
                    imovel_id=novo_imovel.id, 
                    url_imagem=url_imagem,
                    is_principal=(index == 0) 
                )
                db.add(nova_foto)
            db.commit()

        return {"mensagem": "Imóvel e fotos cadastrados com sucesso!"}
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao salvar: {str(e)}")


@app.get("/imoveis")
def listar_imoveis(db: Session = Depends(get_db)):

    imoveis = db.query(Imovel).options(joinedload(Imovel.fotos)).all()

    return imoveis

@app.get("/imoveis/{imovel_id}")
def obter_imovel(imovel_id: str, db: Session = Depends(get_db)):

    imovel = db.query(Imovel).options(
        joinedload(Imovel.fotos),
        joinedload(Imovel.comodidades)
    ).filter(Imovel.id == imovel_id).first()

    if not imovel:
        raise HTTPException(status_code=404, detail="Imóvel não encontrado")

    return imovel


@app.post("/imoveis/{imovel_id}/solicitar")
def solicitar_imovel(imovel_id: str, db: Session = Depends(get_db), usuario: dict = Depends(usuario_autenticado)):
    print(usuario)
    print(type(usuario))
    imovel = db.query(Imovel).filter(Imovel.id == imovel_id).first()
    solicitacao_existente = db.query(solicitacoes).filter(solicitacoes.imovel_id == imovel_id, solicitacoes.usuario_id == usuario["sub"]).first()
    nova_solicitacao = solicitacoes( usuario_id=usuario["sub"], imovel_id=imovel_id, status = True)
    print("Solicitação existente:", solicitacao_existente)
    if solicitacao_existente:
        raise HTTPException(status_code=400, detail="Você já solicitou este imóvel")
    
    
    if not imovel:
        raise HTTPException(status_code=404, detail="Imóvel não encontrado")

    if imovel.solicitado:
        raise HTTPException(status_code=400, detail="Imóvel já solicitado")

    imovel.solicitado = True    
    db.add(nova_solicitacao)
    db.commit()
    db.refresh(nova_solicitacao)
    db.refresh(imovel)
    return {"mensagem": "Imóvel solicitado com sucesso!"}

class RespostaSolicitacao(BaseModel):
    acao: str

@app.post("/solicitar_imovel/{imovel_id}")
def solicitar_imovel(imovel_id: str, db: Session = Depends(get_db), usuario: dict = Depends(usuario_autenticado)):
    imovel = db.query(Imovel).filter(Imovel.id == imovel_id).first()

    if not imovel:
        raise HTTPException(status_code=404, detail="Imóvel não encontrado")

    if str(imovel.locador_id) == str(usuario["sub"]):
        raise HTTPException(status_code=400, detail="Você não pode alugar o seu próprio imóvel!")
    
    solicitacao_existente = db.query(solicitacoes).filter_by(usuario_id=usuario["sub"], imovel_id=imovel_id, status=True).first()
    
    if solicitacao_existente:
        raise HTTPException(status_code=400, detail="Você já solicitou este imóvel")

    nova_solicitacao = solicitacoes(usuario_id=usuario["sub"], imovel_id=imovel_id, status=True)
    imovel.solicitado = True    
    
    db.add(nova_solicitacao)
    db.commit()
    return {"mensagem": "Imóvel solicitado com sucesso!"}

@app.get("/solicitacoes")
def listar_solicitacoes(db: Session = Depends(get_db), usuario: dict = Depends(usuario_autenticado)):
    solicitacoes_usuario = db.query(solicitacoes).filter(solicitacoes.usuario_id == usuario["sub"]).all()
    resultado = []
    for s in solicitacoes_usuario:
        imovel = db.query(Imovel).filter(Imovel.id == s.imovel_id).first()
        if imovel:
            resultado.append({
                "id": imovel.id,
                "titulo": imovel.titulo,
                "descricao": imovel.descricao,
                "preco_aluguel": imovel.preco_aluguel,
                "cidade": imovel.cidade,
                "fotos": [{"url_imagem": f.url_imagem} for f in imovel.fotos],
                "status_solicitacao": "Pendente" if s.status else "Aceita!"
            })
    return resultado

@app.get("/solicitacoes/recebidas")
def listar_solicitacoes_recebidas(db: Session = Depends(get_db), usuario: dict = Depends(usuario_autenticado)):
    meus_imoveis_ids = [i.id for i in db.query(Imovel.id).filter(Imovel.locador_id == usuario["sub"]).all()]
    
    if not meus_imoveis_ids:
        return []
        
    solicitacoes_recebidas = db.query(solicitacoes).filter(solicitacoes.imovel_id.in_(meus_imoveis_ids)).all()
    
    resultado = []
    for s in solicitacoes_recebidas:
        imovel = db.query(Imovel).filter(Imovel.id == s.imovel_id).first()
        inquilino = db.query(Usuario).filter(Usuario.id == s.usuario_id).first()
        
        if imovel and inquilino:
            resultado.append({
                "imovel_id": imovel.id,
                "imovel_titulo": imovel.titulo,
                "usuario_id": inquilino.id,
                "usuario_nome": inquilino.nome,
                "usuario_email": inquilino.email,
                "usuario_telefone": inquilino.telefone,
                "status": "Pendente" if s.status else "Aceita"
            })
    return resultado

@app.post("/solicitacoes/responder/{imovel_id}/{usuario_id}")
def responder_solicitacao(imovel_id: str, usuario_id: str, resposta: RespostaSolicitacao, db: Session = Depends(get_db), usuario: dict = Depends(usuario_autenticado)):
    imovel = db.query(Imovel).filter(Imovel.id == imovel_id, Imovel.locador_id == usuario["sub"]).first()
    if not imovel:
        raise HTTPException(status_code=403, detail="Acesso negado. Este imóvel não é seu.")

    solicitacao = db.query(solicitacoes).filter_by(imovel_id=imovel_id, usuario_id=usuario_id).first()
    if not solicitacao:
        raise HTTPException(status_code=404, detail="Solicitação não encontrada")

    if resposta.acao == "aceitar":
        solicitacao.status = False 
        db.commit()
        return {"mensagem": "Solicitação Aceita! Entre em contato com o inquilino."}
        
    elif resposta.acao == "rejeitar":
        db.delete(solicitacao) 
        imovel.solicitado = False 
        db.commit()
        return {"mensagem": "Solicitação Rejeitada. O imóvel voltou ao mercado!"}
    
    raise HTTPException(status_code=400, detail="Ação inválida")
    
@app.get("/meusImoveis/{id}")    
def listar_meus_imoveis(id: str, db: Session = Depends(get_db), usuario: dict = Depends(usuario_autenticado)):
    imoveis_usuario = db.query(Imovel).options(joinedload(Imovel.fotos)).filter(Imovel.locador_id == usuario["sub"]).all()
    return imoveis_usuario