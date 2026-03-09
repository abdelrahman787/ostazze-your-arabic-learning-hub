-- Storage policies for lecture-videos bucket
CREATE POLICY "Admins can upload lecture videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'lecture-videos' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Anyone can view lecture videos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'lecture-videos');

CREATE POLICY "Admins can delete lecture videos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'lecture-videos' AND
  public.has_role(auth.uid(), 'admin')
);

-- Storage policies for lecture-pdfs bucket
CREATE POLICY "Admins can upload lecture pdfs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'lecture-pdfs' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Anyone can view lecture pdfs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'lecture-pdfs');

CREATE POLICY "Admins can delete lecture pdfs"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'lecture-pdfs' AND
  public.has_role(auth.uid(), 'admin')
);