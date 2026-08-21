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

## Lovable workflow

Lovable cannot import an existing GitHub repository as a new Lovable project.
Create the Lovable project first, connect it to GitHub, then copy this code into
the repository Lovable creates. See `LOVABLE_SETUP.md`.

