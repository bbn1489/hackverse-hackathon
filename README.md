# FocusLock

A small React + TypeScript + Vite project with Tailwind CSS. This repo contains a local development setup and a production build pipeline using Vite.

Quick start

1. Install dependencies:

```powershell
npm install
```

2. Run the dev server:

```powershell
npm run dev -- --host 127.0.0.1 --port 5174
```

3. Build for production:

```powershell
npm run build
npm run preview -- --port 5175
```

Notes

- Tailwind is configured in `tailwind.config.cjs` and processed through PostCSS.
- `src/styles.css` imports Tailwind directives. In dev Vite injects CSS via the JS import; in production `dist/index.html` includes the built CSS file.
