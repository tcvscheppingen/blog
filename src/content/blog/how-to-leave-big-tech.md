---
title: "How to leave Big Tech and reclaim (some of) your privacy"
description: "In this post I will share some ways to leave big tech and regain control over your data"
pubDate: "Sep 24 2026"
heroImage: "../../assets/hero-images/private-sign.jpg"
tags: ["opinion", "privacy", "minimalism", "tutorial"]
---

Sometimes it seems like it is almost impossible to leave those services and products that harvest your data for profit.
Big Tech products offer a lot of convenience, seemingly for free, but we all know that in the end we pay with our privacy.
That is why I have decided to use as little of these services as possible and replace them with more privacy-friendly alternatives.

In this post I will share some great (and free) alternatives to commonly used products like Google Search and Windows.
All of these replacements can be used for free, but some of them have a paid version that offers more functionality like increased storage.
Where possible I have found European alternatives to replace their American counterparts.

### Level 1 - Browser & Search Engine

We all access the internet through a web browser, so this is a great tool for corporations to harvest your data.
It gets to see every page you visit and some browsers like Google Chrome and Microsoft Edge harvest that data to make a profit.
Replacing your browser with a more privacy respecting alternative, is one of the best _and_ easiest ways to reclaim some of your privacy.

There are a few browsers that I can recommend. Some of them are a drop-in replacement and some of them are a little harder to use.

