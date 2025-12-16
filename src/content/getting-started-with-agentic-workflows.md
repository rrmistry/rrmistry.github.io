---
title: 'Getting Started with Agentic AI Workflows: A $0 Budget Guide for Non-Developers'
date: 2025-12-15
description: 'A beginner-friendly introduction to AI agentic workflows. Learn what providers, models, and MCP servers are, then build your first workflow for free using OpenCode, OpenRouter, and free MCP servers.'
tags:
  [
    'ai',
    'agentic-workflows',
    'beginner-guide',
    'llm',
    'mcp',
    'opencode',
    'openrouter',
    'tutorial'
  ]
---

<script>
	import Mermaid from '$lib/components/Mermaid.svelte';
</script>

I've had many colleagues ask me how to get started with Large Language Models (LLMs) and AI workflows. Most guides assume you're a developer or require expensive subscriptions. This guide is different - it's written for non-technical folks who want to understand and use AI workflows without spending a dime.

By the end of this post, you'll understand the key concepts and have a working setup to create content using AI - we'll even demonstrate it by drafting a blog post about "1 Year in New Zealand."

## The Big Picture: How AI Workflows Actually Work

Before diving into terminology, let's see how all the pieces fit together:

<Mermaid chart={`graph LR; A[You] --> B[Agentic Client]; B --> C[Agents]; C --> D[Provider API]; D --> E[Foundation Model]; E --> D; D --> C; C --> F[MCP Servers]; F --> G[Web Search]; F --> H[File System]; F --> I[Other Tools]; C --> B; B --> A`} />

Don't worry if this looks complex - we'll break down each component below.

---

## What is a Provider?

A **provider** is a company or service that gives you access to AI models through an API (Application Programming Interface). Think of it like your electricity provider - you don't need to build a power plant, you just plug in and use the electricity.

### Common Providers

| Provider | Models Available | Free Tier? | Notes |
| :------- | :--------------- | :--------- | :---- |
| OpenRouter | Many (Claude, GPT, Llama, etc.) | Yes | Aggregator - access multiple models |
| OpenAI | GPT-4, GPT-3.5 | Limited | Original ChatGPT maker |
| Anthropic | Claude 3.5, Claude 3 | No | Known for safety and reasoning |
| Google | Gemini | Yes | Good free tier |

<Mermaid chart={`graph TD; A[You want to use AI] --> B{Choose a Provider}; B --> C[OpenRouter]; B --> D[OpenAI]; B --> E[Anthropic]; B --> F[Google]; C --> G[Access to many models]; D --> H[GPT models only]; E --> I[Claude models only]; F --> J[Gemini models only]`} />

**For our $0 budget workflow, we'll use OpenRouter** because it aggregates multiple providers and offers free models.

---

## What is a Foundation Model?

A **foundation model** (also called a "base model" or just "model") is the actual AI that processes your requests. It's the "brain" that was trained on massive amounts of text and data.

Think of it like different car engines - a Toyota Corolla and a Ferrari both get you from A to B, but they have different capabilities, speeds, and fuel costs. Similarly, different AI models have different strengths.

### Popular Models You'll Encounter

| Model Family | Made By | Strengths | Best For |
| :----------- | :------ | :-------- | :------- |
| GPT-4 / GPT-4o | OpenAI | General knowledge, coding | All-around tasks |
| Claude 3.5 Sonnet | Anthropic | Reasoning, writing, safety | Long documents, analysis |
| Gemini | Google | Multimodal (text + images) | Research, visual tasks |
| Llama 3 | Meta | Open source, customizable | Privacy-conscious users |
| Mistral | Mistral AI | Fast, efficient | Quick tasks, lower cost |

### Model Sizes: Bigger Isn't Always Better

Models come in different sizes, often indicated by numbers like "7B" or "70B" (billions of parameters):

<Mermaid chart={`graph LR; A[Small Models 1-7B] --> B[Fast and Cheap]; C[Medium Models 7-30B] --> D[Balanced]; E[Large Models 30B+] --> F[Powerful]`} />

**For beginners**: Start with medium-sized models. They offer the best balance of capability and cost. Models like `meta-llama/llama-3.2-3b-instruct:free` on OpenRouter are free and surprisingly capable.

---

## What is Context Length?

