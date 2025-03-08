"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuthStore } from "@/store/(auth)/auth-store";
import { toast } from "sonner";
import { ICreateUserResponse } from "@/interfaces/auth.interface";

// Define the form input types
type FormInputs = {
  fullname: string;
  email: string;
  password: string;
  role: "MANAGER" | "EMPLOYEE";
};

export default function CreateUserForm() {
  const [generalError, setGeneralError] = useState<string | null>(null);
  const { createUser, isLoading } = useAuthStore();

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      role: "EMPLOYEE",
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    // Clear previous errors
    setGeneralError(null);

    try {
      const response = await createUser(data);

      // Check if response is the successful format
      if (response && response.statusCode === 200) {
        toast.success(response.message || "User created successfully");
        reset(); // Reset the form
      } else {
        // Handle unexpected response format
        setGeneralError("An unexpected error occurred");
        toast.error("Failed to create user");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Handle the specific error format from your backend
      const errorResponse = error.response?.data as
        | ICreateUserResponse
        | undefined;

      if (errorResponse?.error) {
        // Also set errors in react-hook-form for each field
        Object.entries(errorResponse.error).forEach(([field, message]) => {
          if (field in data) {
            setError(field as keyof FormInputs, {
              type: "server",
              message: message,
            });
          }
        });

        toast.error(errorResponse.message || "Validation failed");
      } else {
        // General error message
        setGeneralError(error.message || "Failed to create user");
        toast.error(error.message || "Failed to create user");
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <h2 className="text-2xl font-bold mb-6">Create User</h2>

        {/* Display general error if any */}
        {generalError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {generalError}
          </div>
        )}

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="fullname"
          >
            Full Name
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.fullname ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="fullname"
            placeholder="Full Name"
            {...register("fullname", { required: "Full name is required" })}
          />
          {errors.fullname && (
            <p className="text-red-500 text-xs italic">
              {errors.fullname.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.email ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Please enter a valid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.password ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="password"
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-xs italic">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="role"
          >
            Role
          </label>
          <select
            className={`shadow appearance-none border ${
              errors.role ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="role"
            {...register("role")}
          >
            <option value="EMPLOYEE">Employee</option>
            <option value="MANAGER">Manager</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-xs italic">{errors.role.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}
