'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Dashboard } from '@/types';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ActionMenu } from './action-menu';
import { StatusBadge } from './status-badge';

export const columns: ColumnDef<Dashboard>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        className="translate-y-[2px]"
        checked={table.getIsAllPageRowsSelected()}
        onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        className="translate-y-[2px]"
        checked={row.getIsSelected()}
        onChange={(e) => row.toggleSelected(!!e.target.checked)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'template_id',
    header: 'ID',
  },
  {
    accessorKey: 'template_name',
    header: 'Name',
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.getValue('type')}
      </Badge>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <StatusBadge status={row.getValue('status')} />
    ),
  },
  {
    accessorKey: 'updated_at',
    header: 'Last Updated',
    cell: ({ row }) => format(new Date(row.getValue('updated_at')), 'MMM dd, yyyy'),
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionMenu template={row.original} />,
  },
];