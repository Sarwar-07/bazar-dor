export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse flex flex-col justify-between h-[142px]">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-100 rounded w-1/3"></div>
        </div>
      </div>
      <div className="flex justify-between items-end pt-3 border-t border-gray-50">
        <div className="space-y-1">
          <div className="h-2.5 bg-gray-100 rounded w-12"></div>
          <div className="h-5 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded-full w-14"></div>
      </div>
    </div>
  );
}