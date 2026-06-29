---
title: "How to setup NeoVim for Java with AstroVim and remote debugging"
description: "Set up the NeoVim editor for developing Java applications"
pubDate: "Jun 29 2026"
heroImage: "../../assets/hero-images/java-nvim.jpg"
---

This tutorial will show you how to quickly configure NeoVim for developing Java applications that are running in Docker.
For more information please take a look at the official AstroVim [documentation](https://docs.astronvim.com/).

_Note: this guide is aimed at MacOs users, but most things will apply to Linux._

1. Make a backup of your current nvim config

```bash
mv ~/.config/nvim ~/.config/nvim.bak
```

2. Clean neovim folders

```bash
mv ~/.local/share/nvim ~/.local/share/nvim.bak
mv ~/.local/state/nvim ~/.local/state/nvim.bak
mv ~/.cache/nvim ~/.cache/nvim.bak
```

3. Clone the AstroNvim repository.

```bash
git clone --depth 1 https://github.com/AstroNvim/template ~/.config/nvim
rm -rf ~/.config/nvim/.git
nvim
```

4. Install the Java LSP. Open nvim and enter `:LspInstall java`

5. Install the language parser. Enter `:TSInstall java`

6. Download `lombok.jar` for lombok annotations support.

```bash
mkdir -p ~/Library/Application\ Support/lombok
curl -o ~/Library/Application\ Support/lombok/lombok.jar https://projectlombok.org/downloads/lombok.jar
```

7. Add the Lombok filepath to `~/.config/nvim/lua/plugins/astrolsp.lua`

```lua
---@type LazySpec
return {
"AstroNvim/astrolsp",
---@type AstroLSPOpts
opts = {
  -- Configuration table of features provided by AstroLSP
  features = {
    codelens = true,
    inlay_hints = false,
    semantic_tokens = true,
  },
  formatting = {
    format_on_save = {
      enabled = true,
      allow_filetypes = {
      },
      ignore_filetypes = {
      },
    },
    disabled = {
    },
    timeout_ms = 1000,
  },
  servers = {
  },
  config = {
    jdtls = {
      cmd = {
        "jdtls",
        "--jvm-arg=-javaagent:" .. vim.fn.expand "$HOME" .. "/Library/Application Support/lombok/lombok.jar",
      },
    },
  },
  handlers = {
  },
  autocmds = {
    lsp_codelens_refresh = {
      cond = "textDocument/codeLens",
      {
        event = { "InsertLeave", "BufEnter" },
        desc = "Refresh codelens (buffer)",
        callback = function(args)
          if require("astrolsp").config.features.codelens then vim.lsp.codelens.enable(true, { bufnr = args.buf }) end
        end,
      },
    },
  },
  mappings = {
    n = {
      gD = {
        function() vim.lsp.buf.declaration() end,
        desc = "Declaration of current symbol",
        cond = "textDocument/declaration",
      },
      ["<Leader>uY"] = {
        function() require("astrolsp.toggles").buffer_semantic_tokens() end,
        desc = "Toggle LSP semantic highlight (buffer)",
        cond = function(client)
          return client:supports_method "textDocument/semanticTokens/full" and vim.lsp.semantic_tokens ~= nil
        end,
      },
    },
  },
  on_attach = function(client, bufnr)
  end,
},
}
```

Now you should have code completetion for Java, as well as Lombok annotation recognition.

If you are running a Java application in Docker, you can use remote debugging with NeoVim.
I won't go into the details about how to set up your application for Docker, but I will show you how to set up NeoVim.

1. Open NeoVim and run `:MasonInstall java-debug-adapter`.
2. Create or edit `~/.config/nvim/lua/plugins/astrodap.lua`:

```lua
return {
  "mfussenegger/nvim-dap",
  dependencies = {
    "rcarriga/nvim-dap-ui",
  },
  config = function()
    local dap = require("dap")

    -- Define the configuration layout for Java
    dap.configurations.java = {
      {
        type = "java",
        request = "attach",
        name = "Docker: Debug Remote Java App",
        -- 'localhost' works because Docker maps port 5005 directly to your macOS host localhost loop
        hostName = "127.0.0.1",
        port = 5005,
      },
    }
  end,
}
```

3. Add Java Community Pack to `~/.config/nvim/lua/plugins/community.lua`

```lua
---@type LazySpec
return {
  "AstroNvim/astrocommunity",
  { import = "astrocommunity.pack.lua" },
  { import = "astrocommunity.pack.java" },
}
```

4. Quit NeoVim and reopen to load the configs.
5. Open a Java project and set a breakpoint `<Leader>db` and launch your Java application with Docker.
6. Press `F5` to start debugging and `<leader>du` to open the debugging UI.
