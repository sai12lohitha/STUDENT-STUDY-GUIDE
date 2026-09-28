import React, { useState } from 'react';
import { GraduationCap, X, Mail, Lock, User, CheckCircle2 } from 'lucide-react';
import { useStudent } from '../context/StudentContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, signup, authUser, logout } = useStudent();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup') {
      signup(name || 'Alex Chen', email || 'student@university.edu');
      onClose();
    } else if (mode === 'login') {
      login(email || 'alex.chen@university.edu', name || 'Alex Chen');
      onClose();
    } else if (mode === 'forgot') {
      setForgotSubmitted(true);
      setTimeout(() => {
        setForgotSubmitted(false);
        setMode('login');
      }, 2500);
    }
  };

  const handleDemoLogin = () => {
    login('alex.chen@university.edu', 'Alex Chen');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              StudentPilot Account
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {authUser ? (
          <div className="mt-4 space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Logged in as {authUser.name}
              </h3>
              <p className="text-xs text-slate-500">{authUser.email}</p>
            </div>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white hover:bg-rose-700"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <div className="mb-4 flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-950">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                  mode === 'signup'
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                Sign Up
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="py-6 text-center text-xs text-emerald-600">
                Password reset link sent to your email! Returning to login...
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {mode === 'signup' && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Full Name
                    </label>
                    <div className="relative mt-1">
                      <User className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Alex Chen"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <div className="relative mt-1">
                    <Mail className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="student@university.edu"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                {mode !== 'forgot' && (
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Password
                      </label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => setMode('forgot')}
                          className="text-[11px] text-indigo-600 hover:underline dark:text-indigo-400"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative mt-1">
                      <Lock className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  {mode === 'login'
                    ? 'Log In to StudentPilot'
                    : mode === 'signup'
                    ? 'Create Free Student Account'
                    : 'Send Reset Instructions'}
                </button>

                <div className="relative my-3 text-center text-xs text-slate-400">
                  <span className="bg-white px-2 dark:bg-slate-900">or</span>
                </div>

                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Quick Launch with Alex Chen Demo Data
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
