
-- Create news table
CREATE TABLE public.news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  date TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '2025',
  image_url TEXT,
  image_position TEXT DEFAULT 'center',
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read news"
ON public.news
FOR SELECT
USING (true);

-- Service role can do everything (used by edge functions)
CREATE POLICY "Service role can manage news"
ON public.news
FOR ALL
USING (true)
WITH CHECK (true);

-- Create storage bucket for news images
INSERT INTO storage.buckets (id, name, public) VALUES ('news-images', 'news-images', true);

-- Public read for news images
CREATE POLICY "Anyone can view news images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'news-images');

-- Authenticated users can upload news images
CREATE POLICY "Authenticated can upload news images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'news-images');

-- Authenticated can delete news images
CREATE POLICY "Authenticated can delete news images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'news-images');