**Context length** (or "context window") is how much information the AI can "remember" in a single conversation. Think of it like the AI's short-term memory.

### The Bookshelf Analogy

Imagine the AI has a bookshelf of a fixed size. Everything you say, everything it responds with, and any documents you share all need to fit on that shelf. Once the shelf is full, the oldest books fall off.

<Mermaid chart={`graph TD; subgraph Context Window; A[Your first message]; B[AI response]; C[Your second message]; D[AI response]; E[Document you shared]; F[Your latest question]; end; G[Older messages get pushed out] -.-> A`} />

### Context Lengths of Popular Models

| Model | Context Length | What That Means |
| :---- | :------------- | :-------------- |
| GPT-4 Turbo | 128K tokens | About 300 pages of text |
| Claude 3.5 Sonnet | 200K tokens | About 500 pages of text |
| Gemini 1.5 Pro | 1M tokens | About 2500 pages of text |
| Llama 3 (8B) | 8K tokens | About 20 pages of text |

### What's a Token?

A **token** is roughly 3/4 of a word. So "Hello, how are you today?" is about 6 tokens. When models advertise "128K context," that means about 96,000 words.

**Why this matters**: If you're working on a long document or want the AI to remember a long conversation, you need a model with a larger context window. For simple questions, even small context windows work fine.

---

## What is an Agentic Workflow Client?

An **agentic workflow client** (or "agentic AI client") is software that lets you interact with AI models and give them the ability to take actions - like searching the web, reading files, or executing code.

This is the key difference between a simple chatbot and an AI that can actually _do_ things for you.

### Regular Chatbot vs Agentic Client

| Feature | Regular Chatbot (ChatGPT web) | Agentic Client (OpenCode, Claude Code) |
| :------ | :---------------------------- | :------------------------------------- |
| Answer questions | Yes | Yes |
| Remember conversation | Yes | Yes |
| Search the web | Limited | Yes, with tools |
| Read files on your computer | No | Yes |
| Write and edit files | No | Yes |
| Run commands | No | Yes |
| Use external tools | No | Yes, via MCP |

<Mermaid chart={`graph TD; subgraph Regular Chatbot; A[You ask a question] --> B[AI thinks]; B --> C[AI responds with text]; end; subgraph Agentic Client; D[You give a task] --> E[Agent receives task]; E --> F{Need more info?}; F -->|Yes| G[Sub-agent searches/reads]; G --> E; F -->|No| H[Agent takes action]; H --> I[Creates files / Runs code]; I --> J[Reports results]; end`} />

### Understanding the Spectrum: Chatbots to Agentic Clients

It's important to understand that AI tools exist on a spectrum. Not everything called "AI assistant" is truly agentic:

**Web-Based Chatbots** (Not Agentic by Default)

| Tool | Cost | What It Is |
| :--- | :--- | :--------- |
| ChatGPT (web) | Free / Plus at 20 USD/mo | Conversational AI - can answer questions and generate text, but cannot access your files or run code on your computer |
| Claude.ai (web) | Free / Pro at 20 USD/mo | Similar to ChatGPT - great for writing and analysis, but runs in a sandboxed browser environment |
| Gemini (web) | Free / Advanced at 20 USD/mo | Google's chatbot - has some integrations but limited local access |

These are excellent tools, but they operate in isolation from your local system. They can integrate with some cloud services (Google Drive, etc.) if you configure them, but this is different from true agentic capabilities.

**True Agentic Clients** (Can Take Actions on Your System)

| Client | Cost | Difficulty | Capabilities |
| :----- | :--- | :--------- | :----------- |
| Claude Code | API costs (varies) | Medium | Terminal-based, full file system access, can run commands, MCP support |
| Cursor | Free tier / 20 USD/mo | Easy | IDE with AI, can edit code directly, runs in your project |
| Windsurf | Free tier / 15 USD/mo | Easy | Similar to Cursor, AI-powered code editor |
| OpenCode | Free (open source) | Medium | Terminal-based, 75+ providers, MCP support, cross-platform |

**For our $0 budget workflow**, we'll focus on tools that are truly free and agentic. The setup section will guide you through configuring an open-source agentic client with free model access.

### CLI vs IDE: Two Different Approaches

Agentic tools come in two main flavors, and understanding the difference helps you choose the right tool for your workflow:

