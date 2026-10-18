export function AnnouncementBar({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div className="bg-teal-stripes text-[#fcfcfc] flex items-center justify-center h-[86px] lg:h-[75px] px-4">
      <p className="font-sans italic font-bold text-[14.5px] lg:text-[14px] tracking-[0.24em] lg:tracking-[0.2em] text-center">
        {text}
      </p>
    </div>
  );
}
