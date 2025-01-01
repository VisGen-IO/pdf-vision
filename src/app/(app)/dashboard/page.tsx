'use client';

import { DataTable } from '@/components/data-table';
import { columns } from './components/table/columns';
import { StatsCards } from './components/stat-cards';
import { mockDashboardData } from './data/mock-data';

export default function DashboardPage() {
  return (
    <div className="w-full h-full p-4">
      {/* Header Section */}
      <div className="flex flex-col gap-4 mb-4 pt-0">
        <StatsCards />
      </div>

      {/* Main Section */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <DataTable columns={columns} data={mockDashboardData} />
      </div>
    </div>
  );
}