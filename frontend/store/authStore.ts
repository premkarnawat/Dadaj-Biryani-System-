import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user }),

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },

  initialize: async () => {
    // Restore existing session (survives 30-day expiry via refresh token)
    const { data: { session } } = await supabase.auth.getSession();
    set({ user: session?.user ?? null, loading: false, initialized: true });

    // Listen for auth changes (login, logout, token refresh)
    supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user ?? null;
      set({ user });

      // On any sign-in: upsert public.users so the row always exists
      // This handles: first-time login AND returning user after 30 days
      // The ON CONFLICT DO UPDATE means existing users are never duplicated
      if (user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED')) {
        await supabase.from('users').upsert(
          {
            id:        user.id,
            email:     user.email ?? '',
            full_name: user.user_metadata?.full_name ?? null,
            phone:     user.user_metadata?.phone     ?? null,
          },
          { onConflict: 'id' }   // never creates a new row — updates existing
        );
      }
    });
  },
}));
