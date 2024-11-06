// src/app/loading.tsx
export default function Loading() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    </div>
  );
}
