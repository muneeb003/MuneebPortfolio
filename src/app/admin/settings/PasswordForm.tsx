"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function PasswordForm() {
  const [message, setMessage] = useState("");
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<{
    current: string;
    newPassword: string;
    confirm: string;
  }>();

  async function onSubmit(data: { current: string; newPassword: string; confirm: string }) {
    if (data.newPassword !== data.confirm) {
      setMessage("Passwords don't match.");
      return;
    }

    const res = await fetch("/api/admin/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current: data.current, newPassword: data.newPassword }),
    });

    if (res.ok) {
      setMessage("Password updated!");
      reset();
    } else {
      const json = await res.json();
      setMessage(json.error || "Failed to update password.");
    }

    setTimeout(() => setMessage(""), 3000);
  }

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-base font-semibold text-zinc-100 mb-5">Change Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Current password" type="password" {...register("current")} required />
        <Input label="New password" type="password" {...register("newPassword")} required />
        <Input label="Confirm new password" type="password" {...register("confirm")} required />
        <div className="flex items-center gap-3">
          <Button type="submit" loading={isSubmitting}>Update password</Button>
          {message && (
            <span className={`text-sm ${message.includes("updated") ? "text-green-400" : "text-red-400"}`}>
              {message}
            </span>
          )}
        </div>
      </form>
    </section>
  );
}
