# PRD — Single-chat para multi-chat

Documento de implementação da feature que transforma a janela única de conversa em **várias conversas independentes**, com lista lateral, conversa ativa e empty state inicial.

Fonte: `.docs/features/multi-chat/brain-dump.md`.

Baseline já existente: chat offline de conversa única (Vite + React + TypeScript + Tailwind), com envio como usuário ou robô. Reaproveitar composer, bolhas, scroll e regras de envio. Não reconfigurar o bootstrap.

---

## 1. Objetivo

Permitir que a mesma pessoa mantenha **várias conversas em memória**, criando e alternando entre elas, sem persistência.

Ao abrir o site:

- nenhuma conversa existe;
- nenhuma conversa está ativa;
- a área principal mostra empty state (não o composer).

O estado deixa de viver em `useState` no `App` e passa para uma **store Zustand** em `src/stores`.

---

## 2. Escopo

### 2.1 Inclui

- Instalar e usar **Zustand** (única biblioteca nova desta feature).
- Store com duas informações oficiais:
  - histórico de cada conversa (mensagens no type `ChatMessage` já existente);
  - qual chat está ativo (`id` ou `null`).
- Criar conversa nova (botão na lista).
- Alternar conversa clicando na lista.
- Empty state inicial: site abre **sem** conversa selecionada e **sem** conversa pré-criada.
- Lista lateral de conversas + área principal (histórico + composer da conversa ativa).
- Draft e toggle usuário/robô **por conversa**, para a troca de chat não vazar texto nem remetente.
- Reaproveitar o fluxo atual de envio (`trim`, `Enter` / `Shift+Enter`, IME, scroll automático, bolhas).

### 2.2 Fora de escopo

- Persistência (`localStorage`, backend, URL, middleware `persist` do Zustand).
- Excluir, arquivar, pin, buscar ou renomear conversa.
- Editar / apagar / retry de mensagem.
- Markdown, anexos, streaming, autenticação, roteamento.
- UI kit ou lib de ícones (SVG inline, como hoje).
- Criar a primeira conversa automaticamente no boot.

O dump visual corta em “Não se deve ter a primeira conversa de…”. Interpretação: **não inventar conversa no load**. A lista começa vazia; o usuário cria a primeira.

---

## 3. Convenções técnicas

| Item | Regra |
| --- | --- |
| App | `chatboot/` (Vite atual) |
| Types | `src/types/*.ts` — usar `type`, nunca `interface` |
| Componentes | `src/components/` |
| Store | `src/stores/` — Zustand, sem persist |
| Estado de tela | some o `useState` de `messages` / `draft` / `sender` do `App` |
| Estilo | Tailwind 4 já configurado em `src/index.css` |
| Idioma da UI | Português (rótulos e `aria-label`) |
| Ícones | SVG inline |

Zustand entra só porque o dump pede. Não adicionar Immer, Redux nem outra lib de estado.

---

## 4. Modelo de dados

Manter `src/types/chat.ts` como está:

```ts
export type Sender = "user" | "robot";

export type ChatMessage = {
  id: string;
  text: string;
  sender: Sender;
  createdAt: number;
};
```

Novo type em `src/types/conversation.ts`:

```ts
export type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
  draft: string;
  sender: Sender;
  createdAt: number;
};
```

Regras:

- `id`: `crypto.randomUUID()`.
- `title`: `"Nova conversa"` no create; após a **primeira** mensagem, vira o texto trimmed (máx. 28 caracteres; se cortar, acrescentar `…`). Não atualizar o título nas mensagens seguintes.
- `messages`: ordem cronológica crescente (mais antiga no topo), mesmas regras do PRD de chat único.
- `draft`: string controlada do composer daquela conversa; começa `""`.
- `sender`: `"user"` no create; o toggle **não** reseta após o envio.
- `createdAt`: `Date.now()` no create.

A store **não** guarda um único array global de mensagens. Cada conversa tem o próprio `messages`.

---

## 5. Store Zustand

Arquivo: `src/stores/chatStore.ts`.

Duas informações de domínio (como no dump) + actions:

