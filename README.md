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
| `producao` | Produção Diária | Produção |
| `abc` | Curva ABC | Análise |
| `extrato` | Extrato de Produto | Insumo ou PA |
| `compras` | Lista de Compras | Compras |
| `fechamento` | Fechamento Mensal M5/M3 | Fechamento |
| `vendas` | Dashboard de Vendas | Vendas |
| `vendas-segmento` | Vendas por Segmento | Vendas |
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
- Disponível em: Movimentos, Estoque Insumos, Estoque PA, OPs, Curva ABC, Extrato, Compras, Produção Diária, Fechamento M5/M3 e Dashboard de Vendas

### Lista de Compras
Dois modos, alternados por abas:

**Itens Críticos** — varre o Cadastro de Insumos e sinaliza quem está Zerado, Abaixo do Mínimo ou Abaixo do Ponto de Pedido (esse último critério usa o valor de `Estoque_Seguranca` como referência de reposição). Colunas: Foto, Código, Descrição, Tipo, Saldo, Mínimo, Segurança, Compra sugerida, Situação — todos os valores numéricos como inteiro.

**Baseado em PA** — monta a lista de insumos necessários a partir de um ou mais PAs selecionados (com quantidade), usando a estrutura BOM (`BOM_ESTRUTURA`). Seleção de PA e resultado ordenados por Grupo → Ordem_ → Ordem (mesma ordem da estrutura na planilha). Colunas: Foto, Código, Descrição, Uso (consumo por unidade), Necessidade, Saldo Atual, Falta Comprar, Status, BOM (quais PAs pedem o item). Checkbox **"Somente itens a comprar"** filtra a tabela e a exportação Excel para mostrar só quem tem falta.

Em ambos os modos, clicar no cabeçalho de qualquer coluna reordena a tabela.

