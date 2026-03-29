
CREATE TABLE public.ai_chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.ai_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.ai_chat_conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_conv_select" ON public.ai_chat_conversations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "ai_conv_insert" ON public.ai_chat_conversations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ai_conv_delete" ON public.ai_chat_conversations FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "ai_msg_select" ON public.ai_chat_messages FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.ai_chat_conversations c WHERE c.id = conversation_id AND c.user_id = auth.uid())
);
CREATE POLICY "ai_msg_insert" ON public.ai_chat_messages FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.ai_chat_conversations c WHERE c.id = conversation_id AND c.user_id = auth.uid())
);