**CLI-Based Tools** (Terminal-First)

| Tool | Provider | Key Strength |
| :--- | :------- | :----------- |
| <a href="https://docs.anthropic.com/en/docs/claude-code/overview" target="_blank">Claude Code</a> | Anthropic | Deep reasoning, multi-agent workflows |
| <a href="https://cli.github.com/copilot" target="_blank">GitHub Copilot CLI</a> | GitHub/Microsoft | Git integration, shell commands |
| <a href="https://ai.google.dev/gemini-api/docs/gemini-cli" target="_blank">Gemini CLI</a> | Google | Free tier, multimodal capabilities |
| <a href="https://opencode.ai/" target="_blank">OpenCode</a> | Open Source | 75+ providers, highly configurable |

**IDE-Based Tools** (Visual-First)

| Tool | Base | Key Strength |
| :--- | :--- | :----------- |
| <a href="https://cursor.com/" target="_blank">Cursor</a> | VS Code fork | Inline completions, visual diffs |
| <a href="https://codeium.com/windsurf" target="_blank">Windsurf</a> | VS Code fork | Team collaboration, JetBrains support |
| <a href="https://github.com/features/copilot" target="_blank">GitHub Copilot</a> | VS Code extension | Mature ecosystem, wide IDE support |

**Which Should You Choose?**

| If You... | Consider |
| :-------- | :------- |
| Work in terminals, SSH into servers, or run CI/CD pipelines | CLI tools (Claude Code, OpenCode, Gemini CLI) |
| Prefer visual feedback, inline suggestions, and familiar IDE workflow | IDE tools (Cursor, Windsurf, Copilot) |
| Want to automate large refactors across many files | CLI tools excel here |
| Do day-to-day coding with quick iterations | IDE tools are more comfortable |
| Work on headless servers or containers | CLI tools are your only option |
| Are new to AI coding assistants | IDE tools have a gentler learning curve |

Many developers use both - IDE tools for daily interactive coding and CLI tools for complex, autonomous tasks. There's no wrong choice; it depends on your workflow preferences.

---

## What are Agents and Sub-Agents?

In the context of agentic workflows, an **agent** is an AI assistant configured for specific tasks. Think of agents as specialized workers - each with their own expertise, tools, and permissions.

### How Agents Work in OpenCode

<a href="https://opencode.ai/docs/agents/" target="_blank">OpenCode implements a two-tier agent hierarchy</a>:

**Primary Agents** - The main assistants you interact with directly. OpenCode includes two built-in primary agents:

| Agent | Purpose | Tool Access |
| :---- | :------ | :---------- |
| **Build** | Default agent for development work | Full access - can read, write, edit files, run commands |
| **Plan** | Analysis and planning only | Restricted - can read but not modify code |

You can switch between primary agents using the Tab key in OpenCode.

**Sub-Agents** - Specialized assistants that primary agents can invoke for specific tasks. You can also trigger them manually with @ mentions:

| Sub-Agent | Purpose | When to Use |
| :-------- | :------ | :---------- |
| **General** | Research and complex questions | Multi-step research tasks |
| **Explore** | Fast codebase exploration | Finding files, patterns, understanding structure |

<Mermaid chart={`graph TD; A[You] --> B[Primary Agent - Build]; A --> C[Primary Agent - Plan]; B --> D[Sub-Agent - General]; B --> E[Sub-Agent - Explore]; C --> D; C --> E`} />

### Why This Matters

Different agentic clients define agents differently:

- **Claude Code** has a similar concept with its multi-agent orchestration
- **Cursor** calls this "Agent Mode" with planning steps
- **Windsurf** implements "Cascade" for multi-step reasoning

The key insight is that modern agentic tools don't just respond to prompts - they break down complex tasks, delegate to specialized sub-agents, and coordinate the results. Understanding this helps you:

1. **Use the right agent for the task** - Use "Plan" when you want analysis without changes
2. **Leverage sub-agents** - @ mention specific agents for faster, focused results
3. **Configure permissions** - Control what each agent can do to prevent accidents

---

## What is an MCP Server?

**MCP** stands for **Model Context Protocol**. It's a standard way to give AI models access to external tools and data sources - like plugins for your AI.