```ts
type ChatStore = {
  conversations: Conversation[];
  activeConversationId: string | null;

  createConversation: () => string;
  selectConversation: (id: string) => void;
  setDraft: (draft: string) => void;
  toggleSender: () => void;
  sendMessage: (text: string, sender: Sender) => void;
};
```

### 5.1 Invariantes

- Boot: `conversations = []`, `activeConversationId = null`.
- `createConversation`:
  1. cria `Conversation` vazia;
  2. dá `unshift` na lista (mais recente no topo);
  3. define `activeConversationId` para o novo `id`;
  4. devolve o `id`.
- `selectConversation(id)`: só troca o id se a conversa existir; senão no-op.
- `setDraft` / `toggleSender` / `sendMessage`: no-op se `activeConversationId === null`.
- `sendMessage`:
  1. `trim`; ignora vazio;
  2. cria `ChatMessage` (`crypto.randomUUID()`, `Date.now()`, `sender` recebido);
  3. append em `conversations[active].messages`;
  4. zera `draft` **só** dessa conversa;
  5. se `messages` ficou com 1 item, atualiza `title`.

Seletores sugeridos (podem ser funções no mesmo arquivo):

```ts
const activeConversation = conversations.find((c) => c.id === activeConversationId) ?? null;
```

Componentes leem a store direto (`useChatStore`). `App` não re-centraliza estado.

---

## 6. Fluxo de informações

```
abrir o site
  → conversations [] / activeId null
  → empty state (sem composer)

[+ Nova conversa]
  → createConversation()
  → lista ganha item ativo
  → área principal mostra ChatLayout dessa conversa
  → histórico: "Nenhuma mensagem ainda"

clicar item da lista
  → selectConversation(id)
  → histórico, draft e toggle daquela conversa
  → scroll até a última mensagem (se houver)

digitar / toggle / Enter / Enviar
  → mesmas regras do chat único
  → mutação só na conversa ativa
```

Trocar de conversa **não** apaga o draft da conversa anterior. Voltar a ela restaura texto e remetente.

Recarregar a página zera tudo (sem persistência).

---

## 7. Layout

O card único atual (`w-96`, `h-[70vh]`) vira o **painel da conversa ativa**. À esquerda entra a lista.

