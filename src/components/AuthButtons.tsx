import React, { useState } from 'react';
import { LogIn, LogOut, UserPlus, User, Mail, Phone, UserCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'signin' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, type }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
  
    try {
      let userData = null;
  
      if (type === 'signup') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
  
        // Sign up user
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
  
        if (signUpError) throw signUpError;
  
        if (authData.user) {
          // Insert user details into 'profiles' table
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: authData.user.id,
                email: email,
                full_name: fullName,
                phone: phone,
              },
            ]);
  
          if (profileError) throw profileError;
  
          // Store user data in Local Storage
          userData = { email, full_name: fullName };
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } else {
        // Handle sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
  
        if (signInError) throw signInError;
  
        if (signInData.user) {
          // Fetch user profile from Supabase
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', signInData.user.id)
            .single();
  
          if (profileError) throw profileError;
  
          // Store user data in Local Storage
          userData = { email: profileData.email, full_name: profileData.full_name };
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }
  
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 h-screen w-screen bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">
          {type === 'signin' ? 'Sign In' : 'Create an Account'}
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'signup' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          {type === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          )}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? 'Loading...'
                : type === 'signin'
                ? 'Sign In'
                : 'Sign Up'}
            </button>
          </div>
          {type === 'signin' && (
            <p className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setTimeout(() => openModal('signup'), 100);
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign up here
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

interface UserProfileProps {
  session: any;
  onSignOut: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ session, onSignOut }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, email, phone')
          .eq('id', session.user.id)
          .single();

        if (!error && data) {
          setProfileData(data);
        }
      }
    };

    fetchProfile();
  }, [session]);

  const fullName = profileData?.full_name || 'User Profile';
  const email = profileData?.email || session?.user?.email || '';

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
      >
        <User className="w-5 h-5" />
        <span>{fullName}</span>
      </button>
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 rounded-full p-2">
                <UserCircle className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{fullName}</p>
                <p className="text-xs text-gray-400">@{email.split('@')[0]}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <p className="truncate">{email}</p>
              </div>
              {profileData?.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <p>{profileData.phone}</p>
                </div>
              )}
            </div>
          </div>
          <div className="px-2 py-1">
            <button
              onClick={onSignOut}
              className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function AuthButtons() {
  const [session, setSession] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'signin' | 'signup'>('signin');

  React.useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const openModal = (type: 'signin' | 'signup') => {
    setModalType(type);
    setShowModal(true);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {session ? (
          <UserProfile session={session} onSignOut={handleSignOut} />
        ) : (
          <>
            <button
              onClick={() => openModal('signin')}
              className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
            <button
              onClick={() => openModal('signup')}
              className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </button>
          </>
        )}
      </div>
      <AuthModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type={modalType}
      />
    </>
  );
}