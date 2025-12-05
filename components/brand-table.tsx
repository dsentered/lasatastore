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
import { getBrands, deleteBrand, updateBrand } from '@/app/actions/brand'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { EditBrandForm } from './brand/edit-brand-form'
import { Brand, BrandFormValues } from './interface/interface'

interface BrandTableProps {
    data: Brand[]
}

export default function BrandTable({
    data: initialData,
}: BrandTableProps) {
    const data = initialData
    const router = useRouter()

    // Initialize with initialData, casting to Category[] as initialData might miss some fields but runtime has them
    const [allBrands, setAllBrands] = useState<Brand[]>(initialData as unknown as Brand[]);

    const fetchBrands = async () => {
        const data = await getBrands();
        setAllBrands(data);
    };

    useEffect(() => {
        // Sync state with initialData if it changes (e.g. from router.refresh)
        setAllBrands(initialData as unknown as Brand[]);
    }, [initialData]);


    const handleUpdate = async (id: string, data: BrandFormValues) => {
        const response = await updateBrand(id, data)
        if (response.success) {
            toast.success(response.message)
            fetchBrands();
            router.refresh()
        } else {
            toast.error(response.message)
        }
    }


    const handleDelete = async (id: string) => {
        const response = await deleteBrand(id)
        if (response.success) {
            toast.success(response.message)
            fetchBrands();
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

    const columns: ColumnDef<Brand>[] = [
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
            accessorKey: "slug",
            header: ({ column }) => {
                return (
                    <div className='flex items-center gap-2 cursor-pointer'
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Slug
                        <ArrowUpDown className='w-4 h-4' />
                    </div>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("slug")}</div>,
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
                const payment = row.original
                return (
                    <div className='flex gap-2'>
                        <EditBrandForm
                            defaultValues={{
                                name: payment.name,
                                slug: payment.slug,
                            }}
                            onSubmit={(data) => handleUpdate(payment.id, data)}
                            brands={allBrands}
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
        data: allBrands,
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
