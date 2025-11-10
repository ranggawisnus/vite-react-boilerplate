import { createFileRoute } from "@tanstack/react-router";
import { ItemsList } from "../pages/ItemsList";

export const Route = createFileRoute("/items/")({
	component: ItemsList,
});
