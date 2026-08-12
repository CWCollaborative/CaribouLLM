const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

/**
 * Allowlist-based URL validator for markdown artifact rendering.
 * The logic body is duplicated verbatim into the generated static HTML
 * template (`EMBEDDED_IS_SAFE_URL` constant below). Any behavioral change
 * here MUST be applied to both copies. A sync-verification test in
 * `markdown.test.ts` enforces this.
 */
export const isSafeUrl = (url: string): boolean => {
  const trimmed = url.trim();
  if (!trimmed) {
    return false;
  }
  if (trimmed.startsWith('/') || trimmed.startsWith('#') || trimmed.startsWith('.')) {
    return true;
  }
  try {
    return SAFE_PROTOCOLS.has(new URL(trimmed).protocol);
  } catch {
    return false;
  }
};

const markdownCSS = `
/* GitHub Markdown CSS - Light theme base */
.markdown-body {
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  word-wrap: break-word;
  color: rgb(var(--text-primary));
  background-color: rgb(var(--surface-primary));
}

.markdown-body h1, .markdown-body h2 {
  border-bottom: 1px solid rgb(var(--border-medium));
  margin: 0.6em 0;
}

.markdown-body h1 { font-size: 2em; margin: 0.67em 0; }
.markdown-body h2 { font-size: 1.5em; }
.markdown-body h3 { font-size: 1.25em; }
.markdown-body h4 { font-size: 1em; }
.markdown-body h5 { font-size: 0.875em; }
.markdown-body h6 { font-size: 0.85em; }

.markdown-body ul, .markdown-body ol {
  list-style: revert !important;
  padding-left: 2em !important;
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body ul { list-style-type: disc !important; }
.markdown-body ol { list-style-type: decimal !important; }
.markdown-body ul ul { list-style-type: circle !important; }
.markdown-body ul ul ul { list-style-type: square !important; }

.markdown-body li { margin-top: 0.25em; }

.markdown-body li:has(> input[type="checkbox"]) {
  list-style-type: none !important;
}

.markdown-body li > input[type="checkbox"] {
  margin-right: 0.75em;
  margin-left: -1.5em;
  vertical-align: middle;
  pointer-events: none;
  width: 16px;
  height: 16px;
}

.markdown-body .task-list-item {
  list-style-type: none !important;
}

.markdown-body .task-list-item > input[type="checkbox"] {
  margin-right: 0.75em;
  margin-left: -1.5em;
  vertical-align: middle;
  pointer-events: none;
  width: 16px;
  height: 16px;
}

.markdown-body code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  border-radius: 6px;
  background-color: rgb(var(--border-medium) / 0.12);
  color: rgb(var(--text-primary));
  font-family: ui-monospace, monospace;
  white-space: pre-wrap;
}

.markdown-body pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  border-radius: 6px;
  margin-top: 0;
  margin-bottom: 16px;
  background-color: rgb(var(--surface-secondary));
  color: rgb(var(--text-primary));
}

.markdown-body pre code {
  display: inline-block;
  padding: 0;
  margin: 0;
  overflow: visible;
  line-height: inherit;
  word-wrap: normal;
  background-color: transparent;
  border: 0;
}

.markdown-body a {
  text-decoration: none;
  color: rgb(var(--link));
}

.markdown-body a:hover {
  text-decoration: underline;
}

.markdown-body table {
  border-spacing: 0;
  border-collapse: collapse;
  display: block;
  width: max-content;
  max-width: 100%;
  overflow: auto;
}

.markdown-body table thead {
  background-color: rgb(var(--surface-secondary));
}

.markdown-body table th, .markdown-body table td {
  padding: 6px 13px;
  border: 1px solid rgb(var(--border-medium));
}

.markdown-body blockquote {
  padding: 0 1em;
  border-left: 0.25em solid rgb(var(--border-medium));
  margin: 0 0 16px 0;
  color: rgb(var(--text-secondary));
}

.markdown-body hr {
  height: 0.25em;
  padding: 0;
  margin: 24px 0;
  border: 0;
  background-color: rgb(var(--border-medium));
}

.markdown-body img {
  max-width: 100%;
  box-sizing: content-box;
}

/* Dark theme */
@media (prefers-color-scheme: dark) {
  .markdown-body {
    color: rgb(var(--text-inverted));
    background-color: rgb(var(--surface-primary));
  }

  .markdown-body h1, .markdown-body h2 {
    border-bottom-color: rgb(var(--border-medium));
  }

  .markdown-body code {
    background-color: rgb(var(--border-medium) / 0.4);
    color: rgb(var(--text-inverted));
  }

  .markdown-body pre {
    background-color: rgb(var(--surface-primary-alt));
    color: rgb(var(--text-inverted));
  }

  .markdown-body a {
    color: rgb(var(--link));
  }

  .markdown-body table thead {
    background-color: rgb(var(--surface-primary-alt));
  }

  .markdown-body table th, .markdown-body table td {
    border-color: rgb(var(--border-medium));
  }

  .markdown-body blockquote {
    border-left-color: rgb(var(--border-medium));
    color: rgb(var(--text-secondary));
  }

  .markdown-body hr {
    background-color: rgb(var(--border-medium));
  }
}

/* Scrollbar */
::-webkit-scrollbar { height: 0.1em; width: 0.5rem; }
::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.1); border-radius: 9999px; }
::-webkit-scrollbar-track { background-color: transparent; border-radius: 9999px; }
@media (prefers-color-scheme: dark) {
  ::-webkit-scrollbar-thumb { background-color: hsla(0,0%,100%,0.1); }
}
* { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.1) transparent; }
@media (prefers-color-scheme: dark) {
  * { scrollbar-color: hsla(0,0%,100%,0.1) transparent; }
}
`;

