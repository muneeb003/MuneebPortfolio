"use client";

interface MoodBarProps {
  text: string;
  linkUrl: string | null;
}

export function MoodBar({ text, linkUrl }: MoodBarProps) {
  const content = (
    <div className="flex items-center justify-center gap-2 text-xs text-zinc-400 py-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
      <span>{text}</span>
    </div>
  );

  return (
    <div className="bg-zinc-900 border-b border-zinc-800 mt-0.5">
      {linkUrl ? (
        <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="block hover:bg-zinc-800 transition-colors">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}
