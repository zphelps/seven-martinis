-- Let each featured tag customize how its highlighted menu section looks:
-- a color theme, an optional icon override (independent of the tag's own
-- uploaded image), and a tagline - instead of every featured tag getting
-- the same hardcoded winter blue/Sparkles look and "seasonal" copy.

ALTER TABLE "public"."tags"
    ADD COLUMN IF NOT EXISTS "theme" text DEFAULT 'winter' NOT NULL,
    ADD COLUMN IF NOT EXISTS "icon" text,
    ADD COLUMN IF NOT EXISTS "tagline" text;
