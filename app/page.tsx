import { lusitana } from '@/app/components/ui/fonts';
import { Suspense } from 'react';
import { RevenueChartSkeleton } from '@/app/components/ui/skeletons';
import RevenueChart from '@/app/components/dashboard/revenue-chart';
import { fetchRevenue } from '@/app/lib/data';

export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChartWrapper />
        </Suspense>
      </div>
    </main>
  );
}

async function RevenueChartWrapper() {
  const revenue = await fetchRevenue();
  return <RevenueChart revenue={revenue} />;
}