Think of MCP servers like apps on your smartphone. Your phone (the agentic client) is useful on its own, but apps (MCP servers) give it superpowers - camera, maps, email, etc.

### How MCP Works

<Mermaid chart={`graph LR; A[You] --> B[Agentic Client]; B --> C[Agents]; C --- D[Web Search MCP]; C --- E[File System MCP]; C --- F[Database MCP]; C --- G[Browser MCP]; D --> H[Google/Bing]; E --> I[Your Files]; F --> J[Your Data]; G --> K[Web Pages]`} />

### Popular Free MCP Servers

MCP is still a relatively new protocol, and the ecosystem is evolving. Here are some common server types (check the <a href="https://github.com/modelcontextprotocol/servers" target="_blank">official MCP servers repository</a> for current options):

| MCP Server Type | What It Does | Use Case |
| :-------------- | :----------- | :------- |
| Fetch/HTTP servers | Fetches web pages | Research, reading articles |
| Filesystem servers | Reads/writes files | Working with documents |
| Memory servers | Persistent memory | Remembering across sessions |
| Browser automation | Controls a browser | Web automation, screenshots |
| Database servers | Database access | Data analysis |

**Note**: Package names and availability change frequently. Always check the official documentation for the most current installation instructions.

### Why MCP Matters

Without MCP, the AI can only work with what you paste into the chat. With MCP:

- **Web Search**: AI can look up current information
- **File Access**: AI can read your documents and write new ones
- **Browser Control**: AI can navigate websites and fill forms
- **Data Access**: AI can query databases and analyze data

**The best part?** Most MCP servers are free and open source.

---

## Our $0 Budget Workflow Setup

Now let's put it all together with a completely free setup. We'll use <a href="https://opencode.ai/" target="_blank">**OpenCode**</a>, a popular open-source agentic coding assistant that supports 75+ LLM providers.

### The Components

| Component | What It Does | Cost | Why We Chose It |
| :-------- | :----------- | :--- | :-------------- |
| OpenCode | Agentic client | Free (open source) | 75+ provider support, active community, cross-platform |
| OpenRouter | Provider (API access) | Free tier available | Access to free models, pay-as-you-go for others |
| Free LLM models | The AI brain | Free on OpenRouter | Llama, Mistral, and others offer free tiers |

<Mermaid chart={`graph TD; A[Your Computer] --> B[OpenCode]; B --> C[Agents - Build/Plan]; C --> D[OpenRouter API]; D --> E[Free Llama Model]; C --> F[Your Files]; C --> G[Git Repository]`} />

### Step-by-Step Setup

#### Step 1: Get an OpenRouter API Key

1. Go to <a href="https://openrouter.ai/" target="_blank">openrouter.ai</a>
2. Click "Sign Up" and create a free account
3. Go to <a href="https://openrouter.ai/keys" target="_blank">openrouter.ai/keys</a>
4. Click "Create Key" and copy your API key
5. Save this key somewhere safe

**Note**: OpenRouter provides some free model access. Check their <a href="https://openrouter.ai/models" target="_blank">models page</a> and filter by "Free" to see current free options.

#### Step 2: Install OpenCode

Open your terminal and run:

```bash
curl -fsSL https://opencode.ai/install | bash
```

OpenCode is also available via npm, brew, and other package managers. Check the <a href="https://opencode.ai/" target="_blank">OpenCode website</a> for alternative installation methods.

#### Step 3: Configure OpenCode with OpenRouter

Set your API key as an environment variable. On Mac/Linux:

```bash
export OPENROUTER_API_KEY="your-api-key-here"
```

To make this permanent, add it to your shell profile (e.g., ~/.bashrc or ~/.zshrc).

#### Step 4: Run OpenCode with a Free Model

Navigate to a project folder and start OpenCode:

```bash
cd your-project-folder
opencode
```

OpenCode will prompt you to select a provider and model. Choose OpenRouter and select a free model like Llama.

**Note**: Model availability on OpenRouter can change. Check their website for current free model options.

#### Step 5: Test Your Setup

Once OpenCode starts, try a simple task:

```
Can you create a simple hello.py file that prints "Hello, World!"?
```

OpenCode will show you the proposed changes and ask for confirmation before making them.

### Alternative: Using Claude Code (If You Have API Access)

