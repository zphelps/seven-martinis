-- Introduce tags as a managed entity (name + uploadable image + featured flag)
-- instead of hardcoded string literals in the frontend, plus a proper
-- many-to-many relationship to menu_items so renaming/re-imaging a tag
-- never requires touching menu_items rows.

CREATE TABLE IF NOT EXISTS "public"."tags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "image_url" "text",
    "is_featured" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."tags" OWNER TO "postgres";

ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_name_key" UNIQUE ("name");

CREATE TABLE IF NOT EXISTS "public"."menu_item_tags" (
    "menu_item_id" "uuid" NOT NULL,
    "tag_id" "uuid" NOT NULL
);

ALTER TABLE "public"."menu_item_tags" OWNER TO "postgres";

ALTER TABLE ONLY "public"."menu_item_tags"
    ADD CONSTRAINT "menu_item_tags_pkey" PRIMARY KEY ("menu_item_id", "tag_id");

ALTER TABLE ONLY "public"."menu_item_tags"
    ADD CONSTRAINT "menu_item_tags_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."menu_item_tags"
    ADD CONSTRAINT "menu_item_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE CASCADE;

CREATE POLICY "Enable all for authenticated users only" ON "public"."tags" TO "authenticated" USING (true) WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON "public"."tags" FOR SELECT USING (true);

CREATE POLICY "Enable all for authenticated users only" ON "public"."menu_item_tags" TO "authenticated" USING (true) WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON "public"."menu_item_tags" FOR SELECT USING (true);

ALTER TABLE "public"."tags" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."menu_item_tags" ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE "public"."tags" TO "anon";
GRANT ALL ON TABLE "public"."tags" TO "authenticated";
GRANT ALL ON TABLE "public"."tags" TO "service_role";

GRANT ALL ON TABLE "public"."menu_item_tags" TO "anon";
GRANT ALL ON TABLE "public"."menu_item_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."menu_item_tags" TO "service_role";

INSERT INTO "storage"."buckets" ("id", "name", "public")
VALUES ('tag_images', 'tag_images', true)
ON CONFLICT ("id") DO NOTHING;

CREATE POLICY "Give authenticated users full access to tag_images 0"
  ON "storage"."objects"
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK ((bucket_id = 'tag_images'::text));

CREATE POLICY "Give authenticated users full access to tag_images 1"
  ON "storage"."objects"
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING ((bucket_id = 'tag_images'::text));

CREATE POLICY "Give authenticated users full access to tag_images 2"
  ON "storage"."objects"
  AS PERMISSIVE
  FOR UPDATE
  TO authenticated
  USING ((bucket_id = 'tag_images'::text));

CREATE POLICY "Give authenticated users full access to tag_images 3"
  ON "storage"."objects"
  AS PERMISSIVE
  FOR DELETE
  TO authenticated
  USING ((bucket_id = 'tag_images'::text));

CREATE POLICY "Public read access to tag_images"
  ON "storage"."objects"
  AS PERMISSIVE
  FOR SELECT
  TO anon
  USING ((bucket_id = 'tag_images'::text));