```
┌──────────────────────────────────────────────────────────┐  100dvh
│          container central (max-w-4xl)                   │
│  ┌─────────────┐  ┌───────────────────────────────────┐  │
│  │ lista       │  │  conversa ativa  (card atual)     │  │
│  │ [+ Nova]    │  │  header                           │  │
│  │             │  │  histórico  OU  empty state       │  │
│  │  item       │  │  composer (só se houver ativa)    │  │
│  │  item       │  │                                   │  │
│  └─────────────┘  └───────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

- Página: `h-dvh`, fundo branco (já usado atrás do card), `px-4`.
- Container: `mx-auto flex h-[70vh] min-h-64 w-full max-w-4xl gap-3`.
- Lista: largura `w-64` (encolhe em tela estreita; em viewport `< md` a lista pode ficar `w-52`). Card com o mesmo visual do chat: `rounded-[20px] border border-stone-300 bg-amber-100 shadow`.
- No celular a lista é retrátil: hamburger no canto superior esquerdo abre/fecha o sidebar.
- Painel direito: o `ChatLayout` atual (mesma largura máxima `w-96` **ou** `flex-1` para ocupar o resto do container — preferir `flex-1` para não sobrar buraco).
- **Não** usar `position: fixed` no composer. Ele continua último filho do flex da conversa.

### 7.1 Lista de conversas

Header da lista: título `"Conversas"` + botão `"Nova conversa"` (`type="button"`).

Itens:

- Título (`title`) em uma linha, `truncate`.
- Identificação: `id` da conversa em `font-mono`.
- Preview opcional: última mensagem ou `"Sem mensagens"` em `text-xs text-stone-500`.
- Item ativo: fundo `bg-stone-800 text-white` (preview no ativo: `text-stone-300`).
- Item inativo: hover `bg-white/70`.
- Clique seleciona. Sem menu de contexto. Sem exclusão.

Lista vazia (ainda sem nenhuma conversa): texto `"Nenhuma conversa"` na lista, `text-sm text-stone-500`.

### 7.2 Empty state da área principal

Quando `activeConversationId === null`:

- **não** renderizar `MessageList`;
- `Composer` permanece visível, desabilitado (`opacity-50`, controles `disabled`);
- mostrar copy centralizada: `"Selecione ou crie uma conversa"`;
- estilo: `text-stone-500 text-sm`, `flex-1 items-center justify-center`;
- o header do card pode continuar com `"Assistente"`.

Quando há conversa ativa sem mensagens, vale o empty **interno** já existente: `"Nenhuma mensagem ainda"` + composer visível.

---

## 8. Paleta

Herdar o PRD do chat único. Novos tokens só para a lista:

| Superfície | Token | Uso |
| --- | --- | --- |
| Fundo da página | `bg-white` | já existente |
| Card lista / chat | `bg-amber-100` + `border-stone-300` | mesmo card |
| Item ativo | `bg-stone-800 text-white` | conversa selecionada |
| Item inativo + hover | `hover:bg-white/70` | |
| Empty states | `text-stone-500 text-sm` | lista vazia e painel sem ativa |
| Botão nova conversa | `bg-stone-800 text-white` | hover `bg-stone-700` |

Composer, bolhas e toggle **não mudam**.

---

## 9. Composer e envio

Comportamento idêntico ao PRD do chat único, com um vínculo extra: tudo opera sobre a **conversa ativa**.

- `draft` e `sender` vêm de `activeConversation`.
- `onDraftChange` → `setDraft`.
- `onToggleSender` → `toggleSender`.
- `onSend` → `sendMessage`.
- Sem conversa ativa, o composer fica desabilitado (`opacity-50`; textarea, toggle e enviar não funcionam).

Regras que **não** reabrir:

- `Enter` envia; `Shift+Enter` quebra linha; IME não envia.
- Enviar disabled com `draft.trim().length === 0`.
- Toggle não reseta após envio; draft daquela conversa zera.

---

## 10. Histórico, bolhas e scroll

`MessageList` e `MessageBubble` permanecem presentacionais: recebem `messages` da conversa ativa.

- Mesmo alinhamento (user direita / robot esquerda), rótulo, `HH:mm` `pt-BR`, `whitespace-pre-wrap`.
- Scroll automático após append **e** ao trocar de conversa (`useLayoutEffect` dependente de `messages` **e** de `activeConversationId`).
- Composer permanece no rodapé do card da conversa.

---

## 11. Acessibilidade mínima

- `"Nova conversa"` é `<button type="button">` com `aria-label="Nova conversa"`.
- Lista: `nav` ou `ul` com `aria-label="Conversas"`.
- Item: botão com `aria-current="true"` no ativo.
- Empty states com `role="status"`.
- Toggle e Enviar mantêm os `aria-*` atuais.

---

## 12. Estrutura de arquivos alvo

```
chatboot/src/
  App.tsx                      # só compõe layout + store
  types/
    chat.ts                    # inalterado
    conversation.ts            # Conversation
  stores/
    chatStore.ts               # Zustand
  components/
    ChatLayout.tsx             # vira o painel direito (flex-1)
    MultiChatLayout.tsx        # container lista + painel
    ConversationList.tsx       # header + botão + itens
    ConversationItem.tsx       # um item da lista
    EmptyChat.tsx              # "Selecione ou crie uma conversa"
    MessageList.tsx            # reaproveitado
    MessageBubble.tsx          # reaproveitado
    Composer.tsx               # reaproveitado
    SenderToggle.tsx           # reaproveitado
    SendButton.tsx             # reaproveitado