If you have Anthropic API credits or a Claude Pro subscription, <a href="https://docs.anthropic.com/en/docs/claude-code/overview" target="_blank">Claude Code</a> is another excellent option:

```bash
# macOS/Linux
curl -fsSL https://claude.ai/install.sh | bash

# Or using Homebrew on macOS
brew install --cask claude-code

# Then start Claude Code
claude
```

Claude Code offers sophisticated agentic capabilities with MCP support, but requires paying for API usage or a Claude subscription.

---

## Demo: Creating a "1 Year in New Zealand" Blog Post

Let's put our workflow to the test by creating actual content. We'll use our $0 setup to research and draft a blog post about spending a year in New Zealand.

### The Workflow

<Mermaid chart={`graph LR; A[1. Research] --> B[Agent searches web]; B --> C[2. Outline]; C --> D[Agent creates structure]; D --> E[3. Write]; E --> F[Agent drafts content]; F --> G[4. Polish]; G --> H[Final post]`} />

### The Prompts We'll Use

#### Prompt 1: Research Phase

```
I'm writing a blog post about "My First Year Living in New Zealand" for someone
who recently moved there. Please help me research:

1. What are the most common challenges expats face in their first year in NZ?
2. What are the best things about living in New Zealand?
3. What cultural differences should people expect?
4. What practical tips would help someone in their first year?

Use the web to find current, relevant information.
```

#### Prompt 2: Create an Outline

```
Based on the research, create a blog post outline with:
- An engaging introduction
- 4-5 main sections covering the key topics
- Bullet points for what each section should cover
- A conclusion with actionable takeaways

Target audience: Someone who just moved to NZ or is considering it.
Tone: Friendly, honest, helpful - like advice from a friend.
```

#### Prompt 3: Write the First Draft

```
Now write the full blog post based on the outline. Guidelines:
- About 1500-2000 words
- Include specific examples and anecdotes
- Add practical tips that people can actually use
- Keep paragraphs short and readable
- Use headers to break up sections
```

#### Prompt 4: Polish and Refine

```
Please review and improve the draft:
1. Check for any factual errors
2. Make the opening more engaging
3. Add a call-to-action at the end
4. Ensure the tone is consistent throughout
5. Add any missing practical tips
```

### Example Output

Here's a snippet of what the AI might produce:

---

**Moving to New Zealand: What I Wish I Knew Before My First Year**

*The land of the long white cloud has a lot to offer - but also some surprises*

When I stepped off the plane in Auckland, I thought I knew what to expect. English-speaking country, friendly people, beautiful landscapes. How different could it be?

Turns out, quite a bit. Here's what a year in Aotearoa taught me...

**The Cost of Living Will Surprise You**

Let's address the elephant in the room: New Zealand is expensive. Like, really expensive. A simple grocery run that might cost 50 USD in the US can easily hit 100+ NZD here. Housing in Auckland or Wellington? Prepare yourself.

*Practical tip*: The Countdown and New World apps have weekly specials. Pak'nSave is the budget-friendly option. And yes, you'll start planning meals around what's on sale.

**The Work-Life Balance is Real**

This was the pleasant surprise. Kiwis actually leave work at 5pm. They take their holidays. "She'll be right" isn't just a saying - it's a lifestyle...

---

### Tips for Better Results

1. **Be specific**: The more detail you give, the better the output
2. **Iterate**: Don't expect perfection on the first try
3. **Use web search**: Ask the AI to research current information
4. **Break it down**: Complex tasks work better as multiple prompts
5. **Review critically**: AI can make mistakes - always fact-check

---

## Common Mistakes and Troubleshooting

Even with the best setup, you'll encounter issues. Here are the most common problems and how to fix them.

### Model API Compatibility Issues

**The Problem**: You try a free model that claims to support "tool use" but get errors like "No endpoints found that support tool use" or mysterious 400 Bad Request errors.

**Why It Happens**: AI models evolve rapidly. When a new version is released (e.g., Gemini 2 to Gemini 3), the underlying API patterns for tool use often change. A model that worked perfectly last month might break because:

- The system prompt format changed
- Tool calling conventions were updated
- The provider updated their API schema

**The Fix**:

