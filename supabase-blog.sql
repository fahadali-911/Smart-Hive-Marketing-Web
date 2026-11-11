-- SmartHive Insights: blog storage for blog.html.
-- Run once in Supabase Studio -> SQL Editor. Publishing then happens in
-- Table Editor -> blog_posts, and blog.html picks the post up automatically.
-- No HTML file is created or edited per article.

create table if not exists public.blog_posts (
  id                  uuid primary key default gen_random_uuid(),
  slug                text not null unique,
  title               text not null,
  excerpt             text not null default '',
  content             text not null default '',
  category            text not null default '',
  featured_image      text not null default '',
  featured_image_alt  text not null default '',
  author              text not null default '',
  reading_time        integer,
  featured            boolean not null default false,
  status              text not null default 'draft' check (status in ('draft', 'published')),
  published_at        timestamptz,
  updated_at          timestamptz not null default now(),
  created_at          timestamptz not null default now()
);

create index if not exists blog_posts_published_idx
  on public.blog_posts (status, published_at desc);

alter table public.blog_posts enable row level security;

-- Visitors read published posts only. Drafts stay private.
drop policy if exists "Published posts are public" on public.blog_posts;
create policy "Published posts are public"
  on public.blog_posts for select
  to anon, authenticated
  using (status = 'published');

-- No public insert/update/delete policy exists, so the anon key cannot write.
-- Publish and edit through Supabase Studio (which authenticates you) or a
-- service-role key held on a server. Never put a service-role key in the site.

-- Keep updated_at honest.
create or replace function public.blog_posts_touch()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blog_posts_touch on public.blog_posts;
create trigger blog_posts_touch
  before update on public.blog_posts
  for each row execute function public.blog_posts_touch();

-- Article body format (column: content). Plain text with light markers:
--   ## Heading            -> section heading
--   ### Subheading        -> sub heading
--   - item                -> bullet list
--   > quoted line         -> pull quote
--   **bold**  *italic*    -> emphasis
--   [label](https://…)    -> link
--   ![alt text](https://…) -> image
--   :::takeaway … :::     -> key takeaway box
-- The page converts these to elements, so pasted markup cannot run as code.

-- Example (delete or edit before publishing real content):
-- insert into public.blog_posts
--   (slug, title, excerpt, category, featured_image, featured_image_alt, content, status, published_at, featured)
-- values (
--   'speed-to-lead-medspa',
--   'Speed-to-Lead: The Gap Between Interest and an Appointment',
--   'A closer look at response time, handoffs and the follow-up that helps an inquiry move forward.',
--   'Booking',
--   'https://images.pexels.com/photos/4266947/pexels-photo-4266947.jpeg?auto=compress&cs=tinysrgb&w=800',
--   'Practitioner reviewing information on a tablet with a patient',
--   E'Interest has a short shelf life.\n\n## Treat response time as a system\n\n- A single owner for every inbound channel\n- A visible queue, so nothing waits unseen\n\n:::takeaway\nMeasure the time to first human reply.\n:::',
--   'published',
--   now(),
--   true
-- );
