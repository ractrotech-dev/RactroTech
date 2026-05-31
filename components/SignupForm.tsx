'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormState, useFormStatus } from 'react-dom';
import { signup } from '@/app/auth/actions';
import { Eye, EyeOff, RefreshCw, ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

function SignupSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="w-full mt-6 border-2 border-black bg-black py-6 text-sm font-black tracking-widest text-yellow-400 transition-all hover:-translate-y-1 hover:bg-black/90 active:translate-y-0"
      type="submit"
      aria-disabled={pending}
      disabled={pending}
    >
      {pending ? "Creating account..." : "Submit Signup"}
    </Button>
  );
}

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  
  const initialState = {
    message: '',
  };

  const [formState, formAction] = useFormState(signup, initialState);

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let newPass = "";
    for (let i = 0; i < 14; i++) {
      newPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPass);
    if (!showPassword) setShowPassword(true);
  };

  const strength = useMemo(() => {
    if (!password) return 0;
    let s = 0;
    if (password.length > 8) s += 1;
    if (/[A-Z]/.test(password)) s += 1;
    if (/[a-z]/.test(password)) s += 1;
    if (/[0-9]/.test(password)) s += 1;
    if (/[^A-Za-z0-9]/.test(password)) s += 1;
    return s;
  }, [password]);

  const strengthColor = () => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 4) return 'bg-yellow-400';
    return 'bg-emerald-500';
  };

  const strengthText = () => {
    if (strength <= 2) return 'Weak';
    if (strength <= 4) return 'Medium';
    return 'Strong';
  };

  const StrengthIcon = () => {
    if (strength <= 2) return <ShieldAlert size={12} />;
    if (strength <= 4) return <Shield size={12} />;
    return <ShieldCheck size={12} />;
  };

  return (
    <form action={formAction} className="space-y-3">
      <div className="retro-card border-2 bg-white p-2 transition-colors hover:bg-yellow-50">
        <Label htmlFor="name" className="mb-1 block text-[9px] font-black tracking-wide text-black/40">
          01. Full Name
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="NAME..."
          name="name"
          required
          className="h-auto w-full border-0 border-b-2 border-black/10 bg-transparent px-0 py-0.5 text-base font-bold tracking-tight text-black shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      <div className="retro-card border-2 bg-white p-2 transition-colors hover:bg-yellow-50">
        <Label htmlFor="phone" className="mb-1 block text-[9px] font-black tracking-wide text-black/40">
          02. Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="NUMBER..."
          name="phone"
          required
          className="h-auto w-full border-0 border-b-2 border-black/10 bg-transparent px-0 py-0.5 text-base font-bold tracking-tight text-black shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      <div className="retro-card border-2 bg-white p-2 transition-colors hover:bg-yellow-50">
        <Label htmlFor="email" className="mb-1 block text-[9px] font-black tracking-wide text-black/40">
          03. Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="EMAIL@COMPANY.COM"
          name="email"
          required
          className="h-auto w-full border-0 border-b-2 border-black/10 bg-transparent px-0 py-0.5 text-base font-bold tracking-tight text-black shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      <div className="retro-card border-2 bg-white p-2 transition-colors hover:bg-yellow-50">
        <Label htmlFor="address" className="mb-1 block text-[9px] font-black tracking-wide text-black/40">
          04. Address
        </Label>
        <Input
          id="address"
          type="text"
          placeholder="STREET, CITY..."
          name="address"
          required
          className="h-auto w-full border-0 border-b-2 border-black/10 bg-transparent px-0 py-0.5 text-base font-bold tracking-tight text-black shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      <div className="retro-card border-2 bg-white p-2 transition-colors hover:bg-yellow-50">
        <div className="flex items-center justify-between mb-1">
          <Label htmlFor="password" className="block text-[9px] font-black tracking-wide text-black/40">
            05. Password
          </Label>
          <button
            type="button"
            onClick={generatePassword}
            className="flex items-center gap-1 text-[9px] font-black tracking-wider text-blue-600 hover:text-blue-800"
          >
            <RefreshCw size={10} />
            Suggest
          </button>
        </div>
        
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-auto w-full border-0 border-b-2 border-black/10 bg-transparent px-0 py-0.5 pr-8 text-base font-bold tracking-tight text-black shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-black/40 hover:text-black"
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>

        {/* Strength Meter */}
        {password && (
          <div className="mt-2 space-y-1">
            <div className="flex h-1 w-full gap-0.5 overflow-hidden rounded-full bg-black/5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i}
                  className={`h-full flex-1 transition-all duration-500 ${i <= strength ? strengthColor() : 'bg-transparent'}`}
                />
              ))}
            </div>
            <div className={`flex items-center gap-1 text-[8px] font-black tracking-widest ${strength > 2 ? (strength > 4 ? 'text-emerald-600' : 'text-yellow-600') : 'text-red-600'}`}>
              <StrengthIcon />
              {strengthText()}
            </div>
          </div>
        )}
      </div>

      <SignupSubmitButton />

      {formState?.message && (
        <div className="mt-4 border-2 border-red-500 bg-red-50 p-3">
          <p className="text-center text-xs font-bold text-red-600">{formState.message}</p>
        </div>
      )}
    </form>
  );
}
