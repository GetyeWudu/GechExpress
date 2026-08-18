"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useGoogleLogin } from "@react-oauth/google";
import { ShoppingBag, Store, ArrowLeft, ArrowRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_DOCUMENT_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];

const registerSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one uppercase, one lowercase, one number and one special character"),
  confirmPassword: z.string(),

  // Seller specific optional fields
  shopFocus: z.string().optional(),
  tinNumber: z.any().optional(),
  businessLicense: z.any().optional(),
  fayda: z.any().optional(),
  termsAccepted: z.boolean().refine(val => val === true, { message: "You must accept the terms and conditions." }),
  newsletter: z.boolean().optional().default(false),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type Role = "CUSTOMER" | "SELLER";

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto my-8 px-4 sm:px-6">
      {/* Main Glassmorphic Container for the Page */}
      <div className="relative overflow-hidden rounded-[3rem] border border-white/60 dark:border-slate-800/60 bg-white/30 dark:bg-slate-950/30 backdrop-blur-xl shadow-2xl shadow-slate-200/50 dark:shadow-none p-6 sm:p-8">
        
        {/* Decorative Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-primary/20 blur-[80px] pointer-events-none dark:bg-primary/10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-orange-500/20 blur-[80px] pointer-events-none dark:bg-orange-500/10" />

        <div className="relative z-10">
          
          {/* Dynamic Content */}
          <div className="relative min-h-[300px]">
            {selectedRole === null ? (
              <div className="animate-in zoom-in-95 fade-in duration-500">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Join GechExpress
                  </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Selector */}
                  <button
                    onClick={() => setSelectedRole("CUSTOMER")}
                    className="group relative flex flex-col items-center justify-center p-8 h-[260px] rounded-[2rem] border-2 border-transparent bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <div className="p-5 rounded-3xl bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                        <ShoppingBag className="w-12 h-12" strokeWidth={1.5} />
                      </div>
                      <div className="text-center mt-2">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Customer</h3>
                      </div>
                    </div>
                  </button>

                  {/* Seller Selector */}
                  <button
                    onClick={() => setSelectedRole("SELLER")}
                    className="group relative flex flex-col items-center justify-center p-8 h-[260px] rounded-[2rem] border-2 border-transparent bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-500 hover:-translate-y-2 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/20 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <div className="p-5 rounded-3xl bg-orange-500/10 text-orange-500 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500 shadow-inner">
                        <Store className="w-12 h-12" strokeWidth={1.5} />
                      </div>
                      <div className="text-center mt-2">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Seller</h3>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-[440px] mx-auto animate-in slide-in-from-bottom-8 fade-in duration-500">
                <button 
                  onClick={() => setSelectedRole(null)}
                  className="group flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors bg-white/60 dark:bg-slate-900/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md w-fit"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Back
                </button>
                <div className="text-center mb-4">
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Create {selectedRole === "SELLER" ? "Seller" : "Customer"} Account
                  </h1>
                </div>
                <RegistrationForm role={selectedRole} />
              </div>
            )}
          </div>

          {/* Footer - Login Link Containerized */}
          {selectedRole === null && (
            <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex justify-center">
              <div className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 shadow-sm backdrop-blur-md transition-transform hover:scale-105 duration-300">
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                  Already have an account?{" "}
                  <Link href="/login" className="font-bold text-primary hover:text-primary/80 transition-colors ml-1">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function RegistrationForm({ role }: { role: Role }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const isSeller = role === "SELLER";
  const totalSteps = isSeller ? 3 : 2;

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      shopFocus: "",
      termsAccepted: false,
      newsletter: false,
    },
  });

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ['firstName', 'lastName', 'email', 'phone'];
    } else if (currentStep === 2 && isSeller) {
      fieldsToValidate = ['shopFocus', 'tinNumber', 'businessLicense', 'fayda'];
    }

    if (fieldsToValidate.length > 0) {
      const isValid = await form.trigger(fieldsToValidate);
      if (!isValid) return;
    }
    
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockUser = {
        id: Math.floor(Math.random() * 1000),
        email: values.email,
        first_name: values.firstName,
        last_name: values.lastName,
        role: role,
        account_status: "ACTIVE"
      };

      localStorage.setItem("access_token", "mock_access_token");
      localStorage.setItem("refresh_token", "mock_refresh_token");
      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("userAuth", "true");

      toast.success(`Account created successfully as ${role}!`);
      
      if (role === "SELLER") {
        router.push("/seller");
      } else {
        router.push("/customer/settings");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      const mockUser = {
        id: Math.floor(Math.random() * 1000),
        email: "google.user@example.com",
        first_name: "Google",
        last_name: "User",
        role: role,
        account_status: "ACTIVE"
      };

      localStorage.setItem("access_token", "mock_google_access_token");
      localStorage.setItem("refresh_token", "mock_google_refresh_token");
      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("userAuth", "true");

      toast.success(`Account created successfully with Google as ${role}!`);
      if (role === "SELLER") {
        router.push("/seller");
      } else {
        router.push("/customer/settings");
      }
    },
    onError: (error) => toast.error("Google Signup Failed"),
  });

  const btnColorClass = isSeller 
    ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md" 
    : "bg-primary hover:bg-primary/90 shadow-md";

  // Reusable File Input Component
  const FileUploadField = ({ name, label }: { name: any, label: string }) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { value, onChange, ...field } }) => (
        <FormItem>
          <FormLabel className="text-slate-700 dark:text-slate-300">{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input 
                type="file" 
                disabled={isLoading} 
                className="bg-slate-50 dark:bg-slate-900/50 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer pt-1" 
                onChange={(e) => {
                  onChange(e.target.files?.[0]);
                }}
                {...field} 
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-lg shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-none w-full">
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Step 1: Personal Info & Contact */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-5 animate-in slide-in-from-right-4 fade-in duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300">First name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" disabled={isLoading} className="bg-slate-50 dark:bg-slate-900/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300">Last name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" disabled={isLoading} className="bg-slate-50 dark:bg-slate-900/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300">Email address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="name@example.com" disabled={isLoading} className="bg-slate-50 dark:bg-slate-900/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300">Phone number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+1 (555) 000-0000" disabled={isLoading} className="bg-slate-50 dark:bg-slate-900/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          
          {/* Step 2 (Seller): Documents & Info */}
          {currentStep === 2 && isSeller && (
            <div className="flex flex-col gap-5 animate-in slide-in-from-right-4 fade-in duration-500">
              <FormField
                control={form.control}
                name="shopFocus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300">Shop Focus (e.g. Electronics)</FormLabel>
                    <FormControl>
                      <Input placeholder="Electronics" disabled={isLoading} className="bg-slate-50 dark:bg-slate-900/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FileUploadField name="tinNumber" label="TIN Document" />
              <FileUploadField name="businessLicense" label="Business License Document" />
              <FileUploadField name="fayda" label="Fayda Document" />
            </div>
          )}
          
          {/* Step 2 (Customer) / Step 3 (Seller): Security */}
          {((currentStep === 2 && !isSeller) || (currentStep === 3 && isSeller)) && (
            <div className="flex flex-col gap-5 animate-in slide-in-from-right-4 fade-in duration-500">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300">Create password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" disabled={isLoading} className="bg-slate-50 dark:bg-slate-900/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300">Confirm password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" disabled={isLoading} className="bg-slate-50 dark:bg-slate-900/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-normal text-slate-600 dark:text-slate-400 cursor-pointer">
                        I agree to the Terms of Service
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="newsletter"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-normal text-slate-600 dark:text-slate-400 cursor-pointer">
                        Subscribe to newsletter
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          )}
          
          {currentStep < totalSteps ? (
            <Button type="button" onClick={nextStep} className={`w-full h-12 text-base font-medium mt-6 shadow-md ${btnColorClass}`} disabled={isLoading}>
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button type="submit" className={`w-full h-12 text-base font-medium mt-6 shadow-md ${btnColorClass}`} disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Processing...
                </span>
              ) : (
                `Create ${isSeller ? 'Seller' : 'Customer'}`
              )}
            </Button>
          )}

          {currentStep > 1 && (
            <div className="text-center mt-4">
              <button type="button" onClick={prevStep} className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                Back
              </button>
            </div>
          )}
        </form>
      </Form>
      
      <div className="my-8 flex items-center">
        <Separator className="flex-1 dark:bg-slate-800" />
        <span className="mx-4 text-xs font-medium uppercase tracking-wider text-slate-400">Or continue with</span>
        <Separator className="flex-1 dark:bg-slate-800" />
      </div>

      <div className="w-full">
        <Button variant="outline" className="h-12 w-full font-medium" onClick={() => googleLogin()} disabled={isLoading}>
          <svg className="mr-3 h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Sign in with Google
        </Button>
      </div>

      <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline transition-colors">
          Sign in here
        </Link>
      </p>

    </div>
  );
}
