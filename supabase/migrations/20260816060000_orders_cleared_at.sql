-- Let staff clear served orders off the Kanban board without deleting the
-- underlying order - the row stays in the database (and in the customer's
-- own order history), it just stops showing up in the dashboard's queue.

ALTER TABLE "public"."orders"
    ADD COLUMN IF NOT EXISTS "cleared_at" timestamp with time zone;
