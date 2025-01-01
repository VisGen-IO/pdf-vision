'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Dashboard } from '@/types';
import { useRouter } from 'next/navigation';

interface ActionMenuProps {
  template: Dashboard;
}

export function ActionMenu({ template }: ActionMenuProps) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(template.id)}>
          Copy template ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>View template</DropdownMenuItem>
        <DropdownMenuItem onClick={() =>  router.push(`/editor/${template.id}`)}>Edit template</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600">Delete template</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}