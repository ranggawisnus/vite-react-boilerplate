import React, { useMemo, useState } from "react";
import { Search, Table2 } from "lucide-react";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
	type SortingState,
	type ColumnFiltersState,
	type PaginationState,
} from "@tanstack/react-table";
import { TanStackTableDevelopmentTools } from "./TanStackTableDevelopmentTools";
import type { Person } from "../../../types";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

// Sample data
const sampleData: Person[] = [
	{
		id: 1,
		firstName: "John",
		lastName: "Doe",
		age: 28,
		email: "john.doe@example.com",
		department: "Engineering",
		salary: 75000,
		isActive: true,
		joinDate: "2022-01-15",
	},
	{
		id: 2,
		firstName: "Jane",
		lastName: "Smith",
		age: 32,
		email: "jane.smith@example.com",
		department: "Marketing",
		salary: 68000,
		isActive: true,
		joinDate: "2021-11-20",
	},
	{
		id: 3,
		firstName: "Mike",
		lastName: "Johnson",
		age: 45,
		email: "mike.johnson@example.com",
		department: "Engineering",
		salary: 95000,
		isActive: false,
		joinDate: "2020-03-10",
	},
	{
		id: 4,
		firstName: "Sarah",
		lastName: "Wilson",
		age: 29,
		email: "sarah.wilson@example.com",
		department: "HR",
		salary: 62000,
		isActive: true,
		joinDate: "2023-02-28",
	},
	{
		id: 5,
		firstName: "David",
		lastName: "Brown",
		age: 38,
		email: "david.brown@example.com",
		department: "Sales",
		salary: 82000,
		isActive: true,
		joinDate: "2021-07-12",
	},
	{
		id: 6,
		firstName: "Lisa",
		lastName: "Davis",
		age: 26,
		email: "lisa.davis@example.com",
		department: "Engineering",
		salary: 71000,
		isActive: true,
		joinDate: "2023-05-15",
	},
	{
		id: 7,
		firstName: "Tom",
		lastName: "Miller",
		age: 41,
		email: "tom.miller@example.com",
		department: "Finance",
		salary: 88000,
		isActive: false,
		joinDate: "2019-09-03",
	},
	{
		id: 8,
		firstName: "Emma",
		lastName: "Garcia",
		age: 33,
		email: "emma.garcia@example.com",
		department: "Marketing",
		salary: 73000,
		isActive: true,
		joinDate: "2022-08-22",
	},
];

const columnHelper = createColumnHelper<Person>();

