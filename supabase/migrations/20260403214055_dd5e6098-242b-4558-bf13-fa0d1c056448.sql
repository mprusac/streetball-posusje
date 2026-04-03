INSERT INTO storage.buckets (id, name, public) VALUES ('gallery-images', 'gallery-images', true);

CREATE POLICY "Anyone can view gallery images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'gallery-images');

CREATE POLICY "Service role can upload gallery images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'gallery-images');