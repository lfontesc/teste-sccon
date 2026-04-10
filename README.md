# SCCON App

Aplicação front-end desenvolvida como teste técnico para a SCCON.
Permite buscar endereços por CEP via [ViaCEP](https://viacep.com.br) e gerenciar uma lista de endereços consultados, com persistência em um servidor local (JSON Server).

## Observações:

Apesar das novas versões do angular ter mudado sua estrutura abandonando os modules, resolvi utilizar os modules para exibir uma modularização como requisitada no arquivo de teste técnico.

---

## Principais Tecnologias utilizadas

| Ferramenta / Framework | Versão |
|------------------------|--------|
| Angular | 21.2.0 |
| Angular Material | 21.2.6 |
| ngx-toastr | 20.0.5 |
| ngx-mask | 21.0.1 |
| json-server | 1.0.0-beta.15 |
| RxJS | 7.8.x |
| TypeScript | 5.9.x |


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
│   │   ├── interfaces/                     # Interfaces TypeScript (ex.: ViaCepResponse)
│   │   ├── mocks/
│   │   │   └── cep.mock.ts                 # Dados mock compartilhados entre specs
│   │   └── services/
│   │       ├── cep.service.ts              # Integração com ViaCEP
│   │       ├── cep-storage.service.ts      # Persistência via JSON Server
│   │       └── toast.service.ts            # Wrapper centralizado do Toastr
│   ├── modules/
│   │   ├── main/                           # Layout principal com header e router-outlet
│   │   ├── home/                           # Página inicial
│   │   └── cep/                            # Módulo de busca e listagem de endereços
│   │       ├── components/                 # Componentes apresentacionais
│   │       │   ├── cep-search/             # Formulário de busca por CEP
│   │       │   ├── cep-list/               # Tabela de endereços consultados
│   │       │   └── cep-detail-modal/       # Modal com detalhes do endereço
│   │       ├── facades/
│   │       │   └── cep.facade.ts           # Orquestra serviços, estado e notificações
│   │       ├── pages/
│   │       │   └── cep/                    # Container (página) da busca de CEP
│   │       └── states/
│   │           └── cep.state.ts            # Estado de loading do módulo (Signal)
│   └── shared/
│       └── components/
│           └── header/                     # Header com navegação e logo
├── environments/                           # Configurações por ambiente
└── styles/
    └── _variables.scss                     # Variáveis Sass globais
db.json                                     # Banco de dados do JSON Server
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

### UI/UX

- Angular Material com tema customizado
- Arquivo `_variables.scss` centralizado com todas as cores, bordas e transições do projeto
- Layout responsivo com media queries para tablet (≤ 768px) e mobile (≤ 480px)
- HTML semântico: `<header>`, `<main>`, `<nav>`, `<article>`, `<section>`, `<time>`, `<dl>/<dt>/<dd>`
- Atributos de acessibilidade: `role`, `aria-label`, `aria-labelledby`, `aria-haspopup`, `scope`, `data-*`
- Logo SVG da SCCON no header

---

## Decisões técnicas

### 1 - Ferramentas Frontend

Para frontend, seguindo os requisitos do teste, escolhi o framework Angular na versão mais recente para poder demonstrar o uso de novos recursos como a API reativa `Signals` e as `Template Syntax`, Para o auxilio de UI escolhi o `Angular Material` por ser mais popular e prestar total integração com Angular.

### 2 - JSON Server como back-end de persistência

Decidi utilizar [JSON Server](https://github.com/typicode/json-server) pois já tenho um conhecimento previo da ferramenta, o principal motivo da escolha se deu pelo fato de poder simular api REST e demonstrar no teste com muita pouca configuração as comunicações HTTP. Devido a essa motivação alternativas como `localStorage` e  `IndexedDB` tornaria a implementação mais simples.


**Alternativas consideradas:**
- `localStorage` — simples, mas síncrono e sem interface HTTP; tornaria o `CepStorageService` menos reutilizável
- `IndexedDB` — mais poderoso que `localStorage`, mas com API complexa e sem REST
- API real (ex.: NestJS + PostgreSQL) — a evolução natural para um ambiente de produção, conforme mencionado em [Possíveis melhorias futuras](#possíveis-melhorias-futuras)

---

## Requisitos do Teste

### Itens obrigatórios

| Requisito | Status | Onde está implementado |
|-----------|:------:|------------------------|
| Angular 2+ com TypeScript | ✅ | Angular **21** com TypeScript 5.9 — versão mais recente para demonstrar Signals e nova Template Syntax |
| HTML5 semântico | ✅ | Tags `<header>`, `<main>`, `<nav>`, `<article>`, `<section>`, `<time>`, `<dl>/<dt>/<dd>` em todos os templates |
| CSS com SASS | ✅ | Arquivos `.scss` por componente + `src/styles/_variables.scss` centralizado |
| Grid responsivo (Angular Material) | ✅ | Angular Material 21 + media queries para tablet (≤ 768px) e mobile (≤ 480px) |
| Integração com ViaCEP | ✅ | `CepService` via `HttpClient` apontando para `https://viacep.com.br` |

### Critérios de avaliação

| Critério | Status | Onde está implementado |
|----------|:------:|------------------------|
| Lógica e estruturação de módulos/componentes | ✅ | `MainModule`, `HomeModule`, `CepModule` — padrão container/apresentacional com `CepFacade` e `CepState` |
| Roteamento com Lazy Load | ✅ | `loadComponent` no `app.routes.ts` para os módulos Home e CEP |
| Reactive Forms | ✅ | `FormControl` com `Validators.required` e `cepValidator` customizado em `CepSearch` |
| Observables (RxJS) e gerenciamento de eventos | ✅ | `zip`, `switchMap`, `catchError`, `finalize`, `timeout` em `CepFacade`; `output<T>()` nos componentes |
| HTML semântico e limpo | ✅ | Atributos `aria-label`, `aria-labelledby`, `role`, `scope`, `inputmode`, `autocomplete` |
| Máscara de input e validação | ✅ | `ngx-mask` com `mask="00000-000"`; validador bloqueia CEPs com menos de 8 dígitos |
| Layout, detalhes e responsividade | ✅ | Hover com `transition: background-color 0.2s ease`, tabela responsiva, breakpoints mobile |

### Diferenciais

| Diferencial | Status | Onde está implementado |
|-------------|:------:|------------------------|
| Angular Material | ✅ | `mat-table`, `mat-form-field`, `mat-button`, `mat-dialog`, `mat-spinner`, `mat-menu`, `mat-icon` |
| Variáveis e pseudo-elementos SASS | ✅ | `_variables.scss` com `$color-primary`, `$border-radius`, `$transition-*`; pseudo-seletores `:hover`, `::before` |
| Animações — loaders, transitions, hover | ✅ | `mat-spinner` no botão Buscar durante loading; `transition` nas linhas da tabela e botões |
| Logo SCCON em SVG | ✅ | `scconlogo.svg` em `public/`, exibido no componente `Header` |

### Requisitos de telas

| Requisito | Status | Onde está implementado |
|-----------|:------:|------------------------|
| Logo SCCON (SVG) no header | ✅ | `Header` component — `<img src="scconlogo.svg">` |
| Menu com fundo `#670000` | ✅ | `$color-primary: #670000` em `_variables.scss`, aplicado no `Header` |
| Botões `#D7DBDD` com hover 6% mais escuro | ✅ | Tema customizado do Angular Material com `darken()` no hover |
| Botões com cantos arredondados | ✅ | `mat-flat-button` com `border-radius` definido em `_variables.scss` |

### Requisitos de arquitetura

| Requisito | Status | Onde está implementado |
|-----------|:------:|------------------------|
| Módulo Principal | ✅ | `src/app/modules/main/` — `Layout` com `Header` e `router-outlet` |
| Módulo Home | ✅ | `src/app/modules/home/` — página de boas-vindas carregada sob demanda |
| Módulo CEP | ✅ | `src/app/modules/cep/` — busca, listagem, modal e facade |
| Componentes: Header, Home, Busca, Listagem | ✅ | `Header`, `Home`, `CepSearch`, `CepList` como standalone components |
| Lazy Load (Home e Endereços) | ✅ | `loadComponent` em `app.routes.ts` para ambos os módulos |
| Arquitetura de serviços | ✅ | `CepService`, `CepStorageService`, `ToastService`, `CepFacade`, `CepState` |

### Desafios adicionais (opcionais)

| Desafio | Status | Onde está implementado |
|---------|:------:|------------------------|
| Botão para deletar busca | ✅ | Coluna Ação na tabela — `output<string>() excluir` em `CepList` |
| Persistência via REST mock | ✅ | JSON Server em `http://localhost:3000/enderecos` com `db.json` na raiz |

### Checklist do README (forma de entrega)

| Item exigido | Status |
|--------------|:------:|
| Instruções de instalação | ✅ |
| Instruções de execução/deploy | ✅ |
| Principais recursos implementados | ✅ |
| Decisões técnicas | ✅ |

---

## Possíveis melhorias futuras

- **Paginação na listagem** — adicionar `mat-paginator` na tabela de endereços para lidar com listas longas
- **Ordenação e filtro na tabela** — integrar `MatSort` e um campo de filtro por CEP ou endereço
- **Autenticação** — proteger as rotas com guards e um fluxo simples de login
- **Testes end-to-end** — complementar a cobertura de testes unitários (já implementados com Vitest) com testes E2E usando Playwright ou Cypress
- **Deploy do back-end** — substituir o JSON Server por uma API real (ex.: NestJS + banco de dados) e configurar o `environment.prod.ts` apontando para ela
- **PWA** — adicionar suporte offline com Service Worker para cachear as últimas buscas sem conexão

---

## Autor

**Lucas Fontes Cartaxo**
[linkedin.com/in/lucasfcartaxo](https://www.linkedin.com/in/lucasfcartaxo/)
