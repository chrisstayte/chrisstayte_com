# Content

The shipped-work catalog lives in `content/ships`.

To add an entry:

1. Copy `content/ships/_template.md` to a new file like `content/ships/my-project.md`.
2. Fill in the frontmatter fields.
3. Write the short inspection note below the frontmatter.
4. Run `npm run lint` and `npm run build`.

The site reads these files at build time, validates the fields, sorts by `order`, and exports static HTML for GitHub Pages.

Supported `type` values: `apps`, `site`, `media`, `code`.

Supported `status` values: `live`, `active`, `archive`, `dispatch`.
