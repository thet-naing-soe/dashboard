import { prisma } from '@/app/lib/prisma';
import { formatCurrency } from '@/app/lib/utils';

export async function fetchRevenue() {
  try {
    // This is a placeholder; you might need to adjust based on your actual model
    const revenue = await prisma.revenue.findMany();
    return revenue;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
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

    // The raw amount is in cents, so we format it for display
    const formattedInvoices = latestInvoices.map((invoice: any) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return formattedInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
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
