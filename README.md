# Relatórios de Gestão — Futura

App de relatórios e exportação de dados do estoque.
Somente leitura — nunca grava nada na planilha.

## Repositório
`futura-relatorios` → GitHub Pages

## Relatórios disponíveis
1. Movimentos por Período
2. Posição de Estoque — Insumos
3. Posição de Estoque — PA
4. OPs por Período
5. Curva ABC
6. Extrato de Produto
7. Lista de Compras (itens críticos ou baseado em PA)
8. Fechamento Mensal M5/M3
9. Dashboard de Vendas

## Setup

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
Settings → Pages → Branch: main / root

### 4. Criar novo Apps Script (mesmo Spreadsheet)
- Cole o `Code_relatorios.gs`
- Deploy como Web App (Anyone)
- Copie a URL → cole no `config.js`

## Exportação
- Excel: SheetJS via CDN (gerado no browser)
- PDF/Imprimir: window.print() com CSS de impressão

---

## Arquitetura

### Repositórios
| Repositório | Descrição |
|---|---|
| `futura-relatorios` | Frontend (este repo) — GitHub Pages |
| `futura-gas` | Backend — Google Apps Script (clasp) |

### Backend — Google Apps Script
- Projeto GAS: **Code_relatorios**
- Script ID: `1jMaRxUHTwm0iJc4ECerOmqipq5oIqjkpV4bbsz5T9uhinlS5sIM_edZi`
- Deploy ID (produção): `AKfycbz4i-1qMNt_IOdefeZtUNa9RdoQJl8xq-KKBBvmdrPIRBQS2bZhLvzBcyZwQI4fabo7fg`
- URL configurada em: `config.js` → `CONFIG.GAS_URL`

### Fotos de produtos
As fotos são servidas via Google Drive (thumbnail URL). Colunas por aba:

| Aba da planilha | Coluna de foto |
|---|---|
| Cadastro (Insumos) | `Endereço_Foto` |
| Cadastro_PA | `FOTO_SHEETS` |

Formato armazenado: `https://drive.google.com/thumbnail?sz=w1000&id=<ID>`
O frontend normaliza para `sz=w120` via `_normalizarFotoUrlFechamento()` em `index.html`.

### Relatórios com coluna Foto
Movimentos, Estoque Insumos, Estoque PA, OPs, Curva ABC, Extrato (resumo), Fechamento M5/M3, Dashboard de Vendas.

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
clasp deploy --deploymentId "AKfycbz4i-1qMNt_IOdefeZtUNa9RdoQJl8xq-KKBBvmdrPIRBQS2bZhLvzBcyZwQI4fabo7fg" --description "descricao da mudanca"
```

> **Atenção:** após `clasp push` é obrigatório rodar o `clasp deploy` para que o URL de produção (`/exec`) sirva o código novo.

### Habilitar API (necessário uma vez por conta)
Acesse https://script.google.com/home/usersettings e ative **Google Apps Script API**.

---

## Documentação / Apresentação
O modal **Guia de Documentação** (card no menu) contém:
- **Escolher arquivo PDF** — carrega o Guia de uso a partir de um arquivo local
- **📊 Apresentação da Gestão** — carrega a Apresentação da Gestão a partir de um arquivo local
- **Abrir Docs original** — abre o Google Docs da documentação
