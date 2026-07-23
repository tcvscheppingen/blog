---
title: "How to fix dummy output in Linux"
description: "A quick tutorial on how to fix sound problems in Linux"
pubDate: "Jul 23 2026"
heroImage: "../../assets/hero-images/muted-sound.jpg"
tags: ["linux", "sound", "arch", "tutorial", "troubleshooting"]
---

My laptop is a slightly older HP laptop from 2018 that works great, apart from the battery not holding any charge. I recently switched from Artix to CachyOS and had some problems with my sound. The installation only detected an NVIDIA device for sound output and otherwise showed the infamous _dummy output_.

After some searching I found a solution that worked for me. There were a lot of forum posts that helped solve the problem for many users, but not for me. 
I wanted to document my solution so I can easily reproduce it in case I need to fix my sound again after re-installing Linux. It might help you too.

---

### Step 1: Check kernel drivers

Use `lspci -k | grep -i audio` to check which kernel drivers are in use and which are available.
In my case the kernel was using SOF drivers instead of the legacy Intel drivers. 


### Step 2: Force the Legacy Intel Audio Driver
We will create a modprobe configuration rule to force the kernel to bypass the buggy SOF/SST drivers, fall back to the stable `snd-hda-intel` driver, and disable digital microphone conflicts that often cause hardware lockups.

1. Open (or create) a custom kernel module configuration file:
   ```bash
   sudo vim /etc/modprobe.d/intel-audio-fix.conf
   ```

2. Adding the following lines to the file solved it for me, but it might be different for you depending on the output of the command in step 1.
   ```text
   options snd-intel-dspcfg dsp_driver=1
   options snd-hda-intel dmic_detect=0
   blacklist snd_soc_skl
   blacklist snd_sof_pci_intel_cnl
   ```

3. Save and exit the editor.

### Step 3: Update the Initramfs
Because Linux distributions load audio drivers extremely early during the boot phase via a RAM disk, you must update your system's boot image so it registers the new configuration file immediately.

Run the command that matches your Linux distribution:

* For Ubuntu, Debian, Pop!_OS, Linux Mint:
  ```bash
  sudo update-initramfs -u
  ```
* For Arch Linux, Artix, CachyOS, Manjaro:
  ```bash
  sudo mkinitcpio -P
  ```

### Step 4: Perform a Cold Reboot
For the changes to take effect on the hardware and PCI controller level, completely restart your machine:
```bash
sudo reboot
```

---

### Verification

Once your system boots back up, verify that the kernel now properly communicates with your hardware:

1. Verify ALSA Devices:
   ```bash
   aplay -l
   ```
   Your internal Intel audio device should now be clearly listed as a playback card.

2. Verify Sound Server Status:
   ```bash
   wpctl status   # For PipeWire systems
   # OR
   pactl info     # For PulseAudio systems
   ```
   The "Dummy Output" should be gone, replaced by your actual laptop speakers and headphone jack. Hopefully this post helped you in solving sound issues in your Linux installation.
