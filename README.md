# Dai Nguyen Portfolio

A cinematic, responsive portfolio website for Dai Nguyen — video editor,
motion designer and 3D artist.

## Included

- Home, Work, Project Detail, Services, About and Contact pages
- Categories for Case Study, TVC, Social Post, Animatic and AI Video
- Five initial Prodigious / Publicis Groupe projects
- YouTube URL placeholders
- Responsive desktop, tablet and mobile layouts
- Local CMS preview at `/admin`
- Editable project title, category, client, role, year, thumbnail, video URL,
  featured state and publish state

## Run locally

```bash
pnpm install
pnpm dev
```

Production build:

```bash
pnpm build
```

## Admin preview

Open `/admin` and enter:

```text
dainguyen.freelance@gmail.com
```

The current CMS stores changes in the browser's local storage. This is useful
for UI review, but production authentication and shared content storage should
be connected to Lovable Cloud or Supabase before launch.

## Media

- Add YouTube unlisted URLs through the admin UI.
- Do not commit original video masters to GitHub.
- Replace placeholder category images with final thumbnails before launch.

## GitHub Pages deployment

The included GitHub Actions workflow builds the site and deploys `dist` to
GitHub Pages on every push to `main`. In the repository settings, enable Pages
with **GitHub Actions** as the source. The site uses hash routing so it works
both at the project URL and later behind a custom domain.

The public portfolio is static. The current admin preview stores edits in the
browser; a shared production CMS requires Supabase (or another external
backend) because GitHub Pages does not execute server-side code.
