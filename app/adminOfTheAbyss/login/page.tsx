'use client';

// 1. Import useActionState from 'react' instead of 'react-dom'
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { authenticate } from '@/app/lib/actions';

export default function LoginPage() {
  // 2. Change useFormState to useActionState
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <form action={dispatch} className="bg-gray-900/50 p-8 rounded-lg border border-gray-800 w-96 backdrop-blur-sm">
        <h1 className="text-2xl font-bold mb-6 text-violet-400 tracking-wider">The Abyss - Login</h1>
        
        <div className="mb-4">
          <label className="block text-sm mb-2 text-gray-400">Admin Email</label>
          <input type="email" name="email" required className="w-full p-2 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-violet-500" />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm mb-2 text-gray-400">Password</label>
          <input type="password" name="password" required className="w-full p-2 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-violet-500" />
        </div>
        
        <LoginButton />
        
        {errorMessage && <p className="text-red-500 text-sm mt-4 text-center">{errorMessage}</p>}
      </form>
    </div>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button aria-disabled={pending} type="submit" className="w-full bg-violet-600 hover:bg-violet-500 p-2 rounded font-bold disabled:opacity-50">
      {pending ? 'Verifying...' : 'Enter'}
    </button>
  );
}