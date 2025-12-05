import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from '@tanstack/react-table'
import React, { useState } from 'react'
import { Checkbox } from './ui/checkbox'
import { Button } from './ui/button'
import { ArrowUpDown, ChevronDown } from 'lucide-react'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu'
import { useEffect } from 'react'
import { Input } from './ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { IconTrash } from '@tabler/icons-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { PurchaseOrder, PurchaseOrderFormValues } from './interface/interface'
import { deletePurchaseOrder, getPurchaseOrders, updatePurchaseOrder } from '@/app/actions/purchase'
import { EditPurchaseOrderForm } from './purchase/edit-purchase-form'

interface PurchaseTableProps {
    data: PurchaseOrder[]
}

export default function PurchaseTable({
    data: initialData,
}: PurchaseTableProps) {
    const data = initialData
    const router = useRouter()

    // Initialize with initialData, casting to Category[] as initialData might miss some fields but runtime has them
    const [allPurchaseOrders, setAllPurchaseOrders] = useState<PurchaseOrder[]>(initialData as unknown as PurchaseOrder[]);

    const fetchPurchaseOrders = async () => {
        const data = await getPurchaseOrders();
        setAllPurchaseOrders(data);
    };

    useEffect(() => {
        // Sync state with initialData if it changes (e.g. from router.refresh)
        setAllPurchaseOrders(initialData as unknown as PurchaseOrder[]);
    }, [initialData]);


    const handleUpdate = async (id: string, data: PurchaseOrderFormValues) => {
        const response = await updatePurchaseOrder(id, data)
        if (response.success) {
            toast.success(response.message)
            fetchPurchaseOrders();
            router.refresh()
        } else {
            toast.error(response.message)
        }
    }


    const handleDelete = async (id: string) => {
        const response = await deletePurchaseOrder(id)
        if (response.success) {
            toast.success(response.message)
            fetchPurchaseOrders();
            router.refresh()
        } else {
            toast.error(response.message)
        }
    }

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const columns: ColumnDef<PurchaseOrder>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "id",
            header: ({ column }) => {
                return (
                    <div className='flex items-center gap-2 cursor-pointer'
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        ID
                        <ArrowUpDown className='w-4 h-4' />
                    </div>
                )
            },
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("id")}</div>
            ),
        },
        {
            accessorKey: "supplier",
            header: ({ column }) => {
                return (
                    <div className='flex items-center gap-2 cursor-pointer'
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Supplier
                        <ArrowUpDown className='w-4 h-4' />
                    </div>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.original.supplier?.name || "N/A"}</div>,
        },
        {
            accessorKey: "productCount",
            header: ({ column }) => {
                return (
                    <div className='flex items-center gap-2 cursor-pointer'
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Product Count
                        <ArrowUpDown className='w-4 h-4' />
                    </div>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("productCount")}</div>,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const purchaseOrder = row.original
                return (
                    <div className='flex gap-2'>
                        <EditPurchaseOrderForm
                            defaultValues={{
                                supplierId: purchaseOrder.supplierId,
                                supplier: purchaseOrder.supplier,
                                status: purchaseOrder.status,
                                totalAmount: purchaseOrder.totalAmount,
                                notes: purchaseOrder.notes ?? undefined,
                                discount: purchaseOrder.discount ?? undefined,
                                tax: purchaseOrder.tax ?? undefined,
                                refNo: purchaseOrder.refNo,
                                balanceAmount: purchaseOrder.balanceAmount,
                                shippingCost: purchaseOrder.shippingCost ?? undefined,
                                items: purchaseOrder.items?.map((item) => ({
                                    ...item,
                                    id: item.productId,
                                    slug: item.product?.slug || "",
                                })) ?? [],
                            }}
                            onSubmit={(data) => handleUpdate(purchaseOrder.id, data)}
                            purchaseOrders={allPurchaseOrders}
                        />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className='cursor-pointer'>
                                    <IconTrash size="icon" /> Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the brand.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
                                    <AlertDialogAction className='cursor-pointer bg-red-600 text-white hover:bg-red-700' onClick={() => handleDelete(row.original.id)}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )
            },
        },
    ]

    const table = useReactTable({
        data: allPurchaseOrders,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })
    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter Supplier Name..."
                    value={(table.getColumn("supplier")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("supplier")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader className='bg-muted'>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
