-- Backend-driven invitation system: events (invitations), their freeform detail
-- sections, an animation registry, and token-scoped public read access.

create table if not exists "public"."events" (
    "id" uuid default gen_random_uuid() not null,
    "created_at" timestamp with time zone default now() not null,
    "token" text not null,
    "title" text not null,
    "event_date" date,
    "event_time_label" text,
    "greeting" text,
    "secret_note" text,
    "footnote" text,
    "animations" jsonb default '[]'::jsonb not null,
    "status" text default 'draft'::text not null,
    constraint "events_status_check" check (("status" = any (array['draft'::text, 'published'::text, 'archived'::text])))
);

alter table "public"."events" owner to "postgres";

create table if not exists "public"."event_detail_items" (
    "id" uuid default gen_random_uuid() not null,
    "event_id" uuid not null,
    "key" text not null,
    "value" text not null,
    "sort_order" integer default 0 not null
);

alter table "public"."event_detail_items" owner to "postgres";

create table if not exists "public"."animation_registry" (
    "key" text not null,
    "name" text not null,
    "description" text,
    "default_config" jsonb default '{}'::jsonb not null
);

alter table "public"."animation_registry" owner to "postgres";

alter table only "public"."events"
    add constraint "events_pkey" primary key ("id");

alter table only "public"."events"
    add constraint "events_token_key" unique ("token");

alter table only "public"."event_detail_items"
    add constraint "event_detail_items_pkey" primary key ("id");

alter table only "public"."animation_registry"
    add constraint "animation_registry_pkey" primary key ("key");

alter table only "public"."event_detail_items"
    add constraint "event_detail_items_event_id_fkey" foreign key ("event_id") references "public"."events"("id") on delete cascade;

-- Matches this table's existing camelCase column convention (phoneNumber,
-- guestNum, eventDate, firstTimeAttendee), unlike the snake_case new tables above.
alter table "public"."attendees" add column if not exists "eventId" uuid;

alter table only "public"."attendees"
    add constraint "attendees_event_id_fkey" foreign key ("eventId") references "public"."events"("id");

-- RLS: raw tables are authenticated-only (dashboard CRUD). There is deliberately no
-- anon SELECT policy here — public read happens exclusively through the
-- SECURITY DEFINER RPCs below, so an anonymous caller can never list all events/
-- tokens by querying the table directly with no filter.
alter table "public"."events" enable row level security;
alter table "public"."event_detail_items" enable row level security;
alter table "public"."animation_registry" enable row level security;

create policy "Enable all for authenticated users only" on "public"."events" to "authenticated" using (true) with check (true);
create policy "Enable all for authenticated users only" on "public"."event_detail_items" to "authenticated" using (true) with check (true);
create policy "Enable read for authenticated users" on "public"."animation_registry" for select to "authenticated" using (true);

grant all on table "public"."events" to "anon";
grant all on table "public"."events" to "authenticated";
grant all on table "public"."events" to "service_role";

grant all on table "public"."event_detail_items" to "anon";
grant all on table "public"."event_detail_items" to "authenticated";
grant all on table "public"."event_detail_items" to "service_role";

grant all on table "public"."animation_registry" to "anon";
grant all on table "public"."animation_registry" to "authenticated";
grant all on table "public"."animation_registry" to "service_role";

-- Seed the built-in animation types. Adding a brand new visual effect still
-- requires a matching React component + registry row in code; this table is what
-- lets the dashboard pick which existing effects are enabled per event and tune
-- their config without a redeploy.
insert into "public"."animation_registry" ("key", "name", "description", "default_config") values
    ('snowfall', 'Snowfall', 'Gentle falling snow across the page.', '{"snowflakeCount": 200}'::jsonb),
    ('confetti', 'Confetti', 'One-shot confetti burst on load.', '{"numberOfPieces": 500, "recycle": false}'::jsonb)
on conflict ("key") do nothing;

