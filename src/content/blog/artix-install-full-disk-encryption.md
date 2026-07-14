---
title: "How to install Artix with full disk encryption"
description: "A guide on how to install Artix Linux with full disk encryption"
pubDate: "Jul 14 2026"
heroImage: "../../assets/hero-images/artix.jpg"
tags: ["linux", "privacy", "artix", "tutorial", "installation"]
---

I recently replaced Linux Mint with Artix and runit as my init system.
The tutorial I followed was [this](https://videos.lukesmith.xyz/w/n1cMQYYzwPoegM2oXfz2iC) video by Luke Smith.
It shows how to install Artix with full disk encryption. This post is a written version of that tutorial,
with some troubleshooting of problems that I personally ran into during the installation.

This guide is aimed at installing Artix on a UEFI system. If you are using legacy boot you can follow along with the video.

### Download the ISO and create a bootable USB.

I downloaded the base ISO with runit from [artixlinux.org](https://artixlinux.org/), but you can choose a different option as well.

After the download is finished, insert a USB into your computer and run

```bash
lsblk
```

This will list drives; find your USB.  
Then run the following command as root to write the ISO to the USB. Make sure you select the right device:

```bash
# Replace /dev/sdc with the actual USB and also replace the ISO name.
dd if=artix-base-runit-20260402-x86_64.iso of=/dev/sdc status=progress bs=2M
sync
```

After this has finished, reboot your PC and open the boot option. Getting to the boot options is different for different PCs.
Usually you rapidly press a key like ESC, F2, F9 or DEL while the computer is booting.
Select the USB to boot from.

Once you are booted from the USB you can login as `root` with password `artix`

Before you continue the installation, you should check whether your system has legacy boot or UEFI.
Run the following command, if it returns no results, that means your system has legacy boot, if it returns anything, that means your system has UEFI.

```bash
ls /sys/firmware/efi/efivars
```

### Create partitions

You will create two partitions. The first partition will be 1GB in size. This partition will be used to boot from and decrypt your disk.
The second partition will be encrypted, this is the partition you will install Artix to.

First we will create the boot partition.
Run `lsblk` to identify on which drive you want to install Artix.

Then run the following to format the disk, make sure to use the right device.

```bash
# replace 'sdc' with the disk you choose to install the OS on.
fdisk /dev/sdc
```

This will start the fdisk utility. Press `d` to delete partitions that are already on the disk.
You might need to press `d` multiple times, depending on the number of partitions on the disk.

To create the boot partition, press `n` to add a new partition. You can use the default values for _partition number_ and _first sector_.
For the _last sector_ you will enter `+1G` to create a partition of 1GB.

Then create a second partition for the OS by pressing `n` again. You can choose the default options.
When fdisk asks whether you want to remove the signature you can answer yes. Note that this will erase all existing data on the disk.

When you are done press `w` to write the new partitions. When you run `lsblk` again you should see the two partitions you created.

Next we will need a filesystem on the boot partition.
Run the following command to create a FAT32 filesystem:

```bash
# replace 'sdc1' with the boot partition.
mkfs.vfat -F 32 /dev/sdc1
```

When you create an encrypted partition, it is best practice to completely wipe the drive.
This can take multiple hours to complete. If you choose to do this, run the command:

```bash
# replace 'sdc2' with the OS partition.
dd if=/dev/urandom of=/dev/sdc2
```

Next we encrypt the OS partition. It will prompt you for a password, obviously you don't choose something easily guessable.

```bash
# replace 'sdc2' with the OS partition
cryptsetup luksFormat /dev/sdc2
```

Before you can proceed to actual installation of Artix, you need to decrypt the OS partition.
Run the following command and enter the password:

```bash
# replace 'partitionname' with a name for your partition.
cryptsetup open /dev/sdc2 partitionname
```

Create a filesystem and mount the partitions:

```bash
mkfs.btrfs /dev/mapper/partitionname
mount /dev/mapper/partitionname /mnt
```

Create a boot directory and mount the boot partition:

```bash
mkdir /mnt/boot
mount /dev/sdc1 /mnt/boot
```

If you run `lsblk` again you should see that both partitions now have a mountpoint.

After you have created the partitions, filesystems and mountpoints, you can get started with the actual installation.
If your pc is connected to the internet via an ethernet cable, you can skip the WiFi setup instructions.

### Connect to wifi

Run the following command to set up a wpa passphrase:

```bash
wpa_passphrase "YOUR_SSID" "YOUR_PASSWORD" > /etc/wpa_supplicant/wpa_supplicant.conf
```

Then start the `wpa_supplicant` to connect to WiFi:

```bash
wpa_supplicant -B -i wlan0 -c /etc/wpa_supplicant/wpa_supplicant.conf
```

Get an IP address:

```bash
dhcpcd wlan0
```

Verify internet connection:

```bash
ping -c 3 duckduckgo.com
```

### Installing Artix Linux

To install the necessary packages run the following command:

```bash
basestrap -i /mnt base base-devel runit elogind-runit linux linux-firmware grub networkmanager networkmanager-runit cryptsetup lvm2 lvm2-runit neovim vim efibootmgr
```

Next start a session on the system that you are installing Artix on:

```bash
artix-chroot /mnt bash
```

To set a timezone on the system you can run the following command:

```bash
ln -s /usr/share/zoneinfo/path/to/timezone /etc/localtime
```

You can also see which timezones are available by running `ls -l` on the timezone directory:

```bash
ls -l /usr/share/zoneinfo
```

Sync the hardware clock:

```bash
hwclock --systohc
```

To set a language and locale you must edit `/etc/locale.gen` and uncomment the locales you wish to use.

```bash
vim /etc/locale.gen
```

Then generate locales:

```bash
locale-gen
```

Then edit `locale.conf` to add a language:

```bash
vim /etc/locale.conf
```

Add the following lines:

```bash
LANG="en_US.UTF-8" # Or other language
LC_COLLATE="C"
```

The next steps will configure the hostname and hosts file:
Set the hostname for the system:

```bash
echo "yourhostname" > /etc/hostname
```

Add localhost to the `/etc/hosts` file:

```bash
vim /etc/hosts
```

Add the following lines to the hosts file if they are not already present:

```bash
127.0.0.1  localhost
::1        localhost
127.0.1.1  yourhostname.localdomain yourhostname
```

After that you can enable the network manager:
_This step will be different depending on the init system you have chosen. The command below works for `runit`_

```bash
ln -s /etc/runit/sv/NetworkManager /etc/runit/runsvdir/current/
```

To set a password for the root user, enter this command:

```bash
pass
```

This will prompt you to enter a password and repeat it for confirmation.

You can also create an optional secondary user by running `useradd` and `pass` again and specifying a username:

```bash
useradd -G wheel -m yourusername
pass yourusername
```

### Decrypt drive when booting

When the system is booting, it should prompt you for your decryption password.
To enable this, we need to make a few changes.

First edit `/etc/mkinitcpio.conf`

```bash
vim /etc/mkinitcpio.conf
```

Scroll down to the list that contains the list of HOOKS.
Add the following hooks somewhere near the end of hooks:

```bash
HOOKS=(... encrypt lvm2)
```

Then update mkinitcpio:

```bash
mkinitcpio -p linux
```

The next steps are somewhat tricky, so pay close attention. I would recommend following the video version of the tutorial for this section.
[Video](https://videos.lukesmith.xyz/w/n1cMQYYzwPoegM2oXfz2iC?start=30m59s)

We need to get the UUIDs of the disks and output them to grub.
Make sure to use double `>>` instead of single `>` to append to the file instead of overwriting:

```bash
lsblk -f >> /mnt/etc/default/grub
```

Then run the following to generate `fstab` so the boot drive can be mounted:

```bash
fstabgen -U /mnt >> /mnt/etc/fstab
```

Now edit the grub file that has the UUIDs added to it:

```bash
vim /etc/default/grub
```

The output from `lsblk -f >> /mnt/etc/default/grub` is at the bottom of the file.
You need the UUID of the encrypted disk and also the UUID of the decrypted part of that disk.
Move these UUIDs somewhere to the top of the file near `GRUB_CMDLINE_LINUX_DEFAULT=...` and comment them out with `#` so they don't break anything.

Edit that line by adding the UUIDs like so:

```bash
# <existing items> is a placeholder, don't add it.
GRUB_CMDLINE_LINUX_DEFAULT=<existing items> cryptdevice=UUID=<add UUID of encrypted partition>:<the name of your encrypted partition> root=UUID=<add UUID of decrypted partition>
```

_Make sure to clean up any other output from `lsblk -f` as this will mess up your grub file_

The next step is to install GRUB. The video from Luke Smith shows how to do this for Legacy boot.
Below are the steps for UEFI boot:

Create an `efi` boot directory and mount it:

```bash
mkdir -p /boot/efi
mount /dev/sda1 /boot/efi
```

Then run the `grub-install` command:

```bash
grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=grub
```

Then make the GRUB configuration:

```bash
grub-mkconfig -o /boot/grub/grub.cfg
```

You are now done with installing Artix Linux, congratulations.
Take out the installation USB drive and reboot the system:

```bash
reboot
```

If everything has gone according to plan, you should be able to login with your user.

### Setting up wifi after installation

After completing the installation, I set up an internet connection by starting the network service:

\*This step will be different depending on the init system you choose, I chose `runit`.

```bash
ln -s /etc/runit/sv/NetworkManager /etc/runit/runsvdir/current/
```

After that I connected to wifi by running the following command:

```bash
nmtui
```

### Installing a window manager

Right now the Artix installation has no graphical interface. You can use a window manager or desktop environment of your choosing.
I like to use LARBS to install DWM as a window manager alongside some other applications like a web browser and file manager.

Run the following commands to get the LARBS installation script and start it:

```bash
curl -LO larbs.xyz/larbs.sh
sh larbs.sh
```

LARBS will guide you through the setup and when it is done you will have a basic window manager.
You can press `super + F1` to open a document with some documentation for DWM and other applications that were installed through LARBS.

### Troubleshooting outdated PGP keyrings

When I was installing Artix, I had an outdated keyring on the ISO.
It took multiple attempts to install my packages with `basestrap`

I first tried to update the package databases:

```bash
pacman -Sy
```

Then I tried to install the new keyrings:

```bash
pacman -S artix-keyring archlinux-keyring
```

After that I tried to reset PGP and initialize the keyring:

```bash
killall gpg-agent
rm -rf /etc/pacman.d/gnupg
pacman-key --init
pacman-key --populate artix archlinux
```

Then I tried to synchronize the time and retried installing the keyrings:

```bash
ntpd -qg
```

Finally I disabled signature verification altogether:

```bash
nano /etc/pacman.conf
```

```bash
# I edited the SigLevel for multiple levels by setting it to Never
SigLevel = Never
LocalFileSigLevel = Never
RemoteFileSigLevel = Never
```

Then I was able to install the packages using basestrap
