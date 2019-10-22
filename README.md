
OBJETIVO:
  Enviar mensagem anonimamente em um fluxo único utilizando uma blockchain para
evitar a adulteração de mensagens durante o reenvio

FLUXO DO CHAT:
  Gera 3 mensagens -> coloca no pacote -> entrega o pacote ao blockchain stream

Uma mensagem possui:
  - mensagem em texto plano
  - uma chave publica para resposta (que é gerada apenas para esta conversa)

Cada participante entrega 1 pacote que deve ter 3 cartas ao blockchain.
  Caso não precise enviar 3 mensagens as outras duas serao geradas ou encami-
nhadas de outros

As classes do projeto são:
Letter - cartas que contém mensagens
Packet - que gerenciam o envio do pacote e sua criação com determinado numero de mensagens
Blockchain - que gerencia a mineração, ou seja, a adição de pacotes ao fluxo.

Obs: Como as mensagens só serão decriptadas pelo portador da chave privada, encaminhar mensagem de outras pessoas adiciona anonimato a quem realmente enviou a mensagem.

Atualmente o projeto está parado devido a limitação das chaves RSA em encriptar um número muito pequeno de bytes e a necessidade de o encaminhamento de uma mesnagem ser encriptado dobra o tamanho do pacote a cada encriptação.
