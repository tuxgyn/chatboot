# Projeto: chat offline

Projeto de uma janela única de chat em que eu consigo enviar mensagem como usuário e como robo (atrvés de um toglle do input de mensagem)

## Aspecto Técnicos

Projeto feito em Vite + React + Typescript + Tailwind
Todos os types salvos na psata src/types (usando type e não interface)
Todos os componentes salvos na pasat src/components
O Historico do chat deve estar em um state sem persistência

## Apectos visuais
 A tela tera um fundo um marron claro

 todo o chat (incluindo historico de mensagens e input) terão uma lagura máxima (2xl) , centralizado, em tela maior.
 O input será em um card com fundo branco e altura ajsutada conforme a mensagem
 O input será em um card com fundo branco e altura ajustada conforme a mensagem
O card ficará no canto inferior o tempo inteiro.

 Dentro do card o input, lado direito:
 --Botão de enviar, que fica desabilitado quando não tiver mensagem digitada.

 Dentro do card do input, do lado esquerdo:
 - Um botão que servirá com toggle para marcar se a mesagem enviada será via usuaário (e fica do lado direito do historico) ou robÔ ( e fica do lado esquerdo do gistorico)
 - Quando o toggle estiver ativado (robô) o card do input terá uma borda roxa, inidcando visualmente que a mensagem enviada será enviada como robô e não usuário.