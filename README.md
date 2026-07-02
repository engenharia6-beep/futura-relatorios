# Relatórios de Gestão — Futura

App web de relatórios, análises e gestão de acesso para o sistema de estoque Futura.
Hospedado via GitHub Pages, consome um backend Google Apps Script.

## Repositórios

| Repositório | Descrição |
|---|---|
| `futura-relatorios` | Frontend (este repo) — GitHub Pages |
| `futura-gas` | Backend — Google Apps Script (`Código.js`) |

---

## Relatórios disponíveis

| ID | Nome | Badge |
|----|------|-------|
| `cenario` | Acompanhamento Fabril | PCP |
| `movimentos` | Movimentos por Período | Insumos + PA |
| `estoque-insumos` | Posição de Estoque — Insumos | Insumos |
| `estoque-pa` | Posição de Estoque — PA | Produtos Acabados |
| `ops` | OPs por Período | Ordens de Produção |
| `abc` | Curva ABC | Análise |
| `extrato` | Extrato de Produto | Insumo ou PA |
| `compras` | Lista de Compras | Compras |
| `fechamento` | Fechamento Mensal M5/M3 | Fechamento |
| `vendas` | Dashboard de Vendas | Vendas |
| `guia` | Guia de Documentação | Docs |
| `usuarios` | Manutenção de Usuários *(somente ADMIN)* | Admin |

---

## Funcionalidades

### Menu dinâmico e personalizável
Os cards do menu são gerados a partir do array `CARDS_PADRAO` em `index.html`. A personalização feita pelo ADMIN é salva no backend (aba `CARDS_CONFIG` da planilha) — não é mais por navegador.

**Botão ⚙ Personalizar** (visível apenas para ADMIN):
- Editar ícone, título, descrição, etiqueta e cor de cada card
- Reordenar com ▲ ▼
- Remover cards
- Restaurar configuração padrão (para todos os usuários espelhados)

**Espelhamento entre usuários (opt-in):**
- Ao salvar, o ADMIN marca quais usuários ativos recebem a personalização (lista de checkboxes no rodapé do modal)
- Só uma configuração "principal" existe por vez — o último ADMIN que salvar sobrescreve a anterior
- Usuários não marcados continuam vendo `CARDS_PADRAO`
- O autor da configuração sempre a vê, mesmo sem se marcar na lista

### Controle de acesso por usuário

#### Perfis
| Perfil | O que vê |
|--------|----------|
| `ADMIN` | Tudo — sem restrições |
| Qualquer outro | Somente os relatórios configurados na coluna `RELATORIOS` |

#### Regras
- Campo `RELATORIOS` **vazio** → usuário vê todos os relatórios não-admin
- Campo `RELATORIOS` **preenchido** → vê apenas os IDs listados (ex: `movimentos,estoque-insumos`)
- Perfil `ADMIN` → ignora o campo `RELATORIOS`, sempre vê tudo

### Manutenção de Usuários *(somente ADMIN)*
Painel acessível pelo card "Manutenção de Usuários". Permite:
- **Criar** usuário (login, senha, nome, perfil, acesso ao app, relatórios liberados)
- **Editar** usuário (nome, perfil, acesso, status ativo/inativo, nova senha, relatórios)
- **Desativar** usuário (marca `Ativo = NÃO` — não apaga da planilha)
- Seleção de relatórios por checkboxes, com botões "Todos" e "Nenhum"

### Lightbox de fotos
Clique em qualquer thumbnail de produto para abrir a foto ampliada (800px) em um modal com fundo escuro.
- Spinner de carregamento enquanto a imagem carrega
- Legenda com o nome do produto
- Fechar com clique fora, botão ✕ ou tecla **Escape**
- Disponível em: Movimentos, Estoque Insumos, Estoque PA, OPs, Curva ABC, Extrato, Fechamento M5/M3 e Dashboard de Vendas

---

## Arquitetura

### Backend — Google Apps Script
- Arquivo local: `futura-gas/Código.js`
- Script ID: `1jMaRxUHTwm0iJc4ECerOmqipq5oIqjkpV4bbsz5T9uhinlS5sIM_edZi`
- Deploy ID (produção): `AKfycbz4i-1qMNt_IOdefeZtUNa9RdoQJl8xq-KKBBvmdrPIRBQS2bZhLvzBcyZwQI4fabo7fg`
- URL configurada em: `config.js` → `CONFIG.GAS_URL`

### Ações da API (`doPost`)

