<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Delegation and review

The primary agent owns complex planning, architecture and design decisions, and final review. Delegate bounded, straightforward implementation or execution to cheaper `gpt-5.6-luna` agents where useful, with concrete acceptance criteria. The primary agent verifies the integrated result; if Luna is unavailable, mention that and use an available agent instead.