-- Public, token-scoped read access ------------------------------------------------
-- SECURITY DEFINER so it can bypass the authenticated-only RLS policies above,
-- while only ever returning the single row matching an exact token the caller
-- already has -- never an unfiltered list.
create or replace function "public"."get_invitation_by_token"("p_token" text)
returns jsonb
language sql
security definer
set search_path = public
as $$
    select jsonb_build_object(
        'event', to_jsonb(e.*),
        'details', coalesce(
            (select jsonb_agg(to_jsonb(d.*) order by d.sort_order)
             from "public"."event_detail_items" d
             where d.event_id = e.id),
            '[]'::jsonb
        )
    )
    from "public"."events" e
    where e.token = p_token
      and e.status <> 'archived';
$$;

revoke all on function "public"."get_invitation_by_token"(text) from public;
grant execute on function "public"."get_invitation_by_token"(text) to "anon", "authenticated";

create or replace function "public"."get_latest_published_invitation"()
returns jsonb
language sql
security definer
set search_path = public
as $$
    select jsonb_build_object(
        'event', to_jsonb(e.*),
        'details', coalesce(
            (select jsonb_agg(to_jsonb(d.*) order by d.sort_order)
             from "public"."event_detail_items" d
             where d.event_id = e.id),
            '[]'::jsonb
        )
    )
    from "public"."events" e
    where e.status = 'published'
    order by e.event_date desc nulls last, e.created_at desc
    limit 1;
$$;

revoke all on function "public"."get_latest_published_invitation"() from public;
grant execute on function "public"."get_latest_published_invitation"() to "anon", "authenticated";

-- Seed the current hard-coded NYE 2026 invitation as the first real, DB-backed
-- event so the migration to the dynamic route is lossless.
insert into "public"."events" ("token", "title", "event_date", "event_time_label", "greeting", "secret_note", "footnote", "animations", "status")
values (
    'nye2026-8f3c1a9d4e6b7c2f0a5d9e1b3c7f2a6d94c8b1a0',
    'New Year''s Eve 2026',
    '2025-12-31',
    'Eight o''clock in the evening until past midnight*',
    'You are cordially invited to celebrate the new year and ring in 2026 with an evening of cocktails during an exclusive event at',
    'Access to Seven Martinis is by invitation only and may be obtained through a concealed entrance on the lower level of the Phelps Residence. Those in the know will find their way...seek where the wood whispers and the panels part.',
    '*Seven Martinis does not participate in this horrifying contemporary notion of "last call." The bar will remain open so long as bodies remain inside — dead or alive.',
    '[{"key": "snowfall", "config": {"snowflakeCount": 200}}, {"key": "confetti", "config": {"numberOfPieces": 500, "recycle": false}}]'::jsonb,
    'published'
)
on conflict ("token") do nothing;

insert into "public"."event_detail_items" ("event_id", "key", "value", "sort_order")
select e.id, d.key, d.value, d.sort_order
from "public"."events" e
cross join (values
    ('Location', E'Lower level of the Phelps Residence\n10895 Holliday Farms Blvd., Zionsville, IN 46077\nFollow the signs at the front door upon arrival.', 0),
    ('Access', 'Upon arrival to the Holliday Farms neighborhood, stop at the gate house and mention you are here for the "Phelps Residence." Remember, Seven Martinis is a secret.', 1),
    ('Attire', 'NYE@7M is a high-end cocktail party. To celebrate, we imagine many will dress to impress, but it is not required. As always, we''ve seen suits and denim at the same party — both ordered a second round.', 2),
    ('Selection', 'NYE@7M will feature a new Seven for Winter menu, featuring winter-inspired flavors. A one-night only menu of NYE drinks will also be served.', 3)
) as d("key", "value", "sort_order")
where e.token = 'nye2026-8f3c1a9d4e6b7c2f0a5d9e1b3c7f2a6d94c8b1a0'
  and not exists (select 1 from "public"."event_detail_items" where "event_id" = e.id);
