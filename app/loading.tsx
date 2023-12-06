import { Skeleton } from "@/components/ui/skeleton"

export default async function Loading() {

  return (
    <section className="md:container p-2 flex flex-col justify-center items-center md:py-10 py-4">
      <div className="w-full text-2xl font-bold">
        <Skeleton className="w-40 h-8 rounded-lg" />
      </div>

      <div className="mt-4 flex w-full flex-col md:py-4 py-1">
        <Skeleton className="w-full h-[432px] rounded-lg" />
      </div>

      <div className="flex w-full items-end justify-between my-4">
        <div className="flex flex-col items-center justify-center text-lg text-muted-foreground hover:text-primary">
          <Skeleton className="w-32 h-8 rounded-lg" />
        </div>
        <div className="flex flex-col items-center justify-center text-lg text-muted-foreground hover:text-primary">
          <Skeleton className="w-32 h-8 rounded-lg" />
        </div>
      </div>
    </section>
  )
}