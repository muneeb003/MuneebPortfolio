"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  label?: string;
}

export function ImageUploader({ value, onChange, bucket = "project-covers", label = "Image" }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", bucket);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const json = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(json.error || "Upload failed");
      return;
    }

    onChange(json.url);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-zinc-300">{label}</span>

      {value && (
        <div className="relative w-full h-40 rounded-lg overflow-hidden border border-zinc-700">
          <Image src={value} alt="Preview" fill sizes="100vw" className="object-cover" />
        </div>
      )}

      <div className="flex gap-2 items-center">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          loading={loading}
          onClick={() => inputRef.current?.click()}
        >
          {value ? "Change image" : "Upload image"}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange("")}
          >
            Remove
          </Button>
        )}
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
