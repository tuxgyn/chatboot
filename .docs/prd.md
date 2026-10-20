# PRD — Chat Offline

Documento de implementação da janela única de chat em que a mesma pessoa envia mensagens como **usuário** ou como **robô**, alternando pelo toggle do composer.

Stack já existente: **Vite + React + TypeScript + Tailwind**. Não reconfigurar o bootstrap.

---

## 1. Objetivo

Entregar uma tela única, sem rotas e sem persistência, com:

- histórico de mensagens em memória (`useState`);
- composer fixo no rodapé;
- envio como usuário (bolha à direita) ou robô (bolha à esquerda).

---

## 2. Escopo

### 2.1 Inclui

- Layout full-viewport com fundo marrom claro.
- Coluna do chat (`max-w-2xl`, centralizada).
- Lista de mensagens com texto, horário e rótulo (Usuário / Robô).
- Estado vazio com texto quando `messages.length === 0`.
- Scroll automático para a última mensagem após cada envio.
- Composer em card branco: toggle de remetente, textarea com altura automática, botão enviar.
- Estado visual do modo robô (borda roxa no card).
- Envio pelo botão Enviar **ou** por `Enter`. `Shift+Enter` quebra linha.

### 2.2 Fora de escopo

- Persistência (localStorage, backend, URL).
- Edição, exclusão, retry ou limpeza do histórico.
- Markdown, anexos, emoji picker, streaming.
- Autenticação, múltiplas conversas, roteamento.
- Bibliotecas de estado, UI kit ou ícones (ícones em SVG inline).

---

## 3. Convenções técnicas

| Item | Regra |
| --- | --- |
| App | `chat_offiline/` (Vite atual) |
| Types | `src/types/*.ts` — usar `type`, nunca `interface` |
| Componentes | `src/components/` |
| Estado | React local, sem persistência |
| Estilo | Tailwind 4 já configurado em `src/index.css` |
| Idioma da UI | Português (rótulos e `aria-label`) |
| Ícones | SVG inline no componente do toggle |

---

## 4. Modelo de dados

Arquivo: `src/types/chat.ts`

```ts
export type Sender = "user" | "robot";

export type ChatMessage = {
  id: string;
  text: string;
  sender: Sender;
  createdAt: number; // Date.now()
};
```

Regras:

- `id`: `crypto.randomUUID()`.
- `text`: string já com `trim()` no momento do envio; não persistir vazios.
- `sender`: valor do toggle **no instante do clique** em Enviar.
- Histórico: `ChatMessage[]` em ordem cronológica crescente (mais antiga no topo).

Estado da tela (pode viver em `App.tsx` neste MVP):

```ts
type ChatState = {
  messages: ChatMessage[];
  draft: string;
  sender: Sender; // default: "user"
};
```

O toggle **não** reseta após o envio. O draft **é** limpo após o envio.

---

## 5. Layout

