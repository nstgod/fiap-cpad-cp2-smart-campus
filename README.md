# FIAP-DSA

# 📱 FIAP Smart Campus

## a) Sobre o Projeto
**Nome do App:** FIAP Smart Campus  
**Operação Escolhida:** Otimização do tempo do aluno no campus (Cantina, Laboratórios e Fluxo de Pessoas).

**Descrição e Porquê:** A rotina na FIAP é intensa. Identificamos que os alunos perdem muito tempo útil enfrentando filas na cantina no intervalo, procurando laboratórios livres para estudar (ou com o ar condicionado agradável) e lidando com a superlotação nos elevadores e catracas. Escolhemos resolver esse problema centralizando os serviços do dia a dia em um único "Smart App" na palma da mão.

**Funcionalidades Implementadas:**
- **Cantina Express:** Fluxo completo de carrinho de compras e pagamento simulado para retirada rápida no balcão.
- **Radar FIAP:** Monitoramento em tempo real (crowdsourcing/IoT) da lotação dos elevadores, catracas e áreas comuns.
- **FIAP Labs:** Consulta de disponibilidade de laboratórios e temperatura do ar condicionado filtrados por andar.
- **Portal do Aluno:** Acesso rápido ao cronograma de aulas dinâmico e boletim de notas em formato dashboard.

---

## b) Integrantes do Grupo
* **[Kauã Lazarim]** - RM: [564625] - Ciência da Computação
* **[Nelson Troccoli]** - RM: [562815] - Ciência da Computação

---

## c) Como Rodar o Projeto

**Pré-requisitos:**
- Node.js instalado no computador.
- Aplicativo **Expo Go** instalado no smartphone (iOS ou Android).

