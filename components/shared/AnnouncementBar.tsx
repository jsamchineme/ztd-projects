export function AnnouncementBar({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div
      className="bg-teal-bar text-[#fcfcfc] flex items-center justify-center h-[44px] lg:h-[75px] px-4"
      style={{ backgroundImage: "url(/brand/pattern-b.png)", backgroundSize: "176px" }}
    >
      <p className="font-sans italic font-bold text-[12px] lg:text-[14px] tracking-[0.2em] text-center">
        {text}
      </p>
    </div>
  );
}