```
┌─────────────────────────────────────────────┐  100vh, bg page
│           max-w-2xl (centralizado)          │
│  ┌───────────────────────────────────────┐  │
│  │  histórico (flex-1, overflow-y-auto)  │  │
│  │  — vazio: texto centralizado          │  │
│  │  — robô à esquerda / usuário à direita│  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │  composer (card branco, no rodapé)    │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

- Página: `min-h-dvh`, fundo da paleta, padding horizontal nas bordas da viewport (`px-4` ou equivalente).
- Coluna: `mx-auto w-full max-w-2xl min-h-dvh flex flex-col`.
- Histórico: `flex-1 overflow-y-auto` com padding interno; **não** posicionar o composer com `fixed` sobre as mensagens — o card é o último filho do flex, sempre visível no rodapé da viewport.
- Composer: largura 100% da coluna `2xl`.

---

## 6. Paleta (tokens Tailwind)

Escolha do PRD (não havia hex no dump):

| Superfície | Token | Uso |
| --- | --- | --- |
| Fundo da página | `bg-amber-100` | marrom claro |
| Card do composer | `bg-white` | + `shadow-md` + `rounded-2xl` |
| Borda modo usuário | `border-transparent` ou `border-stone-200` | default |
| Borda modo robô | `border-2 border-violet-500` | indicação obrigatória |
| Bolha usuário | `bg-stone-800 text-white` | alinhada à direita |
| Bolha robô | `bg-white text-stone-800` | alinhada à esquerda; `shadow-sm` |
| Rótulo / horário | `text-xs text-stone-500` | acima ou abaixo da bolha, no mesmo lado |
| Botão enviar ativo | `bg-stone-800 text-white` | hover `bg-stone-700` |
| Botão enviar disabled | `opacity-40 cursor-not-allowed` | sem submit |
| Toggle ativo (robô) | ícone `text-violet-600` | fundo `bg-violet-50` |

---

## 7. Composer

Card branco, altura cresce com o texto, sempre no rodapé da coluna.

```
[ toggle ]  [        textarea        ]  [ enviar ]
```

### 7.1 Toggle (esquerda)

- Um único botão que alterna `user` ↔ `robot`.
- Ícone: pessoa quando `sender === "user"`; robô quando `sender === "robot"`.
- `aria-pressed={sender === "robot"}`.
- `aria-label`: `"Enviar como robô"` / `"Enviar como usuário"` conforme o próximo clique ou o estado atual (documentar no código: label descreve o **estado atual**, ex. `"Remetente: usuário"`).
- Default: usuário.

Quando `sender === "robot"`, o **card inteiro** ganha borda violeta (`border-2 border-violet-500`).

### 7.2 Textarea

- Placeholder sugerido: `"Escreva uma mensagem"`.
- Altura mínima ~1 linha; cresce com o conteúdo (medir `scrollHeight`); teto sugerido: ~8 linhas, depois scroll interno.
- `Enter` **envia** a mensagem (mesmo fluxo do botão Enviar). `preventDefault` para não inserir newline.
- `Shift+Enter` **quebra linha** (comportamento nativo do textarea).
- Se o draft estiver vazio (após trim), `Enter` não envia e não insere linha em branco.
- Durante composição IME (`event.nativeEvent.isComposing` ou `keyCode === 229`), `Enter` não envia.
- Valor controlado: `draft`.

### 7.3 Enviar (direita)

- Desabilitado quando `draft.trim().length === 0`.
- Clique **ou** `Enter` no textarea (quando o envio é válido):
  1. ignora se disabled / draft vazio;
  2. cria `ChatMessage` com `sender` atual;
  3. faz append em `messages`;
  4. zera `draft`;
  5. textarea volta à altura mínima;
  6. histórico rola até a última mensagem.

Botão e teclado compartilham a mesma função `onSend`.

---

## 8. Histórico e bolhas

Cada item:

- **Alinhamento:** `user` → direita; `robot` → esquerda.
- **Rótulo:** `"Usuário"` ou `"Robô"`.
- **Horário:** `createdAt` formatado em `pt-BR` como `HH:mm` (`Intl.DateTimeFormat`).
- **Texto:** preservar quebras de linha (`whitespace-pre-wrap`).

Agrupamento visual sugerido (por mensagem, não por bloco):

```
Usuário · 14:32          (direita, text-xs)
┌──────────────────┐
│ texto da bolha   │
└──────────────────┘
```

### 8.1 Estado vazio

Quando `messages.length === 0`, o histórico mostra um texto centralizado na área de scroll (não um card):

- Copy: `"Nenhuma mensagem ainda"`
- Estilo: `text-stone-500 text-sm`, centralizado na área (`flex-1` + `items-center justify-center`)
- Some no instante em que a primeira mensagem entra na lista

### 8.2 Scroll automático

Obrigatório: após **cada** append, o histórico deve mostrar a mensagem recém-enviada.

- Implementação: `scrollIntoView({ block: "end" })` no último item, ou `container.scrollTop = container.scrollHeight`
- Disparar depois do React pintar a nova bolha (`useLayoutEffect` em `messages.length`, ou `ref` no último item)
- Também rolar quando a última mensagem cresce de altura (textarea multilinha já enviada)
- O composer permanece visível no rodapé; só o histórico rola

---

## 9. Acessibilidade mínima

- Toggle e Enviar são `<button type="button">`.
- Enviar disabled nativo (`disabled`), não só estilo.
- Textarea com `<label>` visualmente oculto ou `aria-label`.
- Contraste das bolhas e do fundo amber dentro do aceitável para texto de mensagem.

---

## 10. Estrutura de arquivos alvo

```
chat_offiline/src/
  App.tsx
  main.tsx
  index.css
  types/
    chat.ts
  components/
    ChatLayout.tsx      # coluna 2xl + fundo
    MessageList.tsx     # scroll + estado vazio
    MessageBubble.tsx   # alinhamento, rótulo, hora, texto
    Composer.tsx        # card + borda condicional
    SenderToggle.tsx    # ícone pessoa/robô
    SendButton.tsx
