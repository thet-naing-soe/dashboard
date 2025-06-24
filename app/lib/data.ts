import { prisma } from '@/app/lib/prisma';
import { formatCurrency } from '@/app/lib/utils';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchRevenue() {
  noStore();
  try {
    const revenue = await prisma.revenue.findMany();
    return revenue;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  noStore();
  try {
    const latestInvoices = await prisma.invoice.findMany({
      orderBy: { date: 'desc' },
      take: 5,
      include: {
        customer: {
          select: {
            name: true,
            image_url: true,
            email: true,
          },
        },
      },
    });

    const formattedInvoices = latestInvoices.map((invoice) => ({
      id: invoice.id,
      amount: formatCurrency(invoice.amount),
      name: invoice.customer.name,
      image_url: invoice.customer.image_url,
      email: invoice.customer.email,
    }));

    return formattedInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  noStore();
  try {
    const invoiceCountPromise = prisma.invoice.count();
    const customerCountPromise = prisma.customer.count();

    const paidInvoicesPromise = prisma.invoice.aggregate({
      _sum: { amount: true },
      where: { status: 'paid' },
    });

    const pendingInvoicesPromise = prisma.invoice.aggregate({
      _sum: { amount: true },
      where: { status: 'pending' },
    });

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      paidInvoicesPromise,
      pendingInvoicesPromise,
    ]);

    const numberOfInvoices = Number(data[0] ?? '0');
    const numberOfCustomers = Number(data[1] ?? '0');
    const totalPaidInvoices = formatCurrency(data[2]._sum.amount ?? 0);
    const totalPendingInvoices = formatCurrency(data[3]._sum.amount ?? 0);

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}
