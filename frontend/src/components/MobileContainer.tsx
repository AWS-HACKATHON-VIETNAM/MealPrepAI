export function MobileContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div id="mobile-container" className="w-full max-w-[390px] h-[844px] bg-white rounded-[40px] shadow-2xl overflow-hidden relative isolate">
        {/* Phone notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[30px] bg-black rounded-b-3xl z-50" />
        {children}
      </div>
    </div>
  );
}