**Passo a Passo:**
1. Clone este repositório:
   \`\`\`bash
   git clone https://github.com/nstgod/fiap-cpad-cp2-smart-campus.git
   \`\`\`
2. Navegue até a pasta do projeto:
   \`\`\`bash
   cd fiap-cpad-cp2-smart-campus
   \`\`\`
3. Instale as dependências:
   \`\`\`bash
   npm install
   \`\`\`
4. Inicie o servidor de desenvolvimento:
   \`\`\`bash
   npx expo start
   \`\`\`
5. Abra o aplicativo **Expo Go** no seu celular e escaneie o QR Code exibido no terminal.

---

## d) Demonstração

<p align="center">
  <img src="./assets/tela-home.png" width="200" />
  <img src="./assets/tela-acesso.png" width="200" />
  <img src="./assets/tela-cronograma.png" width="200" />
  <img src="./assets/tela-notas.png" width="200" />
  <img src="./assets/tela-reservar-labs.png" width="200" />
  <img src="./assets/tela-cantina.png" width="200" />
   <img src="./assets/tela-pagamento.png" width="200" />
</p>

<p align="center">
  <img src="./assets/aplicativo.gif" width="400" />
</p>

## e) Decisões Técnicas

- **Estrutura e Navegação:** Utilizamos o **Expo Router** com agrupamento de rotas (`(auth)` e `(app)`) para separar fluxo de autenticação do app logado, com `Stack` em cada grupo. `router.replace()` é usado nos pontos de transição (login → home, logout → login) para evitar retornos acidentais.
- **Gerenciamento de Estado:** Centralizamos o estado global em dois Contexts: `AuthContext` (sessão, login, cadastro, logout) e `AppDataContext` (reservas de labs, carrinho da cantina, histórico de pedidos). Cada tela consome o context via hooks customizados (`useAuth`, `useAppData`).
- **Persistência (AsyncStorage):** Toda a auth e os dados funcionais persistem em AsyncStorage. As funções estão em `services/authStorage.js` e `services/dataStorage.js`. A leitura inicial acontece no `useEffect` dos providers e o estado é mantido em sincronia a cada insert/edit/delete.
- **UX/UI:** Paleta, tipografia e espaçamento centralizados em `constants/`. Componentes reutilizáveis (`Button`, `Input`, `Card`, `EmptyState`, `FeedbackMessage`, `Screen`, `Logo`) cobrem feedback visual, loading inline (`ActivityIndicator` dentro do botão), erros inline nos formulários (sem `Alert`), empty states e suporte a teclado via `KeyboardAvoidingView`. Ícones com `@expo/vector-icons`.

### Estrutura de Pastas

```
fiap-cpad-cp1-smart-campus/
├── app/                       # Rotas do Expo Router
│   ├── _layout.js            # Provider raiz (Auth + AppData)
│   ├── index.js              # Splash que decide login/home pela sessão
│   ├── (auth)/                # Rotas públicas
│   │   ├── _layout.js
│   │   ├── login.js
│   │   └── cadastro.js
│   └── (app)/                 # Rotas autenticadas
│       ├── _layout.js
│       ├── home.js
│       ├── notas.js
│       ├── cronograma.js
│       ├── labs.js
│       └── kitchenette.js
├── components/                # Componentes reutilizáveis
│   ├── Button.js
│   ├── Input.js
│   ├── Card.js
│   ├── EmptyState.js
│   ├── FeedbackMessage.js
│   ├── Screen.js
│   └── Logo.js
├── context/                   # Contexts globais
│   ├── ThemeContext.js        # Tema claro/escuro persistido
│   ├── AuthContext.js
│   └── AppDataContext.js
├── services/                  # Persistência (AsyncStorage)
│   ├── authStorage.js
│   └── dataStorage.js
├── constants/                 # Paleta (light + dark), espaçamento, tipografia
│   ├── colors.js
│   ├── spacing.js
│   ├── typography.js
│   └── index.js
└── assets/                    # Imagens e ícones
```

---

## f) Diferencial — Modo Escuro / Tema Dinâmico

Implementamos **alternância entre tema claro e escuro** via `Context`, com a preferência persistida em AsyncStorage para sobreviver a fechamento do app. O usuário troca de tema com um toque no ícone de sol/lua na home, e a mudança é instantânea em todas as telas.

### Por que escolhemos esse diferencial

A FIAP tem identidade visual forte em rosa sobre fundo escuro, mas o app é usado durante o dia todo no campus — em ambientes ensolarados (Av. Paulista, áreas comuns) o tema claro reduz fadiga visual, e à noite o escuro economiza bateria em telas OLED e é mais confortável. Ter os dois e deixar o aluno escolher cobre os dois cenários reais de uso.

### O que agrega ao projeto

- **Demonstra domínio de Context API**: `ThemeContext` se soma ao `AuthContext` e `AppDataContext`, mostrando composição de providers.
- **Persistência aplicada também a preferência de UI**: o mesmo padrão usado para sessão/dados é reutilizado para a preferência de tema (chave `@fiap_smart_campus:theme`).
- **Disciplina de design tokens**: forçou a paleta a ser organizada em duas variantes (`lightColors`, `darkColors`) com **as mesmas chaves semânticas** (`background`, `surface`, `text`, `textMuted`, etc.), ou seja, os componentes não sabem qual tema está ativo — só consomem `colors.background` e o tema cuida do resto.
- **Status bar adaptativa**: o `Screen` lê `colors.statusBar` e ajusta `light-content`/`dark-content` automaticamente em cada tela.
- **Feedback visual coerente nos dois temas**: as cores de sucesso/erro/info/warning têm versões com contraste calibrado para fundo claro e escuro (`successBg`, `errorBg`, etc.).

### Como está implementado

- `context/ThemeContext.js` expõe `{ theme, colors, isDark, toggleTheme }` via hook `useTheme()`.
- `app/_layout.js` envolve toda a árvore com `<ThemeProvider>` (acima de Auth e AppData).
- Todos os componentes (`Button`, `Input`, `Card`, `EmptyState`, `FeedbackMessage`, `Screen`, `Logo`) e telas consomem `useTheme()` e aplicam as cores via `style` inline, garantindo reatividade ao toggle.
- O botão de alternância fica na home, ao lado do avatar do usuário (`sunny-outline` quando o tema é escuro, `moon-outline` quando é claro).

---

## g) Próximos Passos
Se tivéssemos mais tempo para evoluir este MVP, implementaríamos:
1. Integração real com as APIs da catraca e sensores de IoT das salas (temperatura e presença) usando Axios.
2. Sistema real de autenticação vinculado ao Azure AD da FIAP.
3. Notificações Push para avisar o aluno quando o pedido da cantina estiver pronto no balcão.
