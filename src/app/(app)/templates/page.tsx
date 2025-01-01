'use client';

import { DataTable } from '@/components/data-table';
import { columns } from './components/table/columns';
import { mockDashboardData } from './data/mock-data';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function TemplatesPage() {
  const router = useRouter();
  
  return (
    <div className="w-full h-full p-4">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-xl shadow-md flex justify-between mb-4">
        <div> <h1 className='text-2xl extra-bold'> All Templates</h1></div>
        <div> 
          <Button variant="outline" onClick={() => {}} className='mr-4'>Upload template</Button>
          <Button onClick={() =>  router.push(`/editor`)}>Add template</Button>
        </div>
      </div>

      {/* Main Section */}
      <div className="bg-white p-6 rounded-xl shadow-md min-h-[calc(75svh)]">
        <DataTable columns={columns} data={mockDashboardData} />
      </div>
    </div>
  );
}