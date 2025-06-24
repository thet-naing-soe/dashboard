import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import {
  fetchRevenue,
  fetchLatestInvoices,
  fetchCardData,
} from '@/app/lib/data';

// Import all components from their new standardized paths
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import Card from '@/app/ui/dashboard/cards'; // Renamed to 'Card' not 'CardWrapper' for direct use
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';

// Import all skeletons from the standardized path (they will now be used)
import {
  RevenueChartSkeleton,
  CardsSkeleton,
  LatestInvoicesSkeleton,
} from '@/app/ui/skeletons';

export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper /> {/* This will fetch card data */}
        </Suspense>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChartWrapper />
        </Suspense>

        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoicesWrapper />
        </Suspense>
      </div>
    </main>
  );
}

async function RevenueChartWrapper() {
  const revenue = await fetchRevenue();
  return <RevenueChart revenue={revenue} />;
}

async function CardWrapper() {
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();

  return (
    <>
      <Card title="Collected" value={totalPaidInvoices} type="collected" />
      <Card title="Pending" value={totalPendingInvoices} type="pending" />
      <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
      <Card
        title="Total Customers"
        value={numberOfCustomers}
        type="customers"
      />
    </>
  );
}

async function LatestInvoicesWrapper() {
  const latestInvoices = await fetchLatestInvoices();
  return <LatestInvoices latestInvoices={latestInvoices} />;
}
