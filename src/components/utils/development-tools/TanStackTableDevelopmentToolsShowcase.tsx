import React, { useMemo, useState } from "react";
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

// Sample data type
interface Person {
	id: number;
	firstName: string;
	lastName: string;
	age: number;
	email: string;
	department: string;
	salary: number;
	isActive: boolean;
	joinDate: string;
}

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
						className={`px-2 py-1 rounded-full text-xs ${
							info.getValue()
								? "bg-green-100 text-green-800"
								: "bg-red-100 text-red-800"
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
		enablePagination: true,
	});

	return (
		<div className="p-6 max-w-7xl mx-auto">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					TanStack Table Development Tools Showcase
				</h1>
				<p className="text-gray-600">
					This page demonstrates various TanStack Table features with integrated
					development tools. Open the browser devtools to see the TanStack Table
					DevTools panel.
				</p>
			</div>

			{/* Global Filter */}
			<div className="mb-6">
				<div className="flex items-center gap-4">
					<label
						htmlFor="global-filter"
						className="text-sm font-medium text-gray-700"
					>
						Global Filter:
					</label>
					<input
						id="global-filter"
						type="text"
						placeholder="Search all columns..."
						className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={
							(table.getColumn("firstName")?.getFilterValue() as string) ?? ""
						}
						onChange={(e) =>
							table.getColumn("firstName")?.setFilterValue(e.target.value)
						}
					/>
				</div>
			</div>

			{/* Table */}
			<div className="bg-white shadow-lg rounded-lg overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							{table.getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<th
											key={header.id}
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
											onClick={header.column.getToggleSortingHandler()}
										>
											<div className="flex items-center gap-2">
												{flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
												{header.column.getCanSort() && (
													<span className="text-gray-400">
														{{
															asc: "↑",
															desc: "↓",
														}[header.column.getIsSorted() as string] ?? "↕"}
													</span>
												)}
											</div>
											{header.column.getCanFilter() && (
												<div className="mt-2">
													<input
														type="text"
														placeholder={`Filter ${header.column.columnDef.header}...`}
														className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
														value={
															(header.column.getFilterValue() as string) ?? ""
														}
														onChange={(e) =>
															header.column.setFilterValue(e.target.value)
														}
													/>
												</div>
											)}
										</th>
									))}
								</tr>
							))}
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{table.getRowModel().rows.map((row) => (
								<tr key={row.id} className="hover:bg-gray-50">
									{row.getVisibleCells().map((cell) => (
										<td
											key={cell.id}
											className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
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
				<div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
					<div className="flex-1 flex justify-between sm:hidden">
						<button
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
							className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Previous
						</button>
						<button
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
							className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Next
						</button>
					</div>
					<div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
						<div>
							<p className="text-sm text-gray-700">
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
								className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
								aria-label="Pagination"
							>
								<button
									onClick={() => table.setPageIndex(0)}
									disabled={!table.getCanPreviousPage()}
									className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									First
								</button>
								<button
									onClick={() => table.previousPage()}
									disabled={!table.getCanPreviousPage()}
									className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Previous
								</button>
								<button
									onClick={() => table.nextPage()}
									disabled={!table.getCanNextPage()}
									className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Next
								</button>
								<button
									onClick={() => table.setPageIndex(table.getPageCount() - 1)}
									disabled={!table.getCanNextPage()}
									className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Last
								</button>
							</nav>
						</div>
					</div>
				</div>
			</div>

			{/* Table State Debug Info */}
			<div className="mt-8 bg-gray-100 p-4 rounded-lg">
				<h3 className="text-lg font-semibold mb-4">
					Table State Debug Information
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
					<div>
						<h4 className="font-medium text-gray-700 mb-2">Current Page</h4>
						<p className="text-gray-600">
							Page {table.getState().pagination.pageIndex + 1} of{" "}
							{table.getPageCount()}
						</p>
					</div>
					<div>
						<h4 className="font-medium text-gray-700 mb-2">Page Size</h4>
						<p className="text-gray-600">
							{table.getState().pagination.pageSize} rows per page
						</p>
					</div>
					<div>
						<h4 className="font-medium text-gray-700 mb-2">Total Rows</h4>
						<p className="text-gray-600">
							{table.getFilteredRowModel().rows.length} rows
						</p>
					</div>
					<div>
						<h4 className="font-medium text-gray-700 mb-2">Sorting</h4>
						<p className="text-gray-600">
							{sorting.length > 0
								? sorting
										.map((s) => `${s.id} (${s.desc ? "desc" : "asc"})`)
										.join(", ")
								: "No sorting applied"}
						</p>
					</div>
					<div>
						<h4 className="font-medium text-gray-700 mb-2">Active Filters</h4>
						<p className="text-gray-600">
							{columnFilters.length > 0
								? columnFilters.map((f) => `${f.id}: ${f.value}`).join(", ")
								: "No filters applied"}
						</p>
					</div>
					<div>
						<h4 className="font-medium text-gray-700 mb-2">
							Can Previous Page
						</h4>
						<p className="text-gray-600">
							{table.getCanPreviousPage() ? "Yes" : "No"}
						</p>
					</div>
				</div>
			</div>

			{/* TanStack Table DevTools */}
			<div className="mt-8">
				<TanStackTableDevelopmentTools table={table} />
			</div>
		</div>
	);
};