### Produção Diária
Mostra a quantidade produzida por dia a partir do log `Producao_diaria` (planilha externa, veja [Planilhas externas](#planilhas-externas)) — **só conta lançamentos com `Status = Finalizado`**.

- Filtros: **Mês/Ano** (dropdown com os meses existentes na base) e **Processo** (linha/time de produção).
- Resumo por **grupo** no topo (cards, mesma ideia do bloco "PROJETOS" do dashboard antigo em Sheets).
- Tabela de produtos com Foto (via join em Cadastro/Cadastro_PA), Código, Descrição, Grupo, Total Mensal e uma coluna por dia com produção — só aparecem os dias que realmente tiveram lançamento. Linha de **TOTAIS** no rodapé, soma por dia.
- Substitui o relatório equivalente que existia direto na planilha (aba `Producao_diaria` do arquivo de produção) — este lê a fonte diretamente, sem depender de dropdowns/fórmulas manuais na planilha.

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
| `listarOPS` | OPs por período (aba `Lista_de_Ops`) | Não |
| `getCenarioMomento` | Dados em tempo real do Acompanhamento Fabril | Não |
| `getVendasSegmento` | Dados do relatório Vendas por Segmento | Não |
| `listarBOMsDisponiveis` | Lista de PAs disponíveis (estrutura BOM), ordenada por Grupo/Ordem_ | Não |
| `listarEstruturaTodos` | Estrutura completa de todos os PAs (BOM_ESTRUTURA) | Não |
| `listarSaldosInsumos` | Saldos de insumos (para Lista de Compras — modo PA) | Não |
| `listarFiltrosProducao` | Meses/Ano e Processos disponíveis em Produção Diária | Não |
| `listarProducaoDiaria` | Produção por produto/dia (só `Status = Finalizado`) | Não |
| `listarMesesHistoricoM5` | Meses já arquivados no histórico M5 (Insumos) | Não |
| `listarMesesHistoricoM3` | Meses já arquivados no histórico M3 (PA) | Não |
| `lerHistoricoM5` | Lê um mês já arquivado do histórico M5 | Não |
| `lerHistoricoM3` | Lê um mês já arquivado do histórico M3 | Não |
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

#### Aba BOM_ESTRUTURA — estrutura de produtos (usada em Lista de Compras/PA)

| Coluna | Descrição |
|--------|-----------|
| `codigo_BOM` | Código do PA |
| `Descrição do Produto_BOM` | Descrição do PA (aparece no seletor) |
| `Código_INSUMO` | Código do insumo consumido |
| `Descrição do Item_INSUMO` | Descrição do insumo |
| `Quantidade do Item` | Consumo do insumo por unidade de PA ("Uso") |
| `Ordem` | Ordem secundária de exibição |
| `Estoque` | Não usado pelo app |
| `FOTO` | Foto do insumo (fallback: `Endereço_Foto`/`FOTO_SHEETS` do Cadastro, se vazia) |
| `ORDEM_` | Ordem primária de exibição (⚠️ nome colide com `Ordem` após normalização — o backend usa busca exata para essas duas colunas, veja `_idxColExato` em `Código.js`) |
| `GRUPO` | Categoria do PA — define a ordenação junto com `ORDEM_` |

O seletor de PA e o resultado da Lista de Compras (modo PA) são ordenados por `GRUPO → ORDEM_ → Ordem`.

### Planilhas externas
Além da planilha principal, o backend lê/consome estas planilhas separadas (cada uma com seu próprio `SpreadsheetApp.openById` em `Código.js`):

| Planilha | Constante em `Código.js` | Usada por |
|---|---|---|
| Vendas | `SPREADSHEET_ID_VENDAS` | `getDashboardVendas` |
| Cenário de Momento | `SPREADSHEET_ID_CENARIO` | `getCenarioMomento` |
| Vendas por Segmento | `SPREADSHEET_ID_VENDAS_SEG` (aba `F5`) | `getVendasSegmento` |
| Produção | `SPREADSHEET_ID_PRODUCAO` — abas `Producao_diaria` e `Lista_de_Ops` | `listarFiltrosProducao`, `listarProducaoDiaria`, `listarOPS` |

#### Aba Producao_diaria — log de produção (planilha "Produção", não a principal)

| Coluna | Descrição |
|--------|-----------|
| `OP` | Ordem de produção |
| `Codigo_Produto` | Código do produto produzido |
| `Qtde` | Quantidade produzida no lançamento |
| `Dia` | **Data completa** (não só o número do dia) — o backend extrai o dia do mês com `_diaDoMes()` |
| `Processo` | Linha/time responsável pela produção |
| `Status` | Só `Finalizado` conta como produção realizada — demais valores (pendente, cancelado etc.) são ignorados |
| `Hora`, `ID`, `Operador`, `Insumo`, `Qtde_Insumo`, `Fase` | Não usados pelo relatório de Produção Diária hoje |
| `Mês/Ano` | Texto tipo `"Agosto/2026"` — usado para popular o filtro e para filtrar o período |
| `Descrição` | Descrição do produto |
| `grupo` | Categoria — vira o resumo por grupo do relatório |

#### Aba Lista_de_Ops — OPs por período (mesma planilha "Produção")

| Coluna | Descrição |
|--------|-----------|
| `DATA` | Data da OP |
| `OP` | Número da OP — filtro no app aceita várias, separadas por vírgula ou espaço (ex: `9221, 9222, 9223`) |
| `CÓDIGO` | Código do produto |
| `QTDE` | Quantidade |
| `DESCRIÇÃO` | Descrição do produto |
| `FOTO` | Foto do produto (fallback: junção por código com Cadastro/Cadastro_PA) |

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
| BOM_ESTRUTURA | `FOTO` (fallback: junção por código com Cadastro/Cadastro_PA acima) |

Formato: `https://drive.google.com/thumbnail?sz=w1000&id=<ID>`
O frontend normaliza para `sz=w120` via `_normalizarFotoUrlFechamento()`.
No backend, `_mapaCadastro()` lê Cadastro + Cadastro_PA uma única vez e devolve descrição e foto por código — reaproveitado por Movimentos, Estrutura BOM e Produção Diária (evita reler as mesmas abas repetidas vezes).

---

## Performance (backend)
O backend não tem estado entre requisições (cada `doPost` é uma execução nova), então o cuidado com leitura de planilha é o que mais afeta a velocidade de abertura dos relatórios:

- **Handles de planilha memoizados** (`_ss()`, `_ssVendas()`, `_ssProducao()`) — evita reabrir a mesma planilha várias vezes na mesma requisição. Seguro fazer isso mesmo entre requisições, porque é só a referência à planilha — a leitura em si continua sempre ao vivo.
- **`CacheService`** (`_cacheGet`/`_cachePut`) é usado só para dados que mudam pouco: estrutura BOM (10 min), meses/histórico de Fechamento já arquivado (5 min a lista, 1h por mês — mês arquivado é imutável) e Dashboard de Vendas (5 min).
- **Nunca cachear saldo/estoque/movimentos** (`listarCadastro`, `listarMovimentos`, `listarSaldosInsumos`, `listarProducaoDiaria` etc.) — são dados usados para decisão de compra/produção; um cache de alguns minutos poderia mostrar número desatualizado numa hora crítica. Essa é uma decisão deliberada, não um esquecimento — se for reconsiderar, avalie o risco de negócio primeiro.
- **`_getAbsUsuarios()` (dados de USUARIOS) não é memoizado** pelo mesmo motivo: é dado de autenticação/autorização, e o Apps Script pode reaproveitar a mesma instância de execução entre requisições — memoizar arriscaria manter senha/perfil antigos em cache. A releitura dupla que existia (uma em `_verificarAdmin`, outra na função chamadora) foi resolvida passando o resultado já carregado adiante (`_isAdmin(ab, id)`), não com cache.
- Ao adicionar `_idxCol(header, 'Nome_Da_Coluna')` para um nome novo, cuidado com colisão de normalização (ex: `Ordem` vs `ORDEM_` viram o mesmo texto normalizado) — use `_idxColExato` nesses casos.

---

## Documentação interna
O card **Guia de Documentação** abre um modal com:
- Carregar PDF local de uso
- Carregar Apresentação da Gestão em PDF
- Link para o Google Docs da documentação original
