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
import { getSuppliers, deleteSupplier, updateSupplier } from '@/app/actions/supplier'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Supplier, SupplierFormValues } from './interface/interface'
import { EditSupplierForm } from './supplier/edit-supplier-form'

interface SupplierTableProps {
    data: Supplier[]
}

export default function SupplierTable({
    data: initialData,
}: SupplierTableProps) {
    const data = initialData
    const router = useRouter()

    // Initialize with initialData, casting to Category[] as initialData might miss some fields but runtime has them
    const [allSuppliers, setAllSuppliers] = useState<Supplier[]>(initialData as unknown as Supplier[]);

    const fetchSuppliers = async () => {
        const data = await getSuppliers();
        setAllSuppliers(data as unknown as Supplier[]);
    };

    useEffect(() => {
        // Sync state with initialData if it changes (e.g. from router.refresh)
        setAllSuppliers(initialData as unknown as Supplier[]);
    }, [initialData]);


    const handleUpdate = async (id: string, data: SupplierFormValues) => {
        const response = await updateSupplier(id, data)
        if (response.success) {
            toast.success(response.message)
            fetchSuppliers();
            router.refresh()
        } else {
            toast.error(response.message)
        }
    }


    const handleDelete = async (id: string) => {
        const response = await deleteSupplier(id)
        if (response.success) {
            toast.success(response.message)
            fetchSuppliers();
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

    const columns: ColumnDef<Supplier>[] = [
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
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <div className='flex items-center gap-2 cursor-pointer'
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Name
                        <ArrowUpDown className='w-4 h-4' />
                    </div>
                )
            },
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("name")}</div>
            ),
        },
        {
            accessorKey: "phone",
            header: ({ column }) => {
                return (
                    <div className='flex items-center gap-2 cursor-pointer'
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Phone
                        <ArrowUpDown className='w-4 h-4' />
                    </div>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("phone")}</div>,
        },
        {
            accessorKey: "contactPerson",
            header: ({ column }) => {
                return (
                    <div className='flex items-center gap-2 cursor-pointer'
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Contact Person
                        <ArrowUpDown className='w-4 h-4' />
                    </div>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("contactPerson")}</div>,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const supplier = row.original
                return (
                    <div className='flex gap-2'>
                        <EditSupplierForm
                            defaultValues={{
                                name: supplier.name || "",
                                slug: supplier.slug,
                                location: supplier.location || "",
                                contactPerson: supplier.contactPerson || "",
                                phone: supplier.phone || "",
                                email: supplier.email || "",
                                supplierType: supplier.supplierType || "",
                                bankAccountNumner: supplier.bankAccountNumner || "",
                                bankName: supplier.bankName || "",
                                notes: supplier.notes || "",
                            }}
                            onSubmit={(data) => handleUpdate(supplier.id, data)}
                            suppliers={allSuppliers}
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
        data: allSuppliers,
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
                    placeholder="Filter Category Name..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
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
