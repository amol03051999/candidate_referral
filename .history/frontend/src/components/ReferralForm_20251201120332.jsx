import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { API_BASE } from "../api";

const ReferralForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("jobTitle", data.jobTitle);
      if (data.resume && data.resume[0]) {
        formData.append("resume", data.resume[0]);
      }

      await axios.post(`${API_BASE}/candidates`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      reset();
      setSuccess("✅ Candidate referred successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.errors
        ? error.response.data.errors[0]?.msg
        : error.response?.data?.error || "Error submitting form";
      alert(errorMsg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-8 rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-semibold mb-6">Refer a Candidate</h2>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 animate-pulse">
          {success}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <input
            {...register("name", { required: "Name required", minLength: 2 })}
            placeholder="Candidate Name"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("email", {
              required: "Email required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,
                message: "Invalid email format",
              },
            })}
            placeholder="john@example.com"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("phone", {
              required: "Phone required",
              minLength: { value: 10, message: "Phone must be 10+ digits" },
              pattern: {
                value: /^[0-9+-s]+$/,
                message: "Invalid phone format",
              },
            })}
            placeholder="Phone Number"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("jobTitle", { required: "Job title required" })}
            placeholder="Job Title"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.jobTitle && (
            <p className="text-red-500 text-sm mt-1">
              {errors.jobTitle.message}
            </p>
          )}
        </div>

        <div>
          Amol Shinde, [01-12-2025 11:38]
          <input
            {...register("resume")}
            type="file"
            accept=".pdf"
            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-500 mt-1">
            PDF only, max 5MB (optional)
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Submitting...
            </span>
          ) : (
            "Refer Candidate"
          )}
        </button>
      </div>
    </form>
  );
};

export default ReferralForm;
