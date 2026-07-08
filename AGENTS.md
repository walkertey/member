<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:raymond-design-rules -->
# Raymond Design System Rules

## Permanent Prohibition: No Raw Hex Colors in Components
- **Do NOT** write raw hex color values (e.g. `#0a0e27`, `#f0b429`) inside page/component files
- **ALWAYS** use `--rm-*` CSS variables defined in `app/globals.css` or their corresponding Tailwind utility classes (e.g. `bg-rm-bg-deep`, `text-rm-gold`)
- `app/globals.css` `:root` block is the **single source of truth** for all Raymond brand colors
- This applies to all `app/`, `components/`, and feature directories
<!-- END:raymond-design-rules -->
