# Lovable setup

## Why this order matters

Lovable currently creates a new GitHub repository when GitHub sync is enabled.
It does not create a Lovable project by importing an existing repository.

Use this sequence:

1. Create a new blank project in Lovable.
2. Name it `Dai Nguyen Portfolio`.
3. In Lovable, connect GitHub and let Lovable create its repository.
4. Clone that repository locally.
5. Copy this project's files into the Lovable-created repository.
6. Commit and push to the branch connected to Lovable.
7. Return to Lovable and verify the synced version.
8. Connect Lovable Cloud or Supabase for production admin authentication,
   database and image storage.
9. Publish using the desired project URL, ideally `dainguyen.lovable.app` if
   that slug is available.

## Backend prompt for Lovable

Paste this after the visual site is synced:

```text
Connect this portfolio to Lovable Cloud and replace the localStorage CMS with
a secure production content system.

Requirements:
- One admin account only: dainguyen.freelance@gmail.com
- Protect all /admin routes and admin mutations
- Public visitors can read published projects only
- Projects support: title, slug, category, year, client, agency, role,
  thumbnail, YouTube URL, short description, brief, challenge, approach,
  result, credits, featured, published, sort order and timestamps
- Admin can create, edit, publish, hide, sort and delete projects
- Admin can manage showreel and videos used across Home, Work, Services and
  project detail pages
- Store thumbnails and case-study images in managed storage
- Validate YouTube URLs
- Preserve the existing visual design and responsive layout
- Add confirmation before deletion
- Use row-level access policies so only the configured admin can write
```

## Contact form prompt

```text
Add a production contact form that sends submissions to
dainguyen.freelance@gmail.com. Include name, email, company, project type,
budget range and message. Add validation, spam protection, success/error
states and rate limiting. Do not expose private service keys in frontend code.
```

