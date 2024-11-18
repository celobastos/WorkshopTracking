# Workshop Tracking Dashboard

## Descrição

O **Workshop Tracking Dashboard** é uma aplicação desenvolvida para gerenciar workshops e colaboradores de forma eficiente. Ele utiliza gráficos para fornecer insights visuais, como participação de colaboradores ao longo do tempo e por workshop, permitindo uma melhor compreensão e gestão dos dados.

---

## Funcionalidades

### Frontend
- **Gerenciamento de Workshops**: 
  - Adicionar, visualizar, editar e excluir workshops.
- **Gerenciamento de Colaboradores**: 
  - Visualizar a lista de colaboradores e sua participação em workshops.
- **Análises Visuais**:
  - Gráfico de pizza para visualizar a quantidade de colaboradores por workshop.
  - Gráfico de linha para analisar a participação de colaboradores ao longo do tempo.
- **Layout Responsivo**:
  - Interface adaptada para diferentes tamanhos de tela usando **TailwindCSS**.

### Backend
- **API RESTful**:
  - Implementado em **.NET Core**.
  - Endpoints para gerenciar workshops, colaboradores e atas de presença.
- **Autenticação JWT**:
  - Sistema de login seguro com tokens JWT.
- **Banco de Dados**:
  - Utiliza **MySQL** para armazenamento dos dados.

---

## Tecnologias Utilizadas

### Frontend
- **React.js**
- **React Router**
- **Chart.js**
- **TailwindCSS**

### Backend
- **.NET Core**
- **MySQL**
- **Entity Framework Core**
- **JWT Authentication**

---

## Instalação

### Pré-requisitos
- **Node.js** (v16 ou superior)
- **npm** ou **yarn**
- **.NET SDK** (v6 ou superior)
- **MySQL Server**
- **Editor de Código**: Visual Studio Code ou IDE similar.

### Configuração do Backend

1. **Clone o repositório do Backend**:
   ```bash
   git clone https://github.com/seu-repositorio/workshop-tracking-backend.git
   cd workshop-tracking-backend
   ```

2. **Configuração do Banco de Dados**:
   - Certifique-se de que o MySQL está instalado e rodando.
   - Crie um banco de dados com as credenciais especificadas no arquivo `.env`.

3. **Configuração do `.env`**:
   - Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
     ```
     DB_HOST=localhost
     DB_PORT=3306
     DB_NAME=workshop_tracking
     DB_USER=root
     DB_PASSWORD=sua_senha
     JWT_ISSUER=seu_issuer
     JWT_AUDIENCE=sua_audience
     ```

4. **Executar Migrações**:
   ```bash
   dotnet ef database update
   ```

5. **Iniciar o Servidor**:
   ```bash
   dotnet run
   ```

   O backend estará disponível em `http://localhost:5135`.

---

### Configuração do Frontend

1. **Clone o repositório do Frontend**:
   ```bash
   git clone https://github.com/seu-repositorio/workshop-tracking-frontend.git
   cd workshop-tracking-frontend
   ```

2. **Instale as Dependências**:
   ```bash
   npm install
   ```

3. **Configuração da API**:
   - Navegue até `src/Services/api.js` e configure o `baseURL` com o endereço do backend:
     ```javascript
     const api = axios.create({
       baseURL: "http://localhost:5135/api",
     });
     export default api;
     ```

4. **Iniciar o Frontend**:
   ```bash
   npm start
   ```

   O frontend estará disponível em `http://localhost:3000`.

---

## Endpoints da API

### Autenticação
- **POST /api/account/register**: Registro de usuário.
- **POST /api/account/login**: Geração de token JWT.

### Workshops
- **GET /api/workshops**: Lista todos os workshops.
- **POST /api/workshops**: Adiciona um novo workshop.
- **PUT /api/workshops/{id}**: Atualiza um workshop existente.
- **DELETE /api/workshops/{id}**: Exclui um workshop.

### Atas
- **GET /api/atas**: Lista todas as atas.
- **GET /api/atas/by-workshop/{workshopId}**: Lista atas por workshop.
- **POST /api/atas**: Adiciona uma nova ata.
- **PUT /api/atas/{id}**: Atualiza uma ata existente.
- **DELETE /api/atas/{id}**: Exclui uma ata.

### Colaboradores
- **GET /api/colaboradores**: Lista todos os colaboradores.
- **POST /api/colaboradores**: Adiciona um colaborador.
- **PUT /api/colaboradores/{id}**: Atualiza um colaborador.
- **DELETE /api/colaboradores/{id}**: Exclui um colaborador.

---

## Uso

1. **Login**:
   - Acesse o sistema e faça login com um usuário registrado.
   - Um token JWT será gerado e utilizado para acessar os endpoints protegidos.

2. **Gerenciar Workshops**:
   - Adicione novos workshops e visualize os existentes.
   - Exclua ou atualize workshops conforme necessário.

3. **Gerenciar Colaboradores**:
   - Visualize a lista de colaboradores e associe-os a atas.

4. **Análises**:
   - Veja gráficos no painel de controle para acompanhar a participação nos workshops.

---
