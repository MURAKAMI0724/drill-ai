"use client";

import { useRef } from "react";
import Button from "@/components/ui/Button";

const MAX_PHOTOS = 4;

interface CaptureScreenProps {
  captureHint: string;
  photos: string[];
  onAddPhotos: (dataUrls: string[]) => void;
  onRemovePhoto: (index: number) => void;
  onNext: () => void;
}

export default function CaptureScreen({
  captureHint,
  photos,
  onAddPhotos,
  onRemovePhoto,
  onNext,
}: CaptureScreenProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const remaining = MAX_PHOTOS - photos.length;
    const toRead = files.slice(0, remaining);
    event.target.value = "";
    if (toRead.length === 0) return;

    Promise.all(
      toRead.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          }),
      ),
    )
      .then(onAddPhotos)
      .catch(() => {
        /* ignore unreadable files */
      });
  }

  const countLabel =
    photos.length === 0
      ? "まだ撮影されていません"
      : photos.length >= MAX_PHOTOS
        ? `${photos.length}枚 撮影しました ・ 準備できました！`
        : `${photos.length}枚 撮影しました`;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="font-serif text-2xl font-bold">教材を撮影しましょう</h1>
      <div className="flex items-center gap-2.5 rounded-2xl border border-dashed border-gold-wash-2 bg-gold-wash px-4 py-3.5">
        <div className="text-xl">💡</div>
        <div className="text-[13px] leading-relaxed text-fg-soft">
          {captureHint}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {photos.map((src, idx) => (
          <div
            key={idx}
            className="animate-flash-in relative aspect-[3/4] overflow-hidden rounded-xl border border-border bg-gradient-to-br from-[#f6f1e6] to-[#e4dcc6]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`撮影した教材ページ ${idx + 1}`}
              className="h-full w-full object-cover"
            />
            <div className="absolute right-1.5 bottom-1.5 rounded-md bg-white/70 px-1.5 py-0.5 text-[10px] font-bold text-[#6b5f3f]">
              p.{idx + 1}
            </div>
            <button
              onClick={() => onRemovePhoto(idx)}
              aria-label="この写真を削除"
              className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/55 text-[11px] text-white"
            >
              ×
            </button>
          </div>
        ))}

        {photos.length < MAX_PHOTOS && (
          <button
            onClick={() => inputRef.current?.click()}
            className="flex aspect-[3/4] flex-col items-center justify-center gap-1 rounded-xl border-[1.5px] border-dashed border-gold-wash-2 text-gold"
          >
            <span className="text-[22px] leading-none">📷</span>
            <span className="text-[10.5px] text-fg-faint">タップで撮影</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={handleFiles}
      />

      <div className="text-center text-xs text-fg-faint">{countLabel}</div>

      <div className="flex-1" />
      <Button block onClick={onNext} disabled={photos.length === 0}>
        この写真で読み込みを開始する
      </Button>
    </div>
  );
}
