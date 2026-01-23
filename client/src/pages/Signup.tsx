import React, { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"; // Assuming this exists or I'll use standard input
import { Building2, CheckCircle2, AlertCircle } from "lucide-react";
import { UNIFORM_INPUT_CLASSES } from "@/components/workforce/form-styles";

export default function Signup() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    mobile: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Email validation regex (simple)
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};
    let hasError = false;

    // 1. Password Validation
    if (formData.password.length < 8) {
        newErrors.password = "Password cannot be less than 8 characters";
        hasError = true;
    }

    // 2. Existing Email Check (Simulation)
    if (formData.email.toLowerCase() === "demo@workbook.com" || formData.email.toLowerCase() === "test@example.com") {
        newErrors.email = "An account already exists for this email address. Sign in or use a different email address to sign up.";
        hasError = true;
    }
    
    if (!formData.agreeToTerms) {
        // Technically simple validation, visual feedback could be added
        hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Navigate to Create Organization page with Company Name pre-filled
      // Using query param to pass the company name
      const targetUrl = `/organizations/create?name=${encodeURIComponent(formData.companyName)}`;
      setLocation(targetUrl);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex font-sans overflow-hidden">
      {/* Left Column: Visuals & Value Props */}
      {/* Left Column: Visuals & Value Props (World Class Dark Neutral) */}
      <div className="hidden lg:flex w-5/12 bg-neutral-900 relative flex-col text-white p-12 justify-between">
          <div className="z-10">
               <div className="flex items-center gap-2 mb-8">
                  <div className="h-10 w-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-white border border-white/20">
                      <Building2 className="h-6 w-6" />
                  </div>
                  <span className="text-xl font-bold tracking-tight font-heading">Workbook</span>
              </div>
              
              <h1 className="text-4xl font-heading font-medium leading-[1.2] mb-6">
                  Manage your business with comprehensive tools.
              </h1>
              <p className="text-neutral-400 text-lg mb-10 leading-relaxed font-light">
                  Join thousands of forward-thinking businesses who trust Workbook to streamline their operations, finance, and workforce.
              </p>

              <div className="space-y-4">
                  {[
                      "End-to-end Field Service Management",
                      "Integrated HR & Payroll",
                      "Real-time Dispatching & Tracking",
                      "Automated Billing & Invoicing"
                  ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-neutral-500" />
                          <span className="font-medium text-neutral-300">{feature}</span>
                      </div>
                  ))}
              </div>
          </div>

          <div className="z-10">
                <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10">
                    <div className="flex gap-1 mb-3">
                        {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-500 text-lg">★</span>)}
                    </div>
                    <p className="italic text-neutral-300 mb-4 font-light">"Workbook transformed how we handle our daily dispatching. It's simply the best tool we've used in years."</p>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-neutral-700/50 rounded-full flex items-center justify-center font-bold text-sm">JD</div>
                        <div>
                            <p className="font-semibold text-sm">John D.</p>
                            <p className="text-neutral-500 text-xs">Operations Director</p>
                        </div>
                    </div>
                </div>
          </div>

          {/* Abstract Background Decoration */}
          <div className="absolute top-0 right-0 p-0 pointer-events-none opacity-5">
               <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
                    <circle cx="300" cy="100" r="200" stroke="white" strokeWidth="40" />
                    <circle cx="300" cy="100" r="150" stroke="white" strokeWidth="2" />
               </svg>
          </div>
      </div>

      {/* Right Column: Sign Up Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 overflow-y-auto">
        <div className="w-full max-w-[550px] space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="text-left mb-8">
                <h2 className="text-3xl font-heading font-bold text-gray-900 mb-2">Try Workbook for free</h2>
                <p className="text-gray-500 text-lg">
                    Start your 30-day free trial. No credit card required.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <Label htmlFor="firstName" className="text-xs font-bold text-gray-700 uppercase tracking-wide">First Name</Label>
                        <Input
                            id="firstName"
                            placeholder="John"
                            className={UNIFORM_INPUT_CLASSES}
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="lastName" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Last Name</Label>
                        <Input
                            id="lastName"
                            placeholder="Doe"
                            className={UNIFORM_INPUT_CLASSES}
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            required
                        />
                    </div>
                </div>

                {/* Company Name */}
                <div className="space-y-1.5">
                    <Label htmlFor="companyName" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Company Name</Label>
                    <Input
                        id="companyName"
                        placeholder="Company Name LLC"
                        className={UNIFORM_INPUT_CLASSES}
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        required
                    />
                </div>

                 {/* Work Email */}
                 <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Work Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="name@company.com"
                        className={`${UNIFORM_INPUT_CLASSES} ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}`}
                        value={formData.email}
                        onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (errors.email) setErrors({...errors, email: undefined});
                        }}
                        required
                    />
                    {errors.email && (
                        <p className="text-xs text-red-600 flex items-start mt-1 animate-in fade-in slide-in-from-top-1">
                            <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0 mt-0.5" />
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Mobile */}
                <div className="space-y-1.5">
                    <Label htmlFor="mobile" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Mobile Number</Label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-gray-300 pr-3 mr-2 select-none">
                            <span className="text-lg">🇶🇦</span>
                            <span className="text-sm font-medium text-gray-600">+974</span>
                        </div>
                        <Input
                            id="mobile"
                            type="tel"
                            className={`${UNIFORM_INPUT_CLASSES} pl-28 font-mono`}
                            placeholder="3300 0000"
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            required
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Minimum 8 characters"
                        className={`${UNIFORM_INPUT_CLASSES} ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}`}
                        value={formData.password}
                        onChange={(e) => {
                            setFormData({ ...formData, password: e.target.value });
                            if (errors.password) setErrors({...errors, password: undefined});
                        }}
                        required
                    />
                     {errors.password && (
                        <p className="text-xs text-red-600 flex items-center mt-1 animate-in fade-in slide-in-from-top-1">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 pt-2">
                     <div className="flex items-center h-5">
                         <Checkbox
                            id="terms"
                            className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            checked={formData.agreeToTerms}
                            onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
                         />
                     </div>
                     <div className="text-xs leading-relaxed text-gray-500">
                        <label htmlFor="terms" className="cursor-pointer">
                            I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
                        </label>
                     </div>
                </div>

                <Button 
                    type="submit" 
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold shadow-xl shadow-blue-200/50 rounded-lg transition-all"
                    disabled={isLoading}
                >
                    {isLoading ? "creating Account..." : "Create my account"}
                </Button>

                <div className="text-center pt-2">
                    <span className="text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-600 font-bold hover:underline">
                            Login here
                        </Link>
                    </span>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}
