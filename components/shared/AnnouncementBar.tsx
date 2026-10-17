export function AnnouncementBar({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div className="bg-teal-bar text-white text-center text-[0.72rem] tracking-[0.14em] lowercase py-[9px] px-4">
      {text}
    </div>
  );
}
