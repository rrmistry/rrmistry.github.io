# Claude AI Assistant Guide for rrmistry.github.io

## Project Overview

This is a personal website and blog built with modern web technologies, deployed to GitHub Pages at [rrmistry.github.io](https://rrmistry.github.io).

### Tech Stack

- **Framework**: [Svelte 5](https://svelte.dev/) with [SvelteKit](https://kit.svelte.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with typography plugin
- **UI Components**: [shadcn/ui for Svelte](https://next.shadcn-svelte.com/)
- **Markdown Processing**: [mdsvex](https://mdsvex.pngwn.io/)
- **Syntax Highlighting**: [Shiki](https://shiki.matsu.io/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Package Manager**: npm
- **Development Environment**: [Devbox](https://github.com/jetify-com/devbox)
- **Testing**: [Vitest](https://vitest.dev/) (unit) + [Playwright](https://playwright.dev/) (e2e)
- **Deployment**: GitHub Actions → GitHub Pages

## Project Structure

```
rrmistry.github.io/
├── src/
│   ├── app.css                 # Global styles
│   ├── app.html               # HTML template
│   ├── content/               # Blog posts in markdown
│   ├── lib/                   # Shared components and utilities
│   │   ├── components/        # Reusable UI components
│   │   │   └── ui/           # shadcn/ui components
│   │   ├── hooks/            # Svelte hooks
│   │   └── *.svelte          # Feature components
│   ├── routes/               # SvelteKit routes
│   │   ├── +layout.svelte    # Root layout
│   │   ├── +page.svelte      # Home page
│   │   ├── blogs/            # Blog listing and individual posts
│   │   └── resume/           # Resume page
│   └── stores/               # Svelte stores
├── static/                   # Static assets
├── e2e/                      # Playwright tests
├── build/                    # Build output (gitignored)
└── Configuration files
```

## Key Commands

### Development

```bash
# Install dependencies
npm install

# Start development server (port 5173)
npm run dev

# Start with debugging
npm run dev:debug

# Run devbox shell (includes all tools)
devbox shell

# Start tmux session with multiple panes
devbox run tmux
```

### Testing

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run e2e tests only
npm run test:e2e

# Type checking
npm run check

# Watch mode for type checking
npm run check:watch
```

### Building & Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Linting and formatting
npm run lint
npm run format
```

### Local CI Testing

```bash
# Test GitHub Actions locally with act
devbox run ci:local
# or simpler version
devbox run ci:local-simple
```

## Development Environment

### Devbox Configuration

The project uses Devbox for consistent development environments. Key packages:

- Node.js 20
- Bash, Git, Neovim, Tmux
- Tailwind CSS CLI
- Playwright
- Act (for local GitHub Actions testing)

### Tmuxinator Setup

A tmuxinator configuration is provided for a multi-pane development environment:

- **claude**: Claude CLI session
- **lazygit**: Git interface
- **nvim**: Neovim editor
- **htop**: System monitoring
- **terminal**: General purpose terminal

Start with: `devbox run tmux`

## Content Management

### Blog Posts

- Location: `src/content/*.md`
- Format: Markdown with YAML frontmatter
- Required frontmatter:
  ```yaml
  ---
  title: 'Post Title'
  date: 2023-10-01
  tags: ['tag1', 'tag2']
  description: Brief description
  ---
  ```

### Supported Features in Markdown

- Syntax highlighting (JavaScript, TypeScript, Bash, YAML, JSON, HTML, CSS, Svelte)
- Mermaid diagrams (automatically rendered)
- External links (open in new tab)
- Embedded videos and images
- Custom Svelte components

## Deployment

### GitHub Actions Workflow

- Triggered on push to `main` branch
- Runs in Playwright container for consistency
- Steps:
  1. Install dependencies
  2. Run unit tests
  3. Build site
  4. Run e2e tests
  5. Deploy to GitHub Pages

### Static Site Configuration

- Adapter: `@sveltejs/adapter-static`
- Output: `build/` directory
- 404 fallback: `404.html`
- All routes are pre-rendered

## Key Configuration Files

### svelte.config.js

- Configures mdsvex for markdown processing
- Sets up static adapter for GitHub Pages
- Configures syntax highlighting with light/dark themes

### vite.config.ts

- Port configuration (5173)
- Path alias: `@` → `src/`
- Test configuration for Vitest

### tailwind.config.ts

- Custom color scheme with CSS variables
- shadcn/ui theme integration
- Typography and form plugins

## Testing Strategy

### Unit Tests

- Framework: Vitest
- Location: `src/**/*.{test,spec}.{js,ts}`
- Example: `src/lib/components/TagBadge-simple.test.ts`

### E2E Tests

- Framework: Playwright
- Location: `e2e/`
- Tests:
  - Basic functionality (`demo.test.ts`)
  - Mermaid diagram rendering (`diagram-rendering.test.ts`)
- Timeout: 5 minutes (configurable)

## UI Components

The project uses shadcn/ui components that are copied into the codebase rather than installed as dependencies. Key components:

- Button, Badge, Input, Label
- Sidebar (app navigation)
- Data tables
- Dropdown menus
- Sheets and tooltips

Components are in `src/lib/components/ui/` and can be customized as needed.

## Dark Mode Support

- Implemented using `mode-watcher`
- CSS class-based dark mode
- Syntax highlighting supports both light and dark themes
- Theme toggle available in the UI

## Performance Considerations

- All routes are pre-rendered at build time
- Images should be optimized before adding
- Code splitting handled by SvelteKit
- Minimal JavaScript bundle size due to Svelte compilation

## Common Tasks

### Adding a New Blog Post

1. Create a new `.md` file in `src/content/`
2. Add required frontmatter
3. Write content using markdown
4. Build and test locally
5. Commit and push to trigger deployment

### Modifying UI Components

1. Components are in `src/lib/components/ui/`
2. These are owned copies, not npm packages
3. Modify directly to suit needs
4. Ensure dark mode compatibility

### Updating Resume

- Edit `src/lib/resume.markdown`
- The resume route renders this markdown file

## Debugging Tips

- Use `npm run dev:debug` for Node.js debugging
- Check browser console for client-side errors
- Playwright reports are generated in `playwright-report/`
- Build artifacts are in `build/` directory

## Git Workflow

- Main branch: `main`
- Feature branches recommended
- Git hooks configured via devbox init
- Use conventional commit messages

## Important Notes

1. The site is statically generated - no server-side rendering in production
2. All external links automatically open in new tabs
3. The project uses Svelte 5 (latest version)
4. TypeScript is used throughout with strict checking
5. The CI/CD pipeline must pass before deployment
