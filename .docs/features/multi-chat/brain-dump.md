##Features: Sigle-chat to Multi-chat

Preiso transformar o chat de conversa única para multiplas conversas.

### Aspectos técnicos
Vamos usar a bliblioteca zustand armazenando 2 informações
Organização dos dados:
-Zustand armazenando 2 informações:
    -Historico de cada conversa individualmente (com todas as informações do type menssage)
    Qual chat está ativo ( com um ID)
    -Qual chat está ativo.
A store do zustand deve ficar no src/stores.

## Fluxo de informações

Ao abrir o site, não estará em nenhum conversa (empty state).

### Aspectos visuais

No side bar teremos a lista das conversas em um botão para criar uma nova conversa.

Aidentificação do chat do sidebar e exibindo o proprio ID dele.

O sidebar ficará no lado esquerdo, sendo retaratil no celular (botão hambuger no canto superior esquerdo)

o Input fica desabilitado quando não há conversaa ativas (opacidade 50% e botãoes não funcionam)


