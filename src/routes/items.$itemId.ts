import { createFileRoute } from "@tanstack/react-router";
import { ItemDetail } from "../pages/ItemDetail";

export const Route = createFileRoute("/items/$itemId")({
	component: ItemDetail,
});
