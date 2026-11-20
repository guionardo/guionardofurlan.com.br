---
title: 'NanoPi NEO Air with Debian 13 — From eMMC to your first SSH login'
description: 'Install Debian 13 on the NanoPi NEO Air’s eMMC, configure Wi-Fi and SSH before the first boot, and keep the microSD card for recovery.'
date: 2026-11-15
slug: nanopi-neo-air-debian-13-headless
tags: [nanopi, allwinner-h3, debian, emmc, linux, embedded, wifi]
draft: true
lang: en
translationKey: nanopi-neo-air-host-headless
---

## One card for installation and recovery

The first time I powered on the NanoPi NEO Air, the system on its internal storage kept rebooting. The board has no HDMI or Ethernet port, and my serial adapter lost its connection partway through boot. Before I could find out what was going on, I needed a system I could connect to.

I prepared a microSD card that booted with my Wi-Fi settings and SSH key already in place. From there I could flash the eMMC, mount it, and configure Debian before its first boot. Then I took out the card, powered on the board, and logged in over SSH. I kept the card in case I ever needed to repair the installation.

This guide follows the procedure I tested on the **8 GB NanoPi NEO Air** with **Debian 13 (trixie)** and the **4.14.111** kernel from FriendlyElec’s image. You’ll work from a Linux computer over your local network.