1. **Try a different model version on OpenRouter**: OpenRouter often has multiple versions of the same model family. If `google/gemini-2.0-flash-thinking-exp:free` fails, try `google/gemini-2.5-flash-preview-05-20` or another variant
2. **Check the model's release date**: Newer isn't always better for compatibility. Sometimes older, more stable versions work better with agentic clients
3. **Stick to well-tested models**: Llama 3.1/3.2, Claude (via API), and GPT-4 tend to have the most stable tool use implementations

### OpenCode-Specific Issues

Based on <a href="https://opencode.ai/docs/troubleshooting/" target="_blank">OpenCode's official troubleshooting guide</a> and <a href="https://github.com/sst/opencode/issues" target="_blank">community reports</a>:

| Problem | Solution |
| :------ | :------- |
| "ProviderModelNotFoundError" | Check model format - must be `provider/model` (e.g., `openrouter/meta-llama/llama-3.1-8b-instruct`) |
| "ProviderInitError" | Re-authenticate with `/connect` command, or clear config: `rm -rf ~/.local/share/opencode` |
| OpenCode won't start | Run with `opencode --log-level DEBUG` to see detailed errors |
| Model with `:free` suffix fails | This is a <a href="https://github.com/sst/opencode/issues/749" target="_blank">known parsing bug</a> - try models without colons in their ID |
| Stuck in "Plan" mode | Restart OpenCode or explicitly tell the AI to "execute" rather than "plan" |
| Bash commands timeout after 60 seconds | For long-running tasks, break them into smaller steps |

### OpenRouter-Specific Tips

| Issue | Quick Fix |
| :---- | :-------- |
| 400 errors after tool calls | Close and relaunch the application - this clears corrupted session state |
| Model shows as available but fails | Check if the model actually supports tool use on <a href="https://openrouter.ai/models" target="_blank">OpenRouter's models page</a> |
| Rate limiting errors | Free models have usage limits - wait a few minutes or switch to another free model |

### Windows Installation Gotchas

If you're on Windows, be aware of these <a href="https://medium.com/@ceelopez/opencode-cli-on-windows-fix-1b90e241cc8f" target="_blank">common issues</a>:

- The `curl` install command installs inside WSL, not Windows itself
- Use `npm install -g opencode-ai` instead for native Windows
- Run the installer with administrator privileges to avoid permission errors

### When All Else Fails

1. **Check the logs**: Located at `~/.local/share/opencode/log/` (Mac/Linux) or `%USERPROFILE%\.local\share\opencode\log\` (Windows)
2. **Clear the cache**: `rm -rf ~/.cache/opencode` can fix mysterious errors
3. **Update to the latest version**: Many bugs are fixed in newer releases
4. **Try a different model**: If one model consistently fails, another might work perfectly
5. **Ask the community**: <a href="https://github.com/sst/opencode/issues" target="_blank">GitHub Issues</a> often has solutions for specific problems

---

## Final Thoughts

You've just learned the fundamentals of agentic AI workflows:

- **Providers** give you access to AI models (we used OpenRouter)
- **Foundation Models** are the AI "brains" (we used free Llama models)
- **Context Length** determines how much the AI can remember
- **Agentic Clients** let AI take actions, not just chat (CLI vs IDE options)
- **Agents & Sub-Agents** break down complex tasks into specialized workers
- **MCP Servers** extend what AI can do (web search, file access, etc.)

### The $0 Stack Recap

| Component | Our Choice | Purpose |
| :-------- | :--------- | :------ |
| Agentic Client | OpenCode | Interface to interact with AI |
| Provider | OpenRouter | Access to models via API |
| Model | Llama 3.2 (free) | The AI that does the work |
| Tools | Fetch MCP | Web research capabilities |

### What's Next?

Now that you have a working setup:

1. **Experiment**: Try different prompts and see what works
2. **Explore models**: OpenRouter has many free models to try
3. **Add more MCP servers**: Browser automation, file access, databases
4. **Build workflows**: Chain prompts together for complex tasks

The AI landscape is evolving rapidly. What costs money today might be free tomorrow. What requires technical skills now might become point-and-click. But understanding the fundamentals - providers, models, context, agents, and tools - will serve you well no matter how the technology changes.

Happy experimenting!

---

_Have questions about AI workflows? Found a better free tool? Feel free to connect with me through the contact information on this site._
