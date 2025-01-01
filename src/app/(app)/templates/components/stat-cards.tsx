'use client';

import { Card } from '@/components/ui/card';

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card className="h-40 w-full bg-foreground/10 rounded-xl shadow-md" />
      <Card className="h-40 w-full bg-foreground/10 rounded-xl shadow-md" />
      <Card className="h-40 w-full bg-foreground/10 rounded-xl shadow-md" />
      <Card className="h-40 w-full bg-foreground/10 rounded-xl shadow-md" />
    </div>
  );
}