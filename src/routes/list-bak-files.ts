import { createFileRoute } from "@tanstack/react-router";
import { ListBAKFiles } from "../pages/ListBAKFiles";

export const Route = createFileRoute("/list-bak-files")({
	component: ListBAKFiles,
});
