import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone_number: string | null;
  created_at: string;
  updated_at: string;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone_number: string;
  relationship: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  emergencyContacts: EmergencyContact[];
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error: any }>;
  register: (email: string, password: string, fullName: string, phoneNumber: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  addEmergencyContact: (contact: { name: string; phone_number: string; relationship?: string }) => Promise<{ error: any }>;
  removeEmergencyContact: (id: string) => Promise<{ error: any }>;
  fetchEmergencyContacts: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile
          setTimeout(() => {
            fetchUserProfile(session.user.id);
            fetchEmergencyContacts();
          }, 0);
        } else {
          setProfile(null);
          setEmergencyContacts([]);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
        fetchEmergencyContacts();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchEmergencyContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching emergency contacts:', error);
        return;
      }

      setEmergencyContacts(data || []);
    } catch (error) {
      console.error('Error fetching emergency contacts:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email Not Verified",
            description: "Please check your email and click the verification link before signing in.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive",
          });
        }
      }

      return { error };
    } catch (error) {
      console.error('Login error:', error);
      return { error };
    }
  };

  const register = async (email: string, password: string, fullName: string, phoneNumber: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
            phone_number: phoneNumber,
          }
        }
      });

      if (error) {
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      // Create profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            full_name: fullName,
            phone_number: phoneNumber,
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }

        // Check if user is immediately confirmed (email confirmation disabled)
        if (data.user.email_confirmed_at) {
          toast({
            title: "Welcome to SafeSphere!",
            description: "Your account has been created successfully.",
          });
        } else {
          toast({
            title: "Check Your Email",
            description: "Please verify your email address to complete registration.",
          });
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Registration error:', error);
      return { error };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setEmergencyContacts([]);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const addEmergencyContact = async (contact: { name: string; phone_number: string; relationship?: string }) => {
    try {
      if (!user) {
        return { error: new Error('User not authenticated') };
      }

      const { error } = await supabase
        .from('emergency_contacts')
        .insert({
          user_id: user.id,
          name: contact.name,
          phone_number: contact.phone_number,
          relationship: contact.relationship || null,
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add emergency contact",
          variant: "destructive",
        });
        return { error };
      }

      await fetchEmergencyContacts();
      toast({
        title: "Success",
        description: "Emergency contact added successfully",
      });

      return { error: null };
    } catch (error) {
      console.error('Error adding emergency contact:', error);
      return { error };
    }
  };

  const removeEmergencyContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('emergency_contacts')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to remove emergency contact",
          variant: "destructive",
        });
        return { error };
      }

      await fetchEmergencyContacts();
      toast({
        title: "Success",
        description: "Emergency contact removed successfully",
      });

      return { error: null };
    } catch (error) {
      console.error('Error removing emergency contact:', error);
      return { error };
    }
  };

  const value = {
    user,
    profile,
    emergencyContacts,
    session,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!session,
    loading,
    addEmergencyContact,
    removeEmergencyContact,
    fetchEmergencyContacts,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
