
-- Add audio_url column to chat_messages
ALTER TABLE public.chat_messages ADD COLUMN audio_url text DEFAULT NULL;

-- Create storage bucket for chat audio
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-audio', 'chat-audio', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for chat-audio bucket
CREATE POLICY "Authenticated users can upload chat audio"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'chat-audio');

CREATE POLICY "Anyone can view chat audio"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'chat-audio');

CREATE POLICY "Users can delete own chat audio"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'chat-audio' AND (storage.foldername(name))[1] = auth.uid()::text);
