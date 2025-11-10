import { createFileRoute } from "@tanstack/react-router";
import { BugReportForm } from "../components/forms/forms-example";

export const Route = createFileRoute("/form-example")({
	component: BugReportForm,
});
