'use client';
import { Card } from '@/components/ui/card';
import React from 'react';

function Page() {
  return (
    <div className="w-full h-full pt-4">
      {/* Header Section */}
      <div className="flex flex-col gap-4 p-4 pt-0">
        {/* Grid Section */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="h-40 w-full bg-foreground/10  rounded-xl shadow-md">
            {/* Add content inside the Card if necessary */}
          </Card>
          <Card className="h-40 w-full bg-foreground/10  rounded-xl shadow-md">
            {/* Add content inside the Card if necessary */}
          </Card>
          <Card className="h-40 w-full bg-foreground/10  rounded-xl shadow-md">
            {/* Add content inside the Card if necessary */}
          </Card>
          <Card className="h-40 w-full bg-foreground/10  rounded-xl shadow-md">
            {/* Add content inside the Card if necessary */}
          </Card>
        </div>
      </div>

      {/* Main Section */}
      <div className="h-full w-full rounded-xl bg-foreground/10 shadow-lg md:min-h-[300px] flex justify-center items-center">
        {/* Add content or children elements here */}
      </div>
    </div>
  );
}

export default Page;
