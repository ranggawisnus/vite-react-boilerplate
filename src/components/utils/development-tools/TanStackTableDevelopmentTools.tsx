import React, { Suspense } from "react";
import { isProduction } from "../../../common/utils";
import type { Table } from "@tanstack/react-table";

interface TanStackTableDevelopmentToolsProps {
	table: Table<any>;
}

const DevToolsComponent = React.lazy(() =>
	import("@tanstack/react-table-devtools").then((result) => ({
		default: result.ReactTableDevtools,
	}))
);

export const TanStackTableDevelopmentTools: React.FC<
	TanStackTableDevelopmentToolsProps
> = ({ table }) => {
	if (isProduction) {
		return null;
	}

	return (
		<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
			<h3 className="text-lg font-semibold text-blue-900 mb-2">
				TanStack Table DevTools
			</h3>
			<p className="text-sm text-blue-700 mb-4">
				The TanStack Table DevTools are available in your browser's developer
				console. Open DevTools (F12) and look for the "TanStack Table" tab.
			</p>
			<Suspense
				fallback={<div className="text-blue-600">Loading DevTools...</div>}
			>
				<DevToolsComponent table={table} />
			</Suspense>
		</div>
	);
};
