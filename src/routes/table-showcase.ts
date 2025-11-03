import { createFileRoute } from "@tanstack/react-router";
import { TableShowcase } from "../pages/TableShowcase";

export const Route = createFileRoute("/table-showcase")({
	component: TableShowcase,
});
