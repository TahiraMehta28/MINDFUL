
-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create emergency contacts table
CREATE TABLE public.emergency_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  relationship TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create location logs table
CREATE TABLE public.location_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Create emergency alerts table
CREATE TABLE public.emergency_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  message TEXT,
  contacts_notified TEXT[],
  triggered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create activity sessions table
CREATE TABLE public.activity_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  total_duration INTEGER, -- in minutes
  date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for emergency contacts
CREATE POLICY "Users can view their own emergency contacts" ON public.emergency_contacts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own emergency contacts" ON public.emergency_contacts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own emergency contacts" ON public.emergency_contacts
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own emergency contacts" ON public.emergency_contacts
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for location logs
CREATE POLICY "Users can view their own location logs" ON public.location_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own location logs" ON public.location_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for emergency alerts
CREATE POLICY "Users can view their own emergency alerts" ON public.emergency_alerts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own emergency alerts" ON public.emergency_alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for activity sessions
CREATE POLICY "Users can view their own activity sessions" ON public.activity_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own activity sessions" ON public.activity_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own activity sessions" ON public.activity_sessions
  FOR UPDATE USING (auth.uid() = user_id);