export const TanStackTableDevelopmentToolsShowcase: React.FC = () => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 5,
	});

	const columns = useMemo<ColumnDef<Person>[]>(
		() => [
			columnHelper.accessor("id", {
				header: "ID",
				cell: (info) => info.getValue(),
				enableSorting: true,
			}),
			columnHelper.accessor("firstName", {
				header: "First Name",
				cell: (info) => info.getValue(),
				enableSorting: true,
				enableColumnFilter: true,
			}),
			columnHelper.accessor("lastName", {
				header: "Last Name",
				cell: (info) => info.getValue(),
				enableSorting: true,
				enableColumnFilter: true,
			}),
			columnHelper.accessor("age", {
				header: "Age",
				cell: (info) => info.getValue(),
				enableSorting: true,
				enableColumnFilter: true,
			}),
			columnHelper.accessor("email", {
				header: "Email",
				cell: (info) => info.getValue(),
				enableColumnFilter: true,
			}),
			columnHelper.accessor("department", {
				header: "Department",
				cell: (info) => info.getValue(),
				enableSorting: true,
				enableColumnFilter: true,
				filterFn: "includesString",
			}),
			columnHelper.accessor("salary", {
				header: "Salary",
				cell: (info) => `$${info.getValue().toLocaleString()}`,
				enableSorting: true,
				enableColumnFilter: true,
			}),
			columnHelper.accessor("isActive", {
				header: "Status",
				cell: (info) => (
					<span
						className={`px-3 py-1 rounded-full text-xs font-medium ${
							info.getValue()
								? "glass-effect-light text-foreground"
								: "glass-effect-light text-muted-foreground"
						}`}
					>
						{info.getValue() ? "Active" : "Inactive"}
					</span>
				),
				enableSorting: true,
				enableColumnFilter: true,
				filterFn: "equals",
			}),
			columnHelper.accessor("joinDate", {
				header: "Join Date",
				cell: (info) => new Date(info.getValue()).toLocaleDateString(),
				enableSorting: true,
			}),
		],
		[]
	);

	const table = useReactTable({
		data: sampleData,
		columns,
		state: {
			sorting,
			columnFilters,
			pagination,
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		enableColumnFilters: true,
		enableSorting: true,
	});

	return (
		<div className="w-full flex flex-col min-h-screen relative z-10">
			{/* Floating Orbs */}
			<div className="floating-orb floating-orb-1" />
			<div className="floating-orb floating-orb-2" />
			<div className="floating-orb floating-orb-3" />

			<div className="w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 relative z-10">
				{/* Header */}
				<div className="glass-effect rounded-xl p-6 sm:p-8 mb-6">
					<div className="flex items-center gap-4 mb-4">
						<div className="glass-effect-light rounded-lg p-2.5">
							<Table2 className="h-6 w-6 text-foreground" />
						</div>
						<div>
							<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
								TanStack Table Showcase
							</h1>
							<p className="text-sm sm:text-base text-muted-foreground">
								Explore table features with integrated development tools
							</p>
						</div>
					</div>
				</div>

				{/* Global Filter */}
				<div className="glass-effect rounded-xl p-4 sm:p-6 mb-6">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							id="global-filter"
							className="pl-9 h-10 sm:h-11 bg-white/50 backdrop-blur-md border-white/30 rounded-lg focus-visible:ring-2 focus-visible:ring-white/50"
							placeholder="Search all columns..."
							type="text"
							value={
								(table.getColumn("firstName")?.getFilterValue() as string) ?? ""
							}
							onChange={(event_) => {
								table
									.getColumn("firstName")
									?.setFilterValue(event_.target.value);
							}}
						/>
					</div>
				</div>

				{/* Table */}
				<div className="glass-effect rounded-xl overflow-hidden">
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-white/20">
							<thead className="glass-effect-light">
								{table.getHeaderGroups().map((headerGroup) => (
									<tr key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<th
												key={header.id}
												className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors"
												onClick={header.column.getToggleSortingHandler()}
											>
												<div className="flex items-center gap-2">
													{flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
													{header.column.getCanSort() && (
														<span className="text-muted-foreground">
															{{
																asc: "↑",
																desc: "↓",
															}[header.column.getIsSorted() as string] ?? "↕"}
														</span>
													)}
												</div>
												{header.column.getCanFilter() && (
													<div className="mt-2">
														<Input
															className="w-full px-2 py-1 text-xs bg-white/30 backdrop-blur-md border-white/30 rounded focus-visible:ring-1 focus-visible:ring-white/50"
															placeholder={`Filter ${header.column.columnDef.header}...`}
															type="text"
															value={
																(header.column.getFilterValue() as string) ?? ""
															}
															onChange={(event_) => {
																header.column.setFilterValue(
																	event_.target.value
																);
															}}
														/>
													</div>
												)}
											</th>
										))}
									</tr>
								))}
							</thead>
							<tbody className="divide-y divide-white/20">
								{table.getRowModel().rows.map((row) => (
									<tr
										key={row.id}
										className="hover:bg-white/5 transition-colors"
									>
										{row.getVisibleCells().map((cell) => (
											<td
												key={cell.id}
												className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-foreground"
											>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Pagination */}
					<div className="glass-effect-light px-4 py-3 flex items-center justify-between border-t border-white/20 sm:px-6">
						<div className="flex-1 flex justify-between sm:hidden gap-2">
							<Button
								className="glass-effect-light hover:glass-effect rounded-lg"
								disabled={!table.getCanPreviousPage()}
								type="button"
								onClick={() => {
									table.previousPage();
								}}
							>
								Previous
							</Button>
							<Button
								className="glass-effect-light hover:glass-effect rounded-lg"
								disabled={!table.getCanNextPage()}
								type="button"
								onClick={() => {
									table.nextPage();
								}}
							>
								Next
							</Button>
						</div>
						<div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
							<div>
								<p className="text-sm text-foreground">
									Showing{" "}
									<span className="font-medium">
										{table.getState().pagination.pageIndex *
											table.getState().pagination.pageSize +
											1}
									</span>{" "}
									to{" "}
									<span className="font-medium">
										{Math.min(
											(table.getState().pagination.pageIndex + 1) *
												table.getState().pagination.pageSize,
											table.getFilteredRowModel().rows.length
										)}
									</span>{" "}
									of{" "}
									<span className="font-medium">
										{table.getFilteredRowModel().rows.length}
									</span>{" "}
									results
								</p>
							</div>
							<div>
								<nav
									aria-label="Pagination"
									className="relative z-0 inline-flex rounded-lg -space-x-px"
								>
									<Button
										className="glass-effect-light hover:glass-effect rounded-l-lg rounded-r-none"
										disabled={!table.getCanPreviousPage()}
										type="button"
										onClick={() => {
											table.setPageIndex(0);
										}}
									>
										First
									</Button>
									<Button
										className="glass-effect-light hover:glass-effect rounded-none"
										disabled={!table.getCanPreviousPage()}
										type="button"
										onClick={() => {
											table.previousPage();
										}}
									>
										Previous
									</Button>
									<Button
										className="glass-effect-light hover:glass-effect rounded-none"
										disabled={!table.getCanNextPage()}
										type="button"
										onClick={() => {
											table.nextPage();
										}}
									>
										Next
									</Button>
									<Button
										className="glass-effect-light hover:glass-effect rounded-r-lg rounded-l-none"
										disabled={!table.getCanNextPage()}
										type="button"
										onClick={() => {
											table.setPageIndex(table.getPageCount() - 1);
										}}
									>
										Last
									</Button>
								</nav>
							</div>
						</div>
					</div>
				</div>

				{/* Table State Debug Info */}
				<div className="mt-6 glass-effect rounded-xl p-6">
					<h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4">
						Table State Debug Information
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
						<div className="glass-effect-light rounded-lg p-4">
							<h4 className="font-medium text-foreground mb-2">Current Page</h4>
							<p className="text-muted-foreground">
								Page {table.getState().pagination.pageIndex + 1} of{" "}
								{table.getPageCount()}
							</p>
						</div>
						<div className="glass-effect-light rounded-lg p-4">
							<h4 className="font-medium text-foreground mb-2">Page Size</h4>
							<p className="text-muted-foreground">
								{table.getState().pagination.pageSize} rows per page
							</p>
						</div>
						<div className="glass-effect-light rounded-lg p-4">
							<h4 className="font-medium text-foreground mb-2">Total Rows</h4>
							<p className="text-muted-foreground">
								{table.getFilteredRowModel().rows.length} rows
							</p>
						</div>
						<div className="glass-effect-light rounded-lg p-4">
							<h4 className="font-medium text-foreground mb-2">Sorting</h4>
							<p className="text-muted-foreground">
								{sorting.length > 0
									? sorting
											.map((s) => `${s.id} (${s.desc ? "desc" : "asc"})`)
											.join(", ")
									: "No sorting applied"}
							</p>
						</div>
						<div className="glass-effect-light rounded-lg p-4">
							<h4 className="font-medium text-foreground mb-2">
								Active Filters
							</h4>
							<p className="text-muted-foreground">
								{columnFilters.length > 0
									? columnFilters.map((f) => `${f.id}: ${f.value}`).join(", ")
									: "No filters applied"}
							</p>
						</div>
						<div className="glass-effect-light rounded-lg p-4">
							<h4 className="font-medium text-foreground mb-2">
								Can Previous Page
							</h4>
							<p className="text-muted-foreground">
								{table.getCanPreviousPage() ? "Yes" : "No"}
							</p>
						</div>
					</div>
				</div>

				{/* TanStack Table DevTools */}
				<div className="mt-6">
					<TanStackTableDevelopmentTools table={table} />
				</div>
			</div>
		</div>
	);
};
