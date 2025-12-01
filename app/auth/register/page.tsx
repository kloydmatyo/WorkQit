"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "job_seeker",
    address: "",
    birthdate: "",
    contactNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ 
    score: 0, 
    label: '', 
    color: '', 
    requirements: [] as Array<{ label: string; met: boolean }> 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [urlError, setUrlError] = useState("");
  const [isEntering, setIsEntering] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "google_oauth_not_configured") {
      setUrlError(
        "Google Sign-Up is currently not available. Please use the form below to register."
      );
    } else if (errorParam === "google_oauth_failed") {
      setUrlError(
        "Google Sign-Up failed. Please try again or use the form below."
      );
    }
  }, [searchParams]);

  useEffect(() => {
    const timeout = setTimeout(() => setIsEntering(false), 900);
    return () => clearTimeout(timeout);
  }, []);

  // Password strength calculator with requirements
  const calculatePasswordStrength = (password: string) => {
    const requirements = [
      { label: 'At least 8 characters', met: password.length >= 8 },
      { label: 'At least 12 characters (recommended)', met: password.length >= 12 },
      { label: 'One lowercase letter (a-z)', met: /[a-z]/.test(password) },
      { label: 'One uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
      { label: 'One number (0-9)', met: /[0-9]/.test(password) },
      { label: 'One special character (!@#$%^&*)', met: /[^a-zA-Z0-9]/.test(password) },
    ];

    const score = requirements.filter(req => req.met).length;
    
    if (!password) return { score: 0, label: '', color: '', requirements };

    // Determine label and color
    let label = '';
    let color = '';
    if (score <= 2) {
      label = 'Weak';
      color = 'bg-red-500';
    } else if (score <= 4) {
      label = 'Medium';
      color = 'bg-yellow-500';
    } else {
      label = 'Strong';
      color = 'bg-green-500';
    }

    return { score, label, color, requirements };
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(formData.password));
  }, [formData.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          address: formData.address,
          birthdate: formData.birthdate,
          contactNumber: formData.contactNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requiresVerification) {
          setSuccess(data.message);
          setError("");
        } else {
          router.push("/auth/login?message=Registration successful");
        }
      } else {
        // Show detailed error information
        console.error('Registration error:', data);
        let errorMessage = data.error || "Registration failed";
        
        // Add validation details if available
        if (data.details) {
          errorMessage += `: ${data.details}`;
        }
        
        // Add validation errors if available
        if (data.validationErrors) {
          const validationMessages = Object.values(data.validationErrors)
            .map((err: any) => err.message)
            .join(', ');
          errorMessage += ` - ${validationMessages}`;
        }
        
        setError(errorMessage);
        setSuccess("");
      }
    } catch (error) {
      console.error('Registration exception:', error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Only allow numbers for contact number
    if (name === 'contactNumber') {
      const numbersOnly = value.replace(/[^0-9]/g, '');
      setFormData({
        ...formData,
        [name]: numbersOnly,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <div className="auth-background h-screen flex items-center justify-center overflow-hidden p-4">
      <div className="auth-background-grid" aria-hidden="true" />
      {isEntering && <div className="auth-entry-overlay" />}
      <div
        className={`auth-panel w-full max-w-5xl space-y-4 py-6 md:py-8 auth-panel-pulse ${
          isEntering ? "auth-panel-enter" : ""
        }`}
      >
        <div className="auth-holo-grid" aria-hidden="true" />

        <div className="space-y-2 text-center">
          <h2 className="auth-title text-2xl md:text-3xl lg:text-4xl">Create your account</h2>
          <p className="auth-subtitle text-sm md:text-base">
            Join WorkQit and grow your career
          </p>
          <p className="auth-meta text-xs md:text-sm">
            Or{" "}
            <Link href="/auth/login" className="auth-link">
              sign in to existing account
            </Link>
          </p>
        </div>

        {(error || urlError) && (
          <div className="glass-alert glass-alert-error">
            {urlError || error}
          </div>
        )}

        {success && (
          <div className="glass-alert glass-alert-success">
            {success}
            <div className="mt-2">
              <Link href="/auth/verify-email" className="auth-link">
                Didn't receive the email? Click here to resend
              </Link>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <button
            type="button"
            onClick={() =>
              (window.location.href = `/api/auth/google?role=${formData.role}`)
            }
            className="glass-button py-3 md:py-3.5 text-sm md:text-base"
          >
            <svg className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-sm md:text-base">Sign up with Google</span>
          </button>

          <div className="auth-divider">
            <span className="text-xs md:text-sm">Or continue with</span>
          </div>
        </div>

        <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:gap-5 md:grid-cols-2">
            <div className="space-y-2 text-left">
              <label htmlFor="firstName" className="auth-label text-sm md:text-base">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="glass-input py-2.5 md:py-3 text-sm md:text-base"
              />
            </div>

            <div className="space-y-2 text-left">
              <label htmlFor="lastName" className="auth-label text-sm md:text-base">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="glass-input py-2.5 md:py-3 text-sm md:text-base"
              />
            </div>
          </div>

          <div className="grid gap-4 md:gap-5 md:grid-cols-2">
            <div className="space-y-2 text-left">
              <label htmlFor="email" className="auth-label text-sm md:text-base">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="glass-input py-2.5 md:py-3 text-sm md:text-base"
              />
            </div>

            <div className="space-y-2 text-left">
              <label htmlFor="contactNumber" className="auth-label text-sm md:text-base">
                Contact Number
              </label>
              <input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                required
                placeholder="1234567890"
                value={formData.contactNumber}
                onChange={handleChange}
                pattern="[0-9]*"
                inputMode="numeric"
                className="glass-input py-2.5 md:py-3 text-sm md:text-base"
              />
            </div>
          </div>

          <div className="grid gap-4 md:gap-5 md:grid-cols-2">
            <div className="space-y-2 text-left">
              <label htmlFor="birthdate" className="auth-label text-sm md:text-base">
                Date of Birth
              </label>
              <input
                id="birthdate"
                name="birthdate"
                type="date"
                required
                value={formData.birthdate}
                onChange={handleChange}
                className="glass-input py-2.5 md:py-3 text-sm md:text-base"
              />
            </div>

            <div className="space-y-2 text-left">
              <label htmlFor="role" className="auth-label text-sm md:text-base">
                I am a
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="glass-input py-2.5 md:py-3 text-sm md:text-base"
              >
                <option value="job_seeker">Job Seeker</option>
                <option value="student">Student</option>
                <option value="employer">Employer</option>
                <option value="mentor">Mentor</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 text-left">
            <label htmlFor="address" className="auth-label text-sm md:text-base">
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              required
              placeholder="Street, City, State, ZIP"
              value={formData.address}
              onChange={handleChange}
              className="glass-input py-2.5 md:py-3 text-sm md:text-base"
            />
          </div>

          <div className="grid gap-4 md:gap-5 md:grid-cols-2">
            <div className="space-y-2 text-left">
              <label htmlFor="password" className="auth-label text-sm md:text-base">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="glass-input py-2.5 md:py-3 text-sm md:text-base pr-10 md:pr-12"
                  title="Password must be at least 8 characters with uppercase, lowercase, number, and special character"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 md:h-5 md:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 md:h-5 md:w-5" />
                  )}
                </button>
              </div>
              {formData.password && (
                <div className="space-y-1.5 mt-1.5">
                  <div className="flex gap-1">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 md:h-1.5 flex-1 rounded-full transition-colors ${
                          i < passwordStrength.score
                            ? passwordStrength.color
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs md:text-sm font-medium ${
                    passwordStrength.label === 'Weak' ? 'text-red-500' :
                    passwordStrength.label === 'Medium' ? 'text-yellow-500' :
                    'text-green-500'
                  }`}>
                    Password Strength: {passwordStrength.label}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-1 text-[10px] md:text-xs">
                    {passwordStrength.requirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-1.5">
                        <span className={`${req.met ? 'text-green-500' : 'text-gray-400'} flex-shrink-0 text-sm`}>
                          {req.met ? '✓' : '○'}
                        </span>
                        <span className={`${req.met ? 'text-green-600' : 'text-gray-500'} truncate`}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 text-left">
              <label htmlFor="confirmPassword" className="auth-label text-sm md:text-base">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="glass-input py-2.5 md:py-3 text-sm md:text-base pr-10 md:pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 md:h-5 md:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 md:h-5 md:w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary auth-button w-full py-3 md:py-3.5 text-sm md:text-base disabled:cursor-wait disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