The first browser I can recommend is [Helium Browser](https://helium.computer/), it ships with a built-in adblocker,
has a nice minimalist design and is quite fast. If you currently use Google Chrome, this would be the best replacement,
because Helium is based on Chromium, which is the engine underneath Google Chrome. This is both a pro and a con, because you are still somewhat dependent on Google.
On the other hand, this browser will feel very familiar to your old browser and you won't really have to get used to it.
Helium is quite new on the market and still in active development, but it works great for most basic browsing.

The second browser I want to recommend is [LibreWolf](https://librewolf.net/). This browser provides more privacy compared to Helium,
but it also requires a bit more effort to use. LibreWolf is based on Firefox, which removes the dependency on Google altogether.
By default LibreWolf will clear all site-data and cookies when the browser is closed. This reduces the amount of tracking significantly.
You can set websites to remember cookies and site-data, so you won't have to log out each time you reopen the browser.

The last browser recommendation is the most private out of the three, but also the least easy to use.
[Mullvad Browser](https://mullvad.net/en/browser) is developed by Swedish VPN company Mullvad together with the TOR project which makes the TOR browser.
It is designed to complement their VPN service, but can very well be used without it. It will erase all browser history,
site data and cookies when closed. This makes it less viable to use as a daily browser.
If you want to use this browser, I would recommend using it with a password manager to easily log in to your accounts after reopening the browser.

All three recommendations are open-source projects, which means the source code can be audited and inspected for security and privacy flaws.
I personally prefer LibreWolf for most daily browsing, as it is a nice middle ground between the other two recommendations.

Replacing your browser won't do much if you're still going to use Google Search or Bing. Replacing them is quite easy,
although it might take some getting used to.

The first search engine I am going to recommend is [DuckDuckGo](https://duckduckgo.com/).
They deliver great results and I usually find what I need quite quickly. The main downside for me is that they are still based in the United States
and therefore subject to American law, which isn't known for respecting privacy. DuckDuckGo also offers the ability to disable AI from search results
and can also filter AI images from image results.

A good alternative from Europe is [StartPage](https://www.startpage.com/). This search engine has been around for quite some time and is based
in the Netherlands. They deliver great results, although I find DuckDuckGo to be a bit better for some queries.
StartPage makes their revenue not by selling personalized ads and user data, but by selling context-based ads.
This means that all their ads are based on what you are actually looking for and not on data collected about your internet history.

The search engine I use requires some technical ability to set up. It is called [SearXNG](https://docs.searxng.org/) and is actually a meta-search engine.
It queries other search engines and returns the results in their own interface. That way your data is not tracked by the search engines themselves.
There are public instances of SearXNG, but I recommend [hosting your own instance locally](/blog/how-to-host-your-own-search-engine).
If you use a public instance you still share data with the host of the instance, who might not be trustworthy.
You can configure which engines are used by SearXNG in the configuration. I disable most search engines and this gives me pretty good results for most queries.
I still sometimes fall back to StartPage or DuckDuckGo, but SearXNG is my default engine.

### Level 2 - Operating Systems

If you already have replaced your browser and search engine and are ready for replacements that require a bit more set up,
I recommend replacing your operating system. There are so many options to choose from and almost all of them are better than Windows (or MacOS).
I will limit myself to just the options that I have tried in the past and like.

The first recommendation is not really a recommendation and more a 'lesser-of-two-evils'. If you are currently using Windows,
MacOS would be a slight step up in terms of privacy and security, but only a slight one.
If you have a Windows device, I would recommend replacing Windows with another alternative and don't spend money on a Mac.

The second (actual) recommendation would be [Zorin OS](https://zorin.com/os/) or [Linux Mint](https://linuxmint.com/).
Both of these are similar to Windows in terms of look and feel and are quite easy to use for people who have little technical knowledge.
They are both free to use, although Zorin OS has a paid Pro version, that comes with some software pre-installed and some layouts.
This Pro version is more like a way to support the developer and provide some convenience to the user,
since the bundled software can be installed for free.

In terms of privacy, I would recommend Zorin OS over Linux Mint,
because the Zorin OS developers [have stated](https://forum.zorin.com/t/statement-about-age-verification-laws/61052)
that they most likely will not implement age verification. Linux Mint is still discussing whether to implement this,
but I think it is still leagues better than Windows and MacOS.

My third recommendation for operating system is either [Artix](https://artixlinux.org/) or [EndeavourOS](https://endeavouros.com/).
Both of these Linux distributions are based on Arch Linux. This means that you are in complete control of your system, which is both good and bad.
On the one hand it means that you decide what is installed and what not. You get to configure the system however you like it.
On the other hand this means that you need to know what you are doing, otherwise things will break.

I don't recommend Arch based distributions for novices. One of the reasons for not recommending it, is the AUR, or Arch User Repository.
The AUR is a large repository of packages/software that are maintained by the community. This means that both good and bad actors can create packages.
Recently there has been an influx of malicious packages in the AUR and that is why I can only recommend Arch based distributions to those that are more experienced with Linux.

My final operating system recommendation is [Fedora Linux](https://fedoraproject.org/). This is a nice middle ground between the easy-to-use distributions like Linux Mint,
and distributions like Artix. Fedora gets a lot of updates earlier than Linux Mint and Zorin OS, but is more stable than Arch Linux. It is known for being quite secure.
There are different versions of Fedora and I recommend the version with KDE as a desktop environment, because it looks nice and is easy to use.

### Bonus level - Software for daily life

If you have completed both levels, you are on your way to reclaiming a large portion of your privacy.
This bonus level consists of some recommendations for replacing commonly used software and services like ChatGPT.

While I [recommend using as little AI as possible](/about-this-site), I still think AI can be useful in some cases.
Companies like OpenAI and Anthropic use your conversations with their chatbots to train their models.
In general these companies have proven themselves to be untrustworthy and unethical.

If you still want to use a chatbot and have a decent pc/laptop, you can install a local model. I personally have not installed more advanced models like Ollama or Qwen.
I sometimes use [Ensu by Ente](https://ente.com/blog/ensu/) for basic questions. It is not at the same level as ChatGPT or Gemini and it sometimes makes mistakes,
but for basic questions it is very usable. If you use a local model, your questions never leave your device.
It's also better for the environment, because no power-hungry data centers are involved.

Ente also has a [great replacement](https://ente.com/) for Google/Apple Photos.
They encrypt all your pictures before uploading them to their servers and don't store the keys to unlock them, according to their privacy policy.
Ente also has automatic facial recognition and that data also remains on your own devices.

If you want more recommendations for replacing Big Tech, check out [Privacy Tools](https://privacytools.io/) and use the _Break Up_ function to automatically suggest alternatives.
I also have some [more recommendations](/websites) on the website you are currently visiting.
