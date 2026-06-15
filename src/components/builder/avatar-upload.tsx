"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, X } from "lucide-react";
import { toast } from "sonner";

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export function AvatarUpload({
  value,
  onChange,
}: {
  value?: string;
  onChange: (url: string | undefined) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    if (!ALLOWED.includes(file.type)) {
      toast.error("Use a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Image must be under 2 MB.");
      return;
    }

    setUploading(true);
    const supabase = createSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Not signed in.");
      setUploading(false);
      return;
    }

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: false, contentType: file.type });
    if (upErr) {
      toast.error(`Upload failed: ${upErr.message}`);
      setUploading(false);
      return;
    }

    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
    onChange(pub.publicUrl);
    setUploading(false);
  }

  function remove() {
    onChange(undefined);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative size-20 rounded-full overflow-hidden border bg-muted flex items-center justify-center shrink-0">
        {value ? (
          <Image
            src={value}
            alt="Profile"
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <Camera className="size-6 text-muted-foreground" />
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-9"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Uploading…
              </>
            ) : value ? (
              "Change"
            ) : (
              "Upload photo"
            )}
          </Button>
          {value && !uploading && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-9 gap-1"
              onClick={remove}
            >
              <X className="size-3.5" />
              Remove
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Optional. Square photo, under 2 MB. Skip if applying internationally.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED.join(",")}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>
    </div>
  );
}
