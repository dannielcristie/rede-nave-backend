# Rede Nave - Backend

API RESTful desenvolvida para a plataforma de cursos **Rede Nave**, focada em empreendedorismo feminino.

## 🚀 Tecnologias

- **Node.js** & **TypeScript**
- **Express** (Framework Web)
- **Prisma ORM** (Banco de Dados PostgreSQL)
- **JWT** (Autenticação)
- **Bcrypt** (Segurança)

## 🛠️ Configuração e Instalação

### Pré-requisitos
- Node.js (v18+)
- PostgreSQL (Rodando localmente ou via Docker)

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com base no exemplo abaixo:

```env
# Servidor
PORT=3000

# Banco de Dados
DATABASE_URL="postgresql://user:password@localhost:5432/rede_nave_db?schema=public"

# Autenticação (JWT)
JWT_SECRET="sua_chave_secreta_super_segura"

# Seed (Usuário Admin inicial)
ADMIN_NAME="Administradora"
ADMIN_EMAIL="admin@redenave.com"
ADMIN_PASSWORD="senha_segura_admin"
```

### 3. Banco de Dados
Execute as migrações para criar as tabelas:

```bash
npx prisma migrate dev
```

Popule o banco com dados iniciais (Cursos, Módulos, Aulas e usuário Admin):

```bash
npm run prisma:seed
```

### 4. Rodar o Projeto

**Modo Desenvolvimento:**
```bash
npm run dev
```

**Modo Produção:**
```bash
npm run build
npm start
```

### 5. Rodando com Docker (Recomendado)

Subir todo o ambiente (Banco + API) de uma vez:

```bash
docker compose up -d
```
- A API estará disponível em `http://localhost:3000`.
- O Banco PostgreSQL estará na porta `5432`.


## 📚 Documentação da API

### Autenticação (`/api/auth`)
- `POST /register`: Criar nova conta de aluna.
- `POST /login`: Autenticar e receber token JWT.
- `GET /me`: Dados do usuário logado (Requer Token).

### Cursos (`/api/courses`)
- `GET /`: Listar todos os cursos publicados.
- `GET /:slug`: Detalhes de um curso específico.
- `GET /my-courses`: Listar cursos matriculados do usuário logado (Requer Token).

### Aulas (`/api/lessons`)
- `GET /:id`: Obter conteúdo (vídeo) de uma aula (Requer Matrícula Ativa).

## 🗂️ Estrutura do Projeto

```
src/
├── config/         # Configurações (Prisma, Envs)
├── controllers/    # Lógica de controle das requisições
├── middlewares/    # Middlewares (Auth, Validações)
├── routes/         # Definição das rotas da API
├── services/       # Regras de negócio
├── utils/          # Funções utilitárias (Hash, etc)
└── server.ts       # Entrypoint da aplicação
```