| Ação | Descrição | Escrita? |
|------|-----------|----------|
| `autenticar` | Login com usuário e senha | Não |
| `listarCadastro` | Insumos do estoque | Não |
| `listarCadastroPA` | Produtos Acabados | Não |
| `listarMovimentos` | Movimentos de Insumos | Não |
| `listarMovimentosPA` | Movimentos de PA | Não |
| `getCenarioMomento` | Dados em tempo real do cenário | Não |
| `listarBOMsDisponiveis` | BOMs para lista de compras | Não |
| `listarEstruturaTodos` | Estrutura de todos os PAs | Não |
| `listarSaldosInsumos` | Saldos de insumos | Não |
| `calcularFechamentoM5` | Calcula fechamento de Insumos | Não |
| `calcularFechamentoM3` | Calcula fechamento de PA | Não |
| `arquivarFechamentoM5` | Grava histórico M5 | **Sim** |
| `arquivarFechamentoM3` | Grava histórico M3 | **Sim** |
| `getDashboardVendas` | Dados do dashboard de vendas | Não |
| `listarUsuarios` | Lista usuários *(somente ADMIN)* | Não |
| `criarUsuario` | Cria novo usuário *(somente ADMIN)* | **Sim** |
| `atualizarUsuario` | Edita dados do usuário *(somente ADMIN)* | **Sim** |
| `desativarUsuario` | Desativa usuário *(somente ADMIN)* | **Sim** |
| `trocarSenha` | Altera senha *(somente ADMIN)* | **Sim** |
| `obterCardsConfig` | Retorna a personalização de cards, se o usuário estiver liberado | Não |
| `obterCardsConfigAdmin` | Retorna a personalização completa + lista de liberados *(somente ADMIN)* | Não |
| `salvarCardsConfig` | Salva personalização de cards + lista de usuários liberados *(somente ADMIN)* | **Sim** |
| `resetarCardsConfig` | Remove a personalização, volta todos ao `CARDS_PADRAO` *(somente ADMIN)* | **Sim** |

### Planilha Google Sheets
ID: `1YMxrDY8aJk7NvMGd46mOjhJqnhw2bN7-xk-qh1QLCu8`

#### Aba USUARIOS — colunas obrigatórias

| Coluna | Descrição | Valores aceitos |
|--------|-----------|-----------------|
| `ID` | Identificador único | texto (ex: `U1234567890`) |
| `Usuario` | Login | texto |
| `Senha` | Senha em texto plano | texto |
| `Nome` | Nome completo | texto |
| `Perfil` | Nível de acesso | `ADMIN`, `Gerente`, `Operador`, etc. |
| `Ativo` | Status do usuário | `SIM` ou `NÃO` |
| `ACESSO_APPS` | App permitido | `RELATORIOS`, `ESTOQUE` ou `AMBOS` |
| `RELATORIOS` | IDs de relatórios liberados | IDs separados por vírgula, ou vazio para tudo |

**Exemplo de valor em `RELATORIOS`:** `movimentos,estoque-insumos,estoque-pa`

#### Aba CARDS_CONFIG — personalização espelhada dos cards do menu

| Coluna | Descrição |
|--------|-----------|
| `CHAVE` | Sempre `principal` (configuração única, linha 2) |
| `JSON` | Array de cards personalizados, serializado (`JSON.stringify`) |
| `PERMITIDOS` | IDs de usuário liberados a ver essa personalização, separados por vírgula |
| `ATUALIZADO_EM` | Data/hora do último salvamento |
| `ATUALIZADO_POR` | ID do ADMIN que salvou (esse usuário sempre vê a config, mesmo fora de `PERMITIDOS`) |

Criada manualmente (sem cabeçalho) — o cabeçalho é escrito automaticamente no primeiro `salvarCardsConfig`.

---

## Setup inicial

### 1. Criar repositório no GitHub
- Nome: `futura-relatorios`
- Visibilidade: Public

### 2. Subir arquivos
```bash
git init
git add .
git commit -m "feat: app de relatórios"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/futura-relatorios.git
git push -u origin main
```

### 3. Ativar GitHub Pages
Settings → Pages → Branch: `main` / root

### 4. Criar novo Apps Script (mesmo Spreadsheet)
- Cole o `Código.js` do repositório `futura-gas`
- Deploy como Web App (acesso: Anyone)
- Copie a URL → cole em `config.js`

### 5. Configurar primeiro ADMIN na planilha
Na aba `USUARIOS`, defina `Perfil = ADMIN` para o usuário administrador.

---

## Manutenção do Backend (clasp)

### Pré-requisitos
```bash
npm install -g @google/clasp
clasp login   # conta engenharia6@futuraeletronicos.com.br
```

### Clonar o projeto GAS localmente
```bash
mkdir futura-gas && cd futura-gas
clasp clone 1jMaRxUHTwm0iJc4ECerOmqipq5oIqjkpV4bbsz5T9uhinlS5sIM_edZi
```

### Publicar alterações
```bash
clasp push
clasp deploy --deploymentId "AKfycbz4i-1qMNt_IOdefeZtUNa9RdoQJl8xq-KKBBvmdrPIRBQS2bZhLvzBcyZwQI4fabo7fg" --description "descricao"
```

> **Atenção:** `clasp push` salva o código, mas só o `clasp deploy` (nova versão) atualiza o URL de produção `/exec`.

### Habilitar API (necessário uma vez por conta)
Acesse https://script.google.com/home/usersettings e ative **Google Apps Script API**.

---

## Exportação e impressão
- **Excel:** SheetJS via CDN — gerado no browser, sem servidor
- **Imprimir/PDF:** `window.print()` com CSS de impressão dedicado

---

## Fotos de produtos
Servidas via Google Drive (thumbnail URL).

| Aba da planilha | Coluna |
|---|---|
| Cadastro (Insumos) | `Endereço_Foto` |
| Cadastro_PA | `FOTO_SHEETS` |

Formato: `https://drive.google.com/thumbnail?sz=w1000&id=<ID>`
O frontend normaliza para `sz=w120` via `_normalizarFotoUrlFechamento()`.

---

## Documentação interna
O card **Guia de Documentação** abre um modal com:
- Carregar PDF local de uso
- Carregar Apresentação da Gestão em PDF
- Link para o Google Docs da documentação original
