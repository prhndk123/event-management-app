import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { useAuthStore } from "~/store/auth-store";
import { toast } from "sonner";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    role: z.enum(["customer", "organizer"]),
    referralCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register: registerUser, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const defaultRole =
    searchParams.get("role") === "organizer" ? "organizer" : "customer";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: defaultRole,
      referralCode: "",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        referralCode: data.referralCode,
      });
      toast.success("Account created successfully!");
      if (data.referralCode) {
        toast.success("You received 10,000 points from the referral!");
      }
      navigate("/");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&h=1200&fit=crop"
          alt="Event"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-primary/90 to-primary/40" />
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Start Your Event Journey
          </h2>
          <p className="text-lg text-primary-foreground/80">
            Join thousands of event lovers and organizers. Create unforgettable
            experiences together.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Calendar className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">Eventku</span>
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            Create an account
          </h1>
          <p className="text-muted-foreground mb-8">
            Get started with Eventku today
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Role Selection */}
            <div>
              <Label className="mb-3 block">I want to</Label>
              <RadioGroup
                value={selectedRole}
                onValueChange={(value) =>
                  setValue("role", value as "customer" | "organizer")
                }
                className="grid grid-cols-2 gap-4"
              >
                <Label
                  htmlFor="customer"
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedRole === "customer"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem
                    value="customer"
                    id="customer"
                    className="sr-only"
                  />
                  <span className="text-2xl mb-2">🎫</span>
                  <span className="font-medium">Attend Events</span>
                  <span className="text-xs text-muted-foreground">
                    Find & book events
                  </span>
                </Label>
                <Label
                  htmlFor="organizer"
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedRole === "organizer"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem
                    value="organizer"
                    id="organizer"
                    className="sr-only"
                  />
                  <span className="text-2xl mb-2">🎪</span>
                  <span className="font-medium">Organize Events</span>
                  <span className="text-xs text-muted-foreground">
                    Create & manage events
                  </span>
                </Label>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                className="mt-1.5 input-focus"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="mt-1.5 input-focus"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="pr-10 input-focus"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="mt-1.5 input-focus"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="referralCode">Referral Code (Optional)</Label>
              <Input
                id="referralCode"
                placeholder="Enter referral code"
                className="mt-1.5 input-focus"
                {...register("referralCode")}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Get 10,000 points when you sign up with a referral code!
              </p>
            </div>

            <Button
              type="submit"
              className="w-full btn-gradient"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs text-muted-foreground mt-4">
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
