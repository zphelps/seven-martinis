-- Let a tag be disabled (hidden from the public menu) without removing its
-- associations to drinks - the drinks stay tagged, they just stop showing
-- that tag/filter option on the menu until it's re-enabled.

ALTER TABLE "public"."tags"
    ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true NOT NULL;
