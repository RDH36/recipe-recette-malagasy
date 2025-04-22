-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    email TEXT NOT NULL,
    isPremium BOOLEAN NOT NULL DEFAULT FALSE,
    favorites TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to view their own data
CREATE POLICY user_read_own_data ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY user_update_own_data ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Allow insert to authenticated users (for initial user creation)
CREATE POLICY user_insert_own_data ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle user creation after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, isPremium, favorites)
    VALUES (NEW.id, NEW.email, FALSE, '{}');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user record after auth signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Comment on table
COMMENT ON TABLE public.users IS 'Table storing user profiles and preferences'; 