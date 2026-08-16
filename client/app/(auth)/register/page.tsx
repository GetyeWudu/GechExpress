"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useGoogleLogin } from "@react-oauth/google";
import { API_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const registerSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    try {
      // Mock Backend Register for Frontend Testing
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockUser = {
        id: Math.floor(Math.random() * 1000),
        email: values.email,
        first_name: values.firstName,
        last_name: values.lastName,
        role: "CUSTOMER",
        account_status: "ACTIVE"
      };

      localStorage.setItem("access_token", "mock_access_token");
      localStorage.setItem("refresh_token", "mock_refresh_token");
      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("userAuth", "true");

      toast.success("Account created successfully!");
      
      if (mockUser.role === "ADMIN") {
        router.push("/admin");
      } else if (mockUser.role === "SELLER") {
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
      // Mock successful google registration/login
      const mockUser = {
        id: Math.floor(Math.random() * 1000),
        email: "google.user@example.com",
        first_name: "Google",
        last_name: "User",
        role: "CUSTOMER",
        account_status: "ACTIVE"
      };

      localStorage.setItem("access_token", "mock_google_access_token");
      localStorage.setItem("refresh_token", "mock_google_refresh_token");
      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("userAuth", "true");

      toast.success("Account created successfully with Google!");
      router.push("/customer/settings");
    },
    onError: (error) => toast.error("Google Signup Failed"),
  });

  const handleGoogleLogin = () => {
    googleLogin();
  };

  return (
    <div className="w-full max-w-[500px] space-y-8 my-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Create an account
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Join GechExpress for faster checkout and exclusive offers
        </p>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-lg shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Name Grid */}
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

            {/* Contact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
            
            {/* Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
            </div>
            
            <Button type="submit" className="w-full h-12 text-base font-medium mt-8 shadow-md" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </Form>

        <div className="my-8 flex items-center">
          <Separator className="flex-1 dark:bg-slate-800" />
          <span className="mx-4 text-xs font-medium uppercase tracking-wider text-slate-400">Or continue with</span>
          <Separator className="flex-1 dark:bg-slate-800" />
        </div>

        <div className="w-full">
          <Button variant="outline" className="h-12 w-full font-medium" onClick={handleGoogleLogin} disabled={isLoading}>
            <svg className="mr-3 h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Sign up with Google
          </Button>
        </div>
        
        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