```

`App.tsx` deixa de ter `useState`. Lê `activeConversation` da store e decide entre `EmptyChat` e o par `MessageList` + `Composer`.

---

## 13. Critérios de pronto

- [x] Dependência `zustand` instalada; store em `src/stores/chatStore.ts`.
- [x] Recarregar a página começa com lista vazia, `activeConversationId === null` e copy `"Selecione ou crie uma conversa"`.
- [x] Nenhuma conversa é criada no boot.
- [x] `"Nova conversa"` cria item, seleciona e mostra `"Nenhuma mensagem ainda"` + composer.
- [x] Enviar mensagem só altera o histórico da conversa ativa.
- [x] Alternar conversas troca histórico, draft e toggle; o draft da conversa anterior permanece.
- [x] Título vira o recorte da primeira mensagem; próximas mensagens não renomeiam.
- [x] Item ativo visível na lista (`aria-current`).
- [x] Scroll automático no envio e na troca de conversa.
- [x] Composer, Enter, Shift+Enter, IME, borda violeta do modo robô e bolhas continuam iguais.
- [x] Recarregar zera conversas (sem persistência).
- [x] Types com `type`; UI em `src/components`; store em `src/stores`.
- [x] Sem exclusão, rename ou persistência.

---

## 14. Tarefas de implementação (ordem progressiva)

Cada tarefa pressupõe a anterior. Validar visualmente antes de avançar.

### T0 — Baseline (já feito)

Chat único operando: composer, bolhas, toggle, scroll. Não reabrir o fluxo de mensagem.

### T1 — Dependência e types

- [x] Instalar `zustand`.
- [x] Criar `src/types/conversation.ts`.
- [x] Não alterar o shape de `ChatMessage`.

**Pronto quando:** o projeto type-checka com o novo type.

### T2 — Store sem UI

- [x] `src/stores/chatStore.ts` com estado inicial vazio e as actions da seção 5.
- [x] `sendMessage` / `setDraft` / `toggleSender` no-op sem conversa ativa.

**Pronto quando:** as actions passam em um smoke manual (DevTools / console) sem renderizar lista ainda.

### T3 — Shell de dois painéis

- [x] `MultiChatLayout`: lista à esquerda, slot da conversa à direita.
- [x] `ChatLayout` passa a ocupar o painel direito (`flex-1`), sem mudar o visual interno.

**Pronto quando:** os dois cards aparecem lado a lado em desktop; em tela estreita não estouram a viewport.

### T4 — Empty state inicial

- [x] `EmptyChat` no painel direito quando `activeConversationId === null`.
- [x] `MessageList` **não** monta nesse estado; o composer fica visível e desabilitado.

**Pronto quando:** o first paint é o empty state, sem conversa inventada.

### T5 — Lista + criar + selecionar

- [x] `ConversationList` + `ConversationItem`.
- [x] Botão cria e já seleciona.
- [x] Clique troca `activeConversationId`.
- [x] Item ativo com destaque e `aria-current`.

**Pronto quando:** dá para criar duas conversas vazias e alternar o destaque na lista.

### T6 — Ligar o chat à conversa ativa

- [x] Remover `useState` de `App`.
- [x] `MessageList` e `Composer` leem/escrevem só a conversa ativa.
- [x] Envio, draft e toggle por conversa.

**Pronto quando:** mensagens de A não aparecem em B; voltar para A restaura draft e remetente.

### T7 — Título e preview

- [x] Título default `"Nova conversa"`.
- [x] Primeira mensagem atualiza o título (28 chars + `…`).
- [x] Preview do último texto (ou `"Sem mensagens"`) na lista.

**Pronto quando:** duas conversas com textos diferentes mostram títulos/previews distintos.

### T8 — Scroll na troca + a11y

- [x] `useLayoutEffect` também depende de `activeConversationId`.
- [x] `aria-label` da lista e do botão nova; `role="status"` nos vazios.
- [x] Conferir focus/hover do item e do botão.

**Pronto quando:** os critérios da seção 13 estão todos marcados.

---

## 15. Ordem de dependência (resumo)

```
T0 (chat único)
 └─ T1 zustand + types
     └─ T2 store
         └─ T3 shell dois painéis
             └─ T4 empty state
                 └─ T5 lista / create / select
                     └─ T6 ligar envio à conversa ativa
                         └─ T7 título / preview
                             └─ T8 scroll na troca + a11y
```

Não desenhar a lista em estado local paralelo: ela nasce lendo a mesma store que o envio vai mutar.
