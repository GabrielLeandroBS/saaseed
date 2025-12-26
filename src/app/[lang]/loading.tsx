export default function Loading() {
  return (
    <div className="flex h-screen w-screen bg-muted items-center justify-center">
      <div className="relative size-6">
        <div className="absolute inset-0 h-full w-full animate-ping will-change-auto rounded-full bg-primary" />
        <div className="absolute inset-0 h-full w-full bg-primary rounded-full" />
      </div>
    </div>
  );
}
