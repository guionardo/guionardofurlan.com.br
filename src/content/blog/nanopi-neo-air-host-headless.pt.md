---
title: 'NanoPi NEO Air com Debian 13 — da eMMC ao primeiro SSH'
description: 'Como instalar o Debian 13 na eMMC da NanoPi NEO Air, configurar Wi-Fi e SSH antes do primeiro boot e guardar o microSD para recuperação.'
date: 2026-11-15
slug: nanopi-neo-air-host-headless
tags: [nanopi, allwinner-h3, debian, emmc, linux, embarcados, wifi]
draft: false
lang: pt
translationKey: nanopi-neo-air-host-headless
---

## Um cartão para instalar e recuperar

A primeira vez que liguei a NanoPi NEO Air, o sistema da memória interna reiniciava em loop. A placa não tem HDMI nem porta Ethernet, e o adaptador serial da bancada perdia a conexão no meio do boot. Para descobrir o que estava acontecendo, eu precisava primeiro de um sistema ao qual conseguisse me conectar.

Preparei um microSD que já subia com o Wi-Fi da minha rede e a minha chave SSH. A partir dele, consegui gravar a eMMC, montar a memória interna e configurar o Debian antes de ligá-lo pela primeira vez. No fim, tirei o cartão, liguei a placa e entrei por SSH. O cartão ficou guardado para quando eu precisasse consertar alguma coisa na eMMC.

Este tutorial segue o caminho que validei na bancada com a **NanoPi NEO Air de 8 GB**, o **Debian 13 (trixie)** e o kernel **4.14.111** da imagem da FriendlyElec. Todo o trabalho é feito no computador Linux e pela rede local.