```

`App.tsx` concentra o estado e as funções `onToggleSender` / `onDraftChange` / `onSend`. Componentes são presentacionais.

---

## 11. Critérios de pronto

- [x] Mensagem de usuário aparece à direita com rótulo "Usuário" e horário.
- [x] Mensagem de robô aparece à esquerda com rótulo "Robô" e horário.
- [x] Toggle troca ícone e aplica/remove borda violeta no card.
- [x] Enviar desabilitado com draft vazio (incluindo só espaços).
- [x] `Enter` envia; `Shift+Enter` quebra linha; `Enter` com draft vazio não faz nada.
- [x] Sem mensagens: texto `"Nenhuma mensagem ainda"` centralizado; some após o primeiro envio.
- [x] Após cada envio, o histórico rola automaticamente até a última mensagem.
- [x] Composer permanece visível no rodapé; histórico rola independentemente.
- [x] Coluna limitada a `max-w-2xl` e centralizada em viewport larga.
- [x] Recarregar a página zera o histórico.
- [x] Types em `src/types` com `type`; UI em `src/components`.

---

## 12. Tarefas de implementação (ordem progressiva)

Cada tarefa pressupõe a anterior. Implementar e validar visualmente antes de avançar.

### T0 — Baseline (já feito)

Vite + React + TS + Tailwind operando. Não reabrir config salvo necessidade pontual (ex. `@theme` no CSS se quiser tokens nomeados).

### T1 — Types e esqueleto de pastas ✅

- [x] Criar `src/types/chat.ts` com `Sender` e `ChatMessage`.
- [x] Criar `src/components/` vazio (arquivos entram nas tarefas seguintes).
- [x] Exportar os types; nenhum `interface`.

**Pronto quando:** o projeto type-checka com os novos arquivos. — feito.

### T2 — Shell visual (layout sem comportamento) ✅

- [x] `ChatLayout`: fundo `bg-amber-100`, coluna `max-w-2xl mx-auto min-h-dvh flex flex-col`.
- [x] Área de histórico placeholder (div vazia `flex-1`).
- [x] Card branco no rodapé (ainda sem controles reais).

**Pronto quando:** em desktop a coluna está centrada e o card encostado no rodapé; em tela estreita há padding lateral. — feito.

### T3 — Composer estático ✅

- [x] `Composer` + `SenderToggle` + `SendButton` + textarea.
- [x] Toggle só troca ícone localmente (pode ser estado interno temporário).
- [x] Textarea com auto-resize.
- [x] Enviar visualmente disabled quando vazio.
- [x] `onKeyDown` no textarea: `Enter` sem Shift dispara envio (stub nesta tarefa); `Shift+Enter` quebra linha.

**Pronto quando:** digitação cresce o card; botão desabilita/habilita; ícone do toggle alterna. — feito.

### T4 — Estado visual do modo robô ✅

- [x] Borda `border-2 border-violet-500` no card quando o toggle está em robô.
- [x] Estilo extra no botão do toggle (`text-violet-600`, fundo `bg-violet-50`).

**Pronto quando:** a troca do toggle é óbvia sem ler o ícone. — feito.

### T5 — Estado real em `App` ✅

- [x] Subir `messages`, `draft`, `sender` para `App.tsx`.
- [x] Composer controlado por props.
- [x] `onSend` ainda pode ser no-op neste passo, mas a assinatura já recebe `draft` + `sender`.

**Pronto quando:** não há estado duplicado de draft/sender entre App e Composer. — feito.

### T6 — Enviar mensagem (append + limpar draft) ✅

- [x] Implementar `onSend`: trim, criar `ChatMessage`, append, limpar draft.
- [x] Botão Enviar e `Enter` (sem Shift) chamam a mesma `onSend`.
- [x] Toggle permanece no valor atual.
- [x] Recalcular altura do textarea após limpar.

**Pronto quando:** o array de mensagens cresce no React DevTools tanto pelo botão quanto por Enter (UI da lista ainda pode não existir). — feito.

### T7 — Lista e bolhas ✅

- [x] `MessageList` + `MessageBubble`.
- [x] Direita/esquerda, rótulo, horário `pt-BR` `HH:mm`, `whitespace-pre-wrap`.
- [x] Estado vazio: `"Nenhuma mensagem ainda"` centralizado; some após o primeiro envio.

**Pronto quando:** enviar como usuário e como robô produz os dois lados corretos, com hora e rótulo; a tela começa com o texto de vazio. — feito.

### T8 — Scroll automático do histórico ✅

- [x] Container com `overflow-y-auto`.
- [x] Após cada mensagem nova, rolar automaticamente até a última bolha (`scrollIntoView` ou `scrollTop = scrollHeight`).
- [x] Mensagens longas não empurram o composer para fora da viewport.

**Pronto quando:** uma sequência longa de mensagens deixa o composer visível e a última bolha sempre à vista após o envio. — feito.

### T9 — Acessibilidade e polimento ✅

- [x] `aria-label` / `aria-pressed` no toggle; `disabled` nativo no enviar.
- [x] Label do textarea.
- [x] Espaçamento entre bolhas, padding do histórico vs. card (`gap`/`p-4`).
- [x] Conferir hover/focus visível nos botões.

**Pronto quando:** os critérios da seção 11 estão todos marcados. — feito.

---

## 13. Ordem de dependência (resumo)

```
T0 (stack)
 └─ T1 types
     └─ T2 shell
         └─ T3 composer
             └─ T4 borda robô
                 └─ T5 estado App
                     └─ T6 send
                         └─ T7 bolhas
                             └─ T8 scroll
                                 └─ T9 a11y/polish
```

Não pular T5–T6 para “já desenhar bolhas”: a lista deve nascer ligada ao mesmo estado que o composer.