[See the board photo on the FriendlyElec wiki](https://wiki.friendlyelec.com/wiki/index.php/File:NanoPi_NEO-AIR-1.jpg).

## 1. Gather the hardware and download the image

- A NanoPi NEO Air with its Wi-Fi antenna connected and a 5 V / 2 A micro-USB power supply.
- A Linux computer with Git, Bash, and a microSD card reader.
- A microSD card of at least 16 GB. The image expands to about 14 GiB.
- A 2.4 GHz Wi-Fi network with WPA2 and DHCP. Your computer must be able to reach the board on that network.

In FriendlyElec’s **01_Official images** section, find `h3-eflasher-debian-trixie-core-4.14-armhf-20260330.img.gz`. The **eflasher** variant contains the system that will be written to the eMMC. Keep the file compressed. [NanoPi NEO Air wiki and download link](https://wiki.friendlyelec.com/wiki/index.php/NanoPi_NEO_Air#Downloads)

**Installation erases the microSD card and overwrites the eMMC.** Back up anything you want to keep from either device before starting.

## 2. Prepare the microSD card on your computer

Clone the repository and place the downloaded image in its `images/` directory.

```bash
git clone https://github.com/guionardo/nanopi-neo-air.git
cd nanopi-neo-air
mkdir -p images
```

Run the following command before and after plugging in the reader with the card inserted. Identify the whole device by checking its size, model, and the new entry. If the card appears as `/dev/sdb`, for example, `/dev/sdb1` is a partition on it.

```bash
lsblk -p -o NAME,SIZE,MODEL,TYPE,MOUNTPOINTS
```

Set these values in your terminal. **Replace `/dev/sdb` with the device you just identified.** The SHA-256 checksum is for the exact file used in this installation.

```bash
export SD_DEV=/dev/sdb
export IMAGE="$PWD/images/h3-eflasher-debian-trixie-core-4.14-armhf-20260330.img.gz"
export IMAGE_SHA256=7e2943e4ae401693cd560d5cb9186f2e3984b886613eeb4c66bc75d3749c2fd1
export HOSTNAME_NEW=nanopi
./install.sh check
```

Enter the SSID with the same capitalization shown on your router. Enter the password when prompted. The installer stores it in `install.conf`, with permissions set to `600` and the file excluded from Git. If any tools are missing, the script may try to install them through the package manager. Use `--skip-deps` if you prefer to manage those dependencies yourself.

Once the check completes, run this in the same terminal:

```bash
./install.sh card
```

The script uses `sudo` to write the card and asks you to type the device path to confirm. It installs the Wi-Fi firmware, your network profile, and your SSH public key on the card. It uses `~/.ssh/id_ed25519` by default and generates the key pair if it does not already exist. To use another key, set `SSH_KEY` to the private key path before running the installer.

## 3. Flash the eMMC and configure Debian from the card

1. With the board powered off, insert the microSD card and connect the power supply. The first boot from the card flashes the eMMC automatically. Allow about 15 minutes and wait for the board to shut down on its own. Writing the card on the computer was a separate step and took about 22 minutes on my bench.
2. Power the board on again **with the card still inserted**. Check your router’s DHCP client list for the board’s IP address. The card disarms the flash process before writing and remains available for maintenance.
3. On your computer, set `BOARD_IP` in `install.conf` to the card’s address, for example `BOARD_IP=192.168.1.50`. Then run the command below to check the flash and configure the system on the eMMC.

```bash
./install.sh net
```

Look for `eMMC gravada e verificada (verify=ok)` in your terminal. The script gets this confirmation from the `FLASH_DONE verify=ok` entry in `/root/flash-emmc.log` on the card. If the confirmation is missing or you see a write error, check the log before proceeding.

With the system on the card running, the installer mounts the eMMC and configures the hostname, firmware, network, and SSH. It copies the public key from the card to the eMMC and configures the eMMC’s SSH server to reject password authentication when it installs the key. Finally, it shuts down the board.

## 4. Remove the card and confirm SSH access

With the board powered off, remove the microSD card and reconnect the power supply. The eMMC system may get a different IP address. Check your router again, update `BOARD_IP` in `install.conf`, and use that same address in the SSH command. If you chose a different key, update the `-i` argument too.

```bash
./install.sh verify
ssh -i ~/.ssh/id_ed25519 root@192.168.1.51
```

On my bench, verification showed the root filesystem as `overlay`, boot from the eMMC, an associated Wi-Fi connection, and zero failed systemd units. The `overlay` root is expected with this image. Debian combines a base partition with a writable layer in `userdata`. The eMMC appeared as `mmcblk0` when booting without the card and as `mmcblk1` when the board was running from microSD. Check with `lsblk` before mounting a partition manually.

## The Wi-Fi interface showed up before the radio worked

At first things looked promising. Linux showed `wlan0`. But `wpa_supplicant` reported `Failed to initiate sched scan`, and the board never associated with the router. The DHCP error that followed was a consequence of that missing association.

The AP6212 uses the BCM43430 chip, and its `brcmfmac` driver loads two files: the firmware, `brcmfmac43430-sdio.bin`, and an NVRAM file called `brcmfmac43430-sdio.txt`. The text file contains calibration settings specific to the module. The installed file came from a different module with the same chip. One of the differences was that the AP6212 file specified `xtalfreq=26000`, while the other used `37400`.

I replaced the whole file with the AP6212 NVRAM, and the radio started finding networks again. Then I corrected the SSID spelling to complete the association. That’s why the installer puts the same pair of Wi-Fi firmware files on both the card and the eMMC. [File provenance and calibration details](https://github.com/guionardo/nanopi-neo-air/tree/main/firmware)

## If the board doesn’t show up on the network

| Symptom | What to check |
| --- | --- |
| The card fails the initial check | Check the device in `lsblk`, the card’s capacity, and whether the SHA-256 checksum matches the selected image. |
| The card boots but the board gets no IP address | Check the antenna, SSID, password, and 2.4 GHz band. The installer needs the card’s IP address to provision the board over SSH. |
| The card responds but flashing is unconfirmed | Check `/root/flash-emmc.log` while connected to the system on the card. If flashing failed, investigate before preparing another attempt. |
| SSH works from the card but fails from the eMMC | Check the router for the new IP address. If you still cannot connect, power off the board, reinsert the card you already used, and connect to it over SSH to inspect the eMMC system. |

Keep the microSD card after installation. It already has your network settings and public key, so you can boot from it and mount the eMMC to restore access. To diagnose the installation in place, reuse the card as it is. Running `./install.sh card` again rearms the flash for the next boot.

The final test was simple. I rebooted the board without the microSD card and logged in with the same key. That gave me two ways into the system: SSH directly into the eMMC for everyday use, and SSH into the card for recovery.

[Installer documentation](https://github.com/guionardo/nanopi-neo-air/blob/main/docs/15-instalador.md) · [Debian 13 installation log](https://github.com/guionardo/nanopi-neo-air/blob/main/docs/12-log-de-bordo.md#sessão-15--2026-11-15--trixie-na-emmc-gravar-provisionar-e-verificar)
