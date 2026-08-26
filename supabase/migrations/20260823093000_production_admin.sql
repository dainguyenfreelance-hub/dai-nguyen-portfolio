-- Production Admin support for the portfolio.
-- Authentication credentials are intentionally not stored in migrations.

UPDATE storage.buckets
SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
WHERE id = 'project-images';

DROP POLICY IF EXISTS "Project images are public" ON storage.objects;
CREATE POLICY "Project images are public"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'project-images');

UPDATE public.projects
SET
  slug = CASE title
    WHEN 'Samsung Voices of Galaxy MMA' THEN 'samsung-voices-of-galaxy'
    WHEN 'NESCAFÉ Tết Corporation — YouTube Awards' THEN 'nescafe-tet-corporation'
    WHEN 'NESCAFÉ Tết — YouTube Awards' THEN 'nescafe-tet'
    WHEN 'NESCAFÉ Café Việt — YouTube Awards' THEN 'nescafe-cafe-viet'
    WHEN 'Mitsubishi Destinator MMA' THEN 'mitsubishi-destinator'
    ELSE slug
  END,
  youtube_url = CASE
    WHEN youtube_url LIKE '%UNLISTED_PLACEHOLDER_%' THEN ''
    ELSE youtube_url
  END;

UPDATE public.site_settings
SET
  showreel_url = CASE
    WHEN showreel_url LIKE '%UNLISTED_SHOWREEL_ID%' THEN ''
    ELSE showreel_url
  END,
  showreel_caption = CASE
    WHEN showreel_caption LIKE '%placeholder%' THEN ''
    ELSE showreel_caption
  END
WHERE id = 'default';
