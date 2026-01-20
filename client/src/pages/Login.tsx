
import React, { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Smartphone, Mail, ArrowRight, ShieldCheck, LockKeyhole, ChevronLeft } from "lucide-react";
import { UNIFORM_INPUT_CLASSES } from "@/components/workforce/form-styles";

export default function Login() {
  const [, setLocation] = useLocation();
  const [authMethod, setAuthMethod] = useState<"email" | "mobile">("email");
  const [mobileStep, setMobileStep] = useState<"input" | "otp">("input");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(0); // 30s timer for resend
  
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Timer logic for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate sending OTP
    setTimeout(() => {
      setIsLoading(false);
      setMobileStep("otp");
      setTimer(30);
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
          document.getElementById(`otp-${index - 1}`)?.focus();
      }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setLocation("/");
      setIsLoading(false);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setLocation("/");
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white flex font-sans overflow-hidden">
      {/* Left Column: World-Class Premium Design (Non-Blue) */}
      <div className="hidden lg:flex w-5/12 bg-neutral-900 relative flex-col text-white p-16 justify-between overflow-hidden">
          {/* Subtle automated geometric patterns */}
          <div className="absolute inset-0 opacity-20" 
              style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                  backgroundSize: '32px 32px'
              }}
          />
          
          {/* Abstract glowing orbs for depth */}
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-neutral-800/50 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-neutral-800/30 rounded-full blur-[100px]" />

          <div className="z-10 relative">
               <div className="flex items-center gap-3 mb-16">
                  <div className="h-10 w-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center text-white border border-white/20">
                      <Building2 className="h-5 w-5" />
                  </div>
                  <span className="text-xl font-bold tracking-tight font-heading">Workbook</span>
              </div>
              
              <div className="space-y-8 max-w-lg">
                <h1 className="text-5xl font-heading font-medium leading-[1.1] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                   Precision in every process.
                </h1>
                <p className="text-neutral-400 text-lg leading-relaxed font-light border-l-2 border-white/20 pl-6">
                    Orchestrate your workforce, finance, and operations from a single, unified command center designed for scale.
                </p>
              </div>
          </div>

          <div className="z-10 relative">
                <div className="flex items-center gap-4 group cursor-default">
                    <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-sm group-hover:scale-105 transition-transform duration-500">
                         <LockKeyhole className="h-5 w-5 text-neutral-300" />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">Security First</p>
                        <p className="text-sm text-neutral-300">Enterprise-grade encryption & compliance</p>
                    </div>
                </div>
          </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-[420px] p-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-left mb-10">
                <h2 className="text-3xl font-heading font-bold text-gray-900 mb-2">
                    {mobileStep === "otp" && authMethod === "mobile" ? "Enter OTP Code" : "Sign in to Workbook"}
                </h2>
                <p className="text-gray-500">
                    {mobileStep === "otp" && authMethod === "mobile" 
                        ? `We sent a code to +974 ${formData.mobile}`
                        : "Welcome back! Please enter your details."
                    }
                </p>
            </div>

            {/* OTP Step Form */}
            {authMethod === "mobile" && mobileStep === "otp" ? (
                 <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div className="flex gap-3 justify-center my-6">
                        {otp.map((digit, i) => (
                            <input
                                key={i}
                                id={`otp-${i}`}
                                type="text"
                                maxLength={1}
                                className="w-14 h-16 text-center text-2xl font-bold border rounded-xl border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-gray-50 text-gray-900 placeholder:text-gray-300"
                                value={digit}
                                onChange={(e) => handleOtpChange(i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                autoFocus={i === 0}
                            />
                        ))}
                    </div>

                    <Button 
                        type="submit" 
                        size="lg"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-medium rounded-lg transition-all"
                        disabled={isLoading || otp.join("").length !== 4}
                    >
                        {isLoading ? "Verifying..." : "Verify & Sign In"}
                    </Button>

                    <div className="flex items-center justify-between text-sm">
                        <button 
                            type="button" 
                            className="text-gray-500 hover:text-gray-900 flex items-center gap-1"
                            onClick={() => setMobileStep("input")}
                        >
                            <ChevronLeft className="h-4 w-4" /> Change Number
                        </button>
                        
                        <button 
                            type="button" 
                            disabled={timer > 0}
                            className={`font-medium ${timer > 0 ? "text-gray-400" : "text-blue-600 hover:underline"}`}
                            onClick={() => setTimer(30)}
                        >
                            {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
                        </button>
                    </div>
                 </form>
            ) : (
                <form onSubmit={authMethod === "email" ? handleSubmit : handleSendOtp} className="space-y-6">
                {/* Auth Method Toggle */}
                <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100/80 rounded-lg mb-8">
                    <button
                        type="button"
                        onClick={() => setAuthMethod("email")}
                        className={`text-sm font-medium py-2.5 rounded-md transition-all duration-200 flex items-center justify-center gap-2 ${
                            authMethod === "email" 
                            ? "bg-white text-blue-600 shadow-sm" 
                            : "text-gray-500 hover:text-gray-900"
                        }`}
                    >
                        <Mail className="h-4 w-4" />
                        Email
                    </button>
                    <button
                        type="button"
                        onClick={() => setAuthMethod("mobile")}
                        className={`text-sm font-medium py-2.5 rounded-md transition-all duration-200 flex items-center justify-center gap-2 ${
                            authMethod === "mobile" 
                            ? "bg-white text-blue-600 shadow-sm" 
                            : "text-gray-500 hover:text-gray-900"
                        }`}
                    >
                        <Smartphone className="h-4 w-4" />
                        Mobile
                    </button>
                </div>

                <div className="space-y-5">
                    {authMethod === "email" ? (
                        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Work Email
                                </Label>
                                <Input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                className={UNIFORM_INPUT_CLASSES}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                autoFocus
                                />
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="password" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Password
                                    </Label>
                                    <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                                        Forgot password?
                                    </a>
                                </div>
                                <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className={UNIFORM_INPUT_CLASSES}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-1.5 animate-in fade-in zoom-in-95 duration-300">
                            <Label htmlFor="mobile" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Mobile Number
                            </Label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-gray-200 pr-3 mr-2 select-none">
                                    <span className="text-xl">🇶🇦</span>
                                    <span className="text-sm font-semibold text-gray-600">+974</span>
                                </div>
                                <Input
                                    id="mobile"
                                    type="tel"
                                    className={`${UNIFORM_INPUT_CLASSES} pl-28 font-mono text-base h-12`}
                                    placeholder="3300 0000"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                    required
                                    autoFocus
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                                We'll send you a one-time verification code.
                            </p>
                        </div>
                    )}
                </div>

                <Button 
                    type="submit" 
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-medium shadow-xl shadow-blue-200/50 rounded-lg transition-all hover:translate-y-[-1px] active:translate-y-[0px] flex items-center justify-center gap-2 mt-2"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        "Processing..." 
                    ) : (
                        authMethod === "mobile" ? "Get OTP Code" : "Sign In"
                    )}
                </Button>

                <div className="pt-6 text-center">
                    <span className="text-sm text-gray-500">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-blue-600 font-bold hover:underline transition-colors">
                            Start 30-day free trial
                        </Link>
                    </span>
                </div>
                </form>
            )}
        </div>
        
        <div className="absolute bottom-6 flex items-center gap-6 text-[10px] uppercase tracking-widest text-gray-400 font-medium">
             <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
             <span className="w-0.5 h-0.5 rounded-full bg-gray-300"></span>
             <a href="#" className="hover:text-gray-600 transition-colors">Terms</a>
             <span className="w-0.5 h-0.5 rounded-full bg-gray-300"></span>
             <span>Workbook © 2026</span>
        </div>
      </div>
    </div>
  );
}
