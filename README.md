## Projeto de Chat Anônimo :neckbeard:

### Objetivo :speech_balloon:
  Enviar mensagem não linkaveis e sem identificação de usuários
  
### Como funciona :trollface:
Utilizando um fluxo único de mensagens sobre uma blockchain é possível enviar texto para outros evitando a adulteração das mensagens durante o reenvio e rentabilizando aqueles que decidirem retransmitir os pacotes (rotear).

Para rodar utilize
```
npm install criptojs -g
node bc.js
```
### Fluxo base
Usuário gera 3 mensagens -> coloca no pacote -> entrega o pacote a rede (blockchain)

  Uma mensagem possui:
    - mensagem em texto plano
    - uma chave publica para resposta (que é gerada apenas para esta conversa)

  Cada participante entrega 1 pacote que deve ter 3 cartas ao blockchain.
  Caso não precise enviar 3 mensagens as outras duas serao geradas ou encaminhadas de outros

![](https://img.icons8.com/bubbles/2x/workflow.png)
### Repositório
```
Crawler_V1/
├─ classes/
│  ├─ letter.js
│  ├─ packet.js
│  ├─ blockchain.js
├─ src/
   ├─ bc.js
   ├─ message.js
   ├─ server.js (API)
```

### Código
  As classes do projeto são:
  - **Letter** - cartas que contém mensagens
  - **Packet** - que gerenciam o envio do pacote e sua criação com determinado numero de mensagens
  - **Blockchain** - que gerencia a mineração, ou seja, a adição de pacotes ao fluxo.

Obs: Como as mensagens só serão decriptadas pelo portador da chave privada, encaminhar mensagem de outras pessoas adiciona anonimato a quem realmente enviou a mensagem.
![](https://img.icons8.com/clouds/2x/todo-list.png)
### TODO
Atualmente o projeto está parado devido a limitação das chaves RSA em encriptar um número muito pequeno de bytes e a necessidade de o encaminhamento de uma mesnagem ser encriptado dobra o tamanho do pacote a cada encriptação. A arquitetura do projeto precisa ser modificada para comportar encriptação simétrica e troca da chave simétrica apenas usando a chave assimética RSA.
- [x] Definição e implementação das classes básicas message, packet e letter
- [x] Protótipo funcional de envio de mensagem em claro
- [x] Poc funcional com mensagem encriptada simetricamente
- [ ] PoC com mensagem anonima
- [ ] Poc funcional com mensagem encriptada simetricamente
