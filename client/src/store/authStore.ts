import { create } from 'zustand';

interface AuthState {
   email: string;
   isLoggedIn: boolean;
   accessToken: string | null;
   refreshToken: string | null;
   login: (email: string, accessToken: string, refreshToken: string) => void;
   logout: () => void;
   refreshTokens: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
   // Retrieve authentication state from local storage on initial load
   const storedAuthState = JSON.parse(
      localStorage.getItem('authState') || '{}'
   );

   return {
      email: storedAuthState.email || '',
      isLoggedIn: storedAuthState.isLoggedIn || false,
      accessToken: storedAuthState.accessToken || null,
      refreshToken: storedAuthState.refreshToken || null,
      login: (email, accessToken, refreshToken) => {
         set((state: AuthState) => ({
            ...state,
            email,
            accessToken,
            refreshToken,
            isLoggedIn: true,
         }));
         // Store authentication state in local storage
         localStorage.setItem(
            'authState',
            JSON.stringify({
               email,
               accessToken,
               refreshToken,
               isLoggedIn: true,
            })
         );
      },
      logout: () => {
         // Remove authentication state from local storage
         localStorage.removeItem('authState');
         set((state: AuthState) => ({
            ...state,
            email: '',
            accessToken: null,
            refreshToken: null,
            isLoggedIn: false,
         }));
      },
      refreshTokens: async () => {
         const { refreshToken } = useAuthStore.getState();
         try {
            const response = await fetch(
               'http://localhost:8000/api/token/refresh',
               {
                  method: 'POST',
                  headers: {
                     'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ refreshToken }),
               }
            );

            if (!response.ok) {
               throw new Error('Failed to refresh tokens');
            }

            const { accessToken } = await response.json();
            useAuthStore.setState({
               accessToken,
            });
         } catch (error) {
            console.error('Error refreshing tokens:', error);
            // Handle token refresh failure (e.g., logout user)
         }
      },
   };
});
