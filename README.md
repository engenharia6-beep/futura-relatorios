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
- E-mail: a implementar
