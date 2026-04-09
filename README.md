# SCCON App

Aplicação front-end desenvolvida como teste técnico para a SCCON.
Permite buscar endereços por CEP via [ViaCEP](https://viacep.com.br) e gerenciar uma lista de endereços consultados, com persistência em um servidor local (JSON Server).

## Observações:

Apesar das novas versões do angular ter mudado sua estrutura abandonando os modules, resolvi utilizar os modules para exibir uma modularização como requisitada no arquivo de teste técnico.

---

## Requisitos

- [Node.js](https://nodejs.org) >= 18
- npm >= 10

---

## Instalação

```bash
# Clone o repositório
git clone https://github.com/lfontesc/teste-sccon.git
cd sccon-app

# Instale as dependências
npm install
```

---

## Executando em desenvolvimento

A aplicação precisa de dois servidores rodando simultaneamente: o Angular CLI e o JSON Server.

**Terminal 1 — Front-end Angular:**

```bash
npm start
```

Acesse em: `http://localhost:4200`

**Terminal 2 — JSON Server (API de persistência):**

```bash
npm run json-server
```

API disponível em: `http://localhost:3000/enderecos`

> Os endereços buscados ficam salvos no arquivo `db.json` na raiz do projeto. Você pode inspecioná-lo ou limpá-lo diretamente.

---

## Estrutura do projeto

```
src/
├── app/
│   ├── core/
│   │   └── services/
│   │       ├── cep.service.ts          # Integração com ViaCEP
│   │       ├── cep-storage.service.ts  # Persistência via JSON Server
│   │       └── toast.service.ts        # Wrapper centralizado do Toastr
│   ├── modules/
│   │   ├── main/                       # Layout principal com header e router-outlet
│   │   ├── home/                       # Página inicial
│   │   └── cep/                        # Módulo de busca e listagem de endereços
│   └── shared/
│       └── components/
│           └── header/                 # Header com navegação e logo
├── environments/                       # Configurações por ambiente
└── styles/
    └── _variables.scss                 # Variáveis Sass globais
db.json                                 # Banco de dados do JSON Server
```

---

## Principais recursos implementados

### Busca de CEP

- Integração com a API pública [ViaCEP](https://viacep.com.br) via `HttpClient`
- Máscara de entrada no formato `00000-000` com [ngx-mask](https://github.com/JsDaddy/ngx-mask)
- Validação reativa com `FormControl`, `Validators.required` e validador customizado (`cepValidator`) que bloqueia CEPs com menos de 8 dígitos
- Feedback de erro inline via `mat-error` com mensagens contextuais
- Acionamento por clique ou pressionando `Enter`

### Listagem de endereços

- Tabela com Angular Material (`mat-table`) exibindo CEP, endereço formatado e data da consulta
- Linha "Nenhum endereço buscado" quando a lista está vazia (`*matNoDataRow`)
- Linhas alternadas com cor de fundo diferente
- Hover com transição suave de cor (`transition: background-color 0.2s ease`)
- Ação de exclusão.
- Ação de detalhes — abre modal com todos os campos retornados pela API
- Re-inserção ao topo ao buscar um CEP já existente na lista

### Persistência

- Endereços salvos via **JSON Server** (REST local), substituindo o `localStorage`
- Operações de `POST`, `DELETE` e `GET` encadeadas com RxJS (`switchMap`)
- Lista sempre recarregada do servidor após cada operação para garantir consistência

### Navegação

- Roteamento lazy-loaded com módulos separados (`MainModule`, `HomeModule`, `CepModule`)
- Header com `routerLinkActive` para o link Home e detecção manual de rota ativa (`Router.url`) para o botão com `mat-menu` de Endereços
- Redirecionamento automático de `/` para `/home`

### Notificações

- Toasts com [ngx-toastr](https://github.com/scttcper/ngx-toastr) para sucesso, aviso e erro
- Serviço `ToastService` centralizando todos os calls ao Toastr

### Estilo e UX

- Angular Material com tema customizado
- Arquivo `_variables.scss` centralizado com todas as cores, bordas e transições do projeto
- Layout responsivo com media queries para tablet (≤ 768px) e mobile (≤ 480px)
- HTML semântico: `<header>`, `<main>`, `<nav>`, `<article>`, `<section>`, `<time>`, `<dl>/<dt>/<dd>`
- Atributos de acessibilidade: `role`, `aria-label`, `aria-labelledby`, `aria-haspopup`, `scope`, `data-*`
- Logo SVG da SCCON no header

---

## Possíveis melhorias futuras

- **Paginação na listagem** — adicionar `mat-paginator` na tabela de endereços para lidar com listas longas
- **Loading no botão de busca** — exibir um spinner enquanto a requisição ao ViaCEP estiver em andamento, desabilitando o botão para evitar cliques duplos
- **Ordenação e filtro na tabela** — integrar `MatSort` e um campo de filtro por CEP ou endereço
- **Autenticação** — proteger as rotas com guards e um fluxo simples de login
- **Testes unitários** — cobrir os serviços (`CepService`, `CepStorageService`) e os componentes principais com Vitest
- **Deploy do back-end** — substituir o JSON Server por uma API real (ex.: NestJS + banco de dados) e configurar o `environment.prod.ts` apontando para ela
- **PWA** — adicionar suporte offline com Service Worker para cachear as últimas buscas sem conexão

---

## Autor

**Lucas Fontes Cartaxo**
[linkedin.com/in/lucasfcartaxo](https://www.linkedin.com/in/lucasfcartaxo/)