/**
 * Escapes content for safe embedding inside a JS template literal that
 * lives within an HTML `<script>` block. Prevents the content from
 * breaking out of the template literal or prematurely closing the
 * surrounding `<script>` tag (which would allow arbitrary HTML injection).
 */
function escapeForTemplateLiteral(content: string): string {
  return content
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$')
    .replace(/<\/script/gi, '<\\/script');
}

const MARKED_CDN = 'https://cdn.jsdelivr.net/npm/marked@15.0.12/marked.min.js';
const MARKED_SRI = 'sha384-948ahk4ZmxYVYOc+rxN1H2gM1EJ2Duhp7uHtZ4WSLkV4Vtx5MUqnV+l7u9B+jFv+';

/**
 * Embedded JS copy of `isSafeUrl`. Keep in sync with the exported
 * TypeScript version above — `markdown.test.ts` has a sync-verification
 * test that will break if the two copies diverge.
 */
export const EMBEDDED_IS_SAFE_URL = `const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);
const isSafeUrl = (url) => {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('/') || trimmed.startsWith('#') || trimmed.startsWith('.')) return true;
  try { return SAFE_PROTOCOLS.has(new URL(trimmed).protocol); } catch(e) { return false; }
};`;

function generateMarkdownHtml(content: string): string {
  const normalizedContent = content.replace(/^( {2})(-|\d+\.)/gm, '    $2');
  const escapedContent = escapeForTemplateLiteral(normalizedContent);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Markdown Preview</title>
<style>${markdownCSS}</style>
</head>
<body>
<div class="markdown-body" id="content" style="padding:2rem;margin:1rem;min-height:100vh"></div>
<script src="${MARKED_CDN}" integrity="${MARKED_SRI}" crossorigin="anonymous"></script>
<script>
if (typeof marked === 'undefined') {
  document.getElementById('content').innerHTML =
    '<p style="color:#e53e3e;padding:1rem">Markdown renderer failed to load. Check network connectivity.</p>';
} else {
${EMBEDDED_IS_SAFE_URL}
marked.use({
  gfm: true,
  breaks: true,
  renderer: {
    html() { return ''; },
    link(token) {
      if (!isSafeUrl(token.href || '')) return '';
      return false; // fall through to marked's default link renderer
    },
    image(token) {
      if (!isSafeUrl(token.href || '')) return '';
      return false; // fall through to marked's default image renderer
    }
  }
});
document.getElementById('content').innerHTML = marked.parse(\`${escapedContent}\`);
}
</script>
</body>
</html>`;
}

export const getMarkdownFiles = (content: string): Record<string, string> => {
  const md = content || '# No content provided';
  return {
    'content.md': md,
    'index.html': generateMarkdownHtml(md),
  };
};
