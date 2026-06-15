-- Add a public storage bucket for resume avatars. Files are namespaced per
-- user: avatars/{user_id}/{filename}. Public-read so react-pdf can fetch them
-- when rendering the PDF server-side. URLs include the user id but file names
-- are random so they're not trivially enumerable.

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Users can upload/replace/delete files only under their own folder.
create policy "avatars_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars_update_own"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Public read so PDF renderer (and previews) can load the image.
create policy "avatars_public_read"
  on storage.objects for select
  using (bucket_id = 'avatars');
