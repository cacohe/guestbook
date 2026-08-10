// 加载中状态
export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse p-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="h-8 w-40 rounded bg-gray-200" />
        <div className="h-4 w-12 rounded bg-gray-200" />
      </div>

      <div className="mb-8 flex gap-2">
        <div className="h-10 flex-1 rounded bg-gray-200" />
        <div className="h-10 w-20 rounded bg-gray-200" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded border bg-white p-4 shadow-sm">
            <div className="mb-2 h-4 w-full rounded bg-gray-200" />
            <div className="h-3 w-24 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  )
}
