from datetime import datetime
import uuid
from typing import List, Optional
from sqlalchemy import ForeignKey, String, Text, Numeric, Integer, Boolean, DateTime, CheckConstraint, Table, Column
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

#classe base de onde todos os modelos herdam
class Base(DeclarativeBase):
    pass

# ----------------------------------------------------------------------
# TABELAS DE ASSOCIAÇÃO (Muitos-para-Muitos / N:N)
# ----------------------------------------------------------------------

#tabela pivot para Imóveis <-> Comodidades
imovel_comodidades = Table(
    "imovel_comodidades",
    Base.metadata,
    Column("imovel_id", ForeignKey("imoveis.id", ondelete="CASCADE"), primary_key=True),
    Column("comodidade_id", ForeignKey("comodidades.id", ondelete="CASCADE"), primary_key=True),
)

#tabela pivot para Favoritos (Usuários <-> Imóveis)
favoritos = Table(
    "favoritos",
    Base.metadata,
    Column("usuario_id", ForeignKey("usuarios.id", ondelete="CASCADE"), primary_key=True),
    Column("imovel_id", ForeignKey("imoveis.id", ondelete="CASCADE"), primary_key=True),
    Column("data_favoritado", DateTime, default=datetime.utcnow),
)

# ----------------------------------------------------------------------
# MODELOS PRINCIPAIS
# ----------------------------------------------------------------------

class Usuario(Base):
    __tablename__ = "usuarios"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    nome: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(150), unique=True, nullable=False, index=True)
    senha_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    telefone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    tipo_perfil: Mapped[str] = mapped_column(String(20), default="locatario")
    perfil_verificado: Mapped[bool] = mapped_column(Boolean, default=False)
    data_criacao: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        CheckConstraint(tipo_perfil.in_(["locador", "locatario", "ambos"]), name="check_tipo_perfil"),
    )

    imoveis_anunciados: Mapped[List["Imovel"]] = relationship(back_populates="locador", cascade="all, delete-orphan")
    imoveis_favoritos: Mapped[List["Imovel"]] = relationship(secondary=favoritos, back_populates="favoritado_por")


class Imovel(Base):
    __tablename__ = "imoveis"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    locador_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False)
    titulo: Mapped[str] = mapped_column(String(100), nullable=False)
    descricao: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    tipo: Mapped[str] = mapped_column(String(50), nullable=False) # casa, apartamento, republica
    preco_aluguel: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    area_m2: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    quartos: Mapped[int] = mapped_column(Integer, default=0)
    banheiros: Mapped[int] = mapped_column(Integer, default=0)
    cep: Mapped[str] = mapped_column(String(10), nullable=False)
    cidade: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(20), default="ativo") # ativo, pausado

    locador: Mapped["Usuario"] = relationship(back_populates="imoveis_anunciados")
    fotos: Mapped[List["FotoImovel"]] = relationship(back_populates="imovel", cascade="all, delete-orphan")
    comodidades: Mapped[List["Comodidade"]] = relationship(secondary=imovel_comodidades, back_populates="imoveis")
    favoritado_por: Mapped[List["Usuario"]] = relationship(secondary=favoritos, back_populates="imoveis_favoritos")


class FotoImovel(Base):
    __tablename__ = "fotos_imovel"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    imovel_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("imoveis.id", ondelete="CASCADE"), nullable=False)
    url_imagem: Mapped[str] = mapped_column(Text, nullable=False)
    is_principal: Mapped[bool] = mapped_column(Boolean, default=False)

    imovel: Mapped["Imovel"] = relationship(back_populates="fotos")


class Comodidade(Base):
    __tablename__ = "comodidades"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nome: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    imoveis: Mapped[List["Imovel"]] = relationship(secondary=imovel_comodidades, back_populates="comodidades")