[Veja a foto da placa na wiki da FriendlyElec](https://wiki.friendlyelec.com/wiki/index.php/File:NanoPi_NEO-AIR-1.jpg).

## 1. Separe o material e baixe a imagem

- NanoPi NEO Air com antena Wi-Fi conectada e fonte microUSB de 5 V / 2 A.
- Computador Linux com Git, Bash e leitor de microSD.
- Cartão microSD de pelo menos 16 GB. A imagem ocupa cerca de 14 GiB quando descompactada.
- Rede Wi-Fi de 2,4 GHz com WPA2 e DHCP. O computador precisa conseguir alcançar a placa nessa rede.

Na área **01_Official images** da FriendlyElec, procure o arquivo `h3-eflasher-debian-trixie-core-4.14-armhf-20260330.img.gz`. A variante **eflasher** traz o sistema que será gravado na eMMC. Mantenha o arquivo compactado. [Wiki da NanoPi NEO Air e link para os downloads](https://wiki.friendlyelec.com/wiki/index.php/NanoPi_NEO_Air#Downloads)

**A instalação apaga o microSD e substitui o conteúdo da eMMC.** Faça backup do que quiser guardar nos dois antes de começar.

## 2. Prepare o microSD no computador

Clone o repositório e coloque a imagem baixada na pasta `images/` dele.

```bash
git clone https://github.com/guionardo/nanopi-neo-air.git
cd nanopi-neo-air
mkdir -p images
```

Rode o comando abaixo antes e depois de conectar o leitor com o cartão. Use o tamanho, o modelo e o dispositivo que apareceu para identificar o disco inteiro. Se o cartão apareceu como `/dev/sdb`, por exemplo, `/dev/sdb1` é uma partição dele.

```bash
lsblk -p -o NAME,SIZE,MODEL,TYPE,MOUNTPOINTS
```

Defina os valores abaixo no terminal. **Troque `/dev/sdb` pelo dispositivo que você acabou de identificar.** O SHA-256 corresponde ao arquivo exato usado nesta instalação.

```bash
export SD_DEV=/dev/sdb
export IMAGE="$PWD/images/h3-eflasher-debian-trixie-core-4.14-armhf-20260330.img.gz"
export IMAGE_SHA256=7e2943e4ae401693cd560d5cb9186f2e3984b886613eeb4c66bc75d3749c2fd1
export HOSTNAME_NEW=nanopi
./install.sh check
```

Informe o SSID com as mesmas maiúsculas e minúsculas usadas no roteador. Digite a senha quando o instalador pedir. Ela fica em `install.conf`, com permissão `600` e fora do Git. Se o script identificar ferramentas faltando, ele pode tentar instalá-las pelo gerenciador de pacotes. Use `--skip-deps` se preferir administrar essas dependências manualmente.

Com a checagem concluída, rode no mesmo terminal:

```bash
./install.sh card
```

O script usa `sudo` para gravar o cartão e pede que você digite o caminho do disco para confirmar. Ele instala no cartão o firmware do Wi-Fi, o perfil da sua rede e a chave pública para o SSH. Usa `~/.ssh/id_ed25519` por padrão, gerando o par de chaves se ele ainda não existir. Para usar outra chave, defina `SSH_KEY` com o caminho da privada antes de rodar o instalador.

## 3. Grave a eMMC e configure o Debian pelo cartão

1. Com a placa desligada, coloque o microSD e ligue a fonte. A primeira inicialização pelo cartão grava a eMMC automaticamente. Reserve cerca de 15 minutos para essa etapa e espere a placa desligar sozinha. A escrita do cartão no computador foi uma etapa anterior e levou cerca de 22 minutos na minha bancada.
2. Ligue a placa de novo **com o cartão ainda inserido**. Consulte a lista de clientes DHCP no roteador para encontrar o IP que ela recebeu. O cartão preparado se desarma antes de gravar e continua disponível como sistema de manutenção.
3. No computador, ajuste a linha `BOARD_IP` em `install.conf` com o IP do cartão, por exemplo `BOARD_IP=192.168.1.50`. Em seguida, rode o comando abaixo. Esta fase confere a gravação e configura o sistema na eMMC.

```bash
./install.sh net
```

Procure a confirmação `eMMC gravada e verificada (verify=ok)` no terminal. Ela vem do registro `FLASH_DONE verify=ok` em `/root/flash-emmc.log`, no cartão. Se a confirmação faltar ou aparecer um erro de gravação, confira o log antes de seguir.

Com o sistema do cartão rodando, o instalador monta a eMMC e configura o hostname, o firmware, a rede e o SSH. É nessa fase que a chave pública do cartão também vai para a eMMC. O script configura o SSH da eMMC para recusar autenticação por senha ao instalar a chave. No final, ele desliga a placa.

## 4. Tire o cartão e confirme o primeiro SSH

Com a placa desligada, retire o microSD e ligue a fonte. O sistema na eMMC pode receber outro IP. Consulte o roteador de novo, atualize `BOARD_IP` em `install.conf` e use esse mesmo endereço no comando SSH. Se escolheu outra chave, ajuste também o argumento `-i`.

```bash
./install.sh verify
ssh -i ~/.ssh/id_ed25519 root@192.168.1.51
```

Na bancada, a verificação mostrou a raiz em `overlay`, o boot pela eMMC, a rede Wi-Fi associada e zero unidades do systemd em falha. A raiz em `overlay` é esperada nessa imagem: o Debian combina a partição base com uma camada gravável em `userdata`. A eMMC apareceu como `mmcblk0` no boot sem cartão e como `mmcblk1` quando a placa estava rodando pelo microSD. Confira com `lsblk` antes de montar qualquer partição à mão.

## O Wi-Fi apareceu antes de funcionar

O primeiro sinal parecia bom: o Linux mostrava `wlan0`. Mesmo assim, o `wpa_supplicant` registrava `Failed to initiate sched scan` e a placa nunca chegava a se associar ao roteador. Sem associação, o erro de DHCP que aparecia em seguida era consequência.

O AP6212 usa o chip BCM43430, e o driver `brcmfmac` carrega dois arquivos: o firmware `brcmfmac43430-sdio.bin` e o `brcmfmac43430-sdio.txt`, chamado NVRAM. Esse arquivo de texto carrega parâmetros de calibração do módulo. O que estava instalado pertencia a outro módulo com o mesmo chip. Entre as diferenças, o arquivo usado pelo AP6212 trazia `xtalfreq=26000`, enquanto o outro trazia `37400`.

Troquei o arquivo inteiro pelo NVRAM do AP6212 e o rádio voltou a encontrar redes. Em seguida, corrigi a grafia do SSID para concluir a associação. Foi daí que veio a decisão de instalar o mesmo par de arquivos de firmware tanto no cartão quanto na eMMC. [Origem dos arquivos e detalhes da calibração](https://github.com/guionardo/nanopi-neo-air/tree/main/firmware)

## Se a placa não aparecer na rede

| Onde parou | O que conferir |
| --- | --- |
| O cartão não passa na checagem | Confira o dispositivo em `lsblk`, a capacidade do microSD e se o SHA-256 corresponde à imagem escolhida. |
| O cartão dá boot, mas a placa não ganha IP | Confira a antena, o SSID, a senha e a banda de 2,4 GHz. Sem IP no cartão, o provisionamento por SSH ainda não tem por onde entrar. |
| O cartão responde, mas a gravação não foi confirmada | Consulte `/root/flash-emmc.log` enquanto estiver conectado ao sistema do cartão. Se a gravação falhou, investigue a causa antes de preparar uma nova tentativa. |
| O cartão responde por SSH, mas o Debian na eMMC não | Confira primeiro o novo IP no roteador. Se continuar sem acesso, desligue a placa, recoloque o cartão já usado e entre por SSH nele para examinar o sistema da eMMC. |

Guarde o microSD depois da instalação. Ele já tem sua rede e sua chave pública e pode voltar à placa quando você precisar montar a eMMC para recuperar o acesso. Se a ideia é diagnosticar o sistema que está lá, reutilize o cartão como está: rodar `./install.sh card` novamente rearma a gravação para o próximo boot.

O teste que fechou o projeto foi simples: reiniciei a placa sem o microSD e consegui entrar pela mesma chave. A partir daí, eu tinha duas formas de chegar ao sistema: SSH direto na eMMC para o dia a dia, e SSH pelo cartão para recuperar a instalação.

[Documentação do instalador](https://github.com/guionardo/nanopi-neo-air/blob/main/docs/15-instalador.md) · [Log da instalação em Debian 13](https://github.com/guionardo/nanopi-neo-air/blob/main/docs/12-log-de-bordo.md#sessão-15--2026-11-15--trixie-na-emmc-gravar-provisionar-e-verificar)
