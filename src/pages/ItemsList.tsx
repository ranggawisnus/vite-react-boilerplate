import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import { Search, Package } from "lucide-react";
import { fetchItems } from "../api/items";
import { Image } from "../components/ui/image";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";

export const ItemsList: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");
	const [filterCategory, setFilterCategory] = useState<string>("all");

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["items"],
		queryFn: async () => {
			const response = await fetchItems();
			if (!response.success) {
				throw new Error(response.message);
			}
			return response.data;
		},
	});

	const handleItemClick = (itemId: string): void => {
		void navigate({
			to: "/items/$itemId",
			params: { itemId },
		});
	};

	// Filter and search items
	const filteredItems = useMemo(() => {
		if (!data?.items) return [];

		return data.items.filter((item) => {
			const matchesSearch =
				item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.description.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory =
				filterCategory === "all" || item.category === filterCategory;

			return matchesSearch && matchesCategory;
		});
	}, [data?.items, searchQuery, filterCategory]);

	// Get unique categories
	const categories = useMemo(() => {
		if (!data?.items) return [];
		const uniqueCategories = Array.from(
			new Set(data.items.map((item) => item.category))
		);
		return uniqueCategories.sort();
	}, [data?.items]);

	if (isLoading) {
		return (
			<div className="w-full flex flex-col min-h-screen relative z-10 bg-white">
				<div className="w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 relative z-10">
					{/* Header */}
					<div className="mb-8">
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
							{t("items.list.title")}
						</h1>
						<p className="text-sm sm:text-base text-muted-foreground">
							Browse our collection
						</p>
					</div>

					{/* Search and Filter Skeleton */}
					<div className="bg-white border border-gray-200 shadow-md rounded-xl p-4 sm:p-6 mb-6 space-y-4">
						<div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
						<div className="h-10 bg-gray-100 rounded-lg animate-pulse w-32" />
					</div>

					{/* Items Grid Skeleton */}
					<div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
						{Array.from({ length: 6 }).map((_, index) => (
							<div
								key={index}
								className="bg-white border border-gray-200 shadow-md rounded-xl overflow-hidden animate-pulse"
							>
								<div className="w-full h-40 sm:h-48 bg-gray-100" />
								<div className="p-4 sm:p-6 space-y-3">
									<div className="h-5 bg-gray-100 rounded w-3/4" />
									<div className="h-4 bg-gray-100 rounded w-full" />
									<div className="h-4 bg-gray-100 rounded w-2/3" />
									<div className="flex items-center justify-between mt-4">
										<div className="h-6 w-20 bg-gray-100 rounded-full" />
										<div className="h-6 w-24 bg-gray-100 rounded" />
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="w-full flex flex-col min-h-screen relative z-10 bg-white">
				<div className="w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 relative z-10">
					<div className="bg-white border border-gray-200 shadow-md rounded-xl p-8 sm:p-12 text-center">
						<p className="text-lg font-semibold text-destructive mb-2">
							Error loading items
						</p>
						<p className="text-sm text-muted-foreground">
							{error instanceof Error ? error.message : "Unknown error"}
						</p>
					</div>
				</div>
			</div>
		);
	}

	const items = filteredItems;

	return (
		<div className="w-full flex flex-col min-h-screen relative z-10 bg-white">
			<div className="w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 relative z-10">
				{/* Header */}
				<div className="mb-6 sm:mb-8">
					<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
						{t("items.list.title")}
					</h1>
					<p className="text-sm sm:text-base text-muted-foreground">
						Browse our collection
					</p>
				</div>

				{/* Search and Filter */}
				<div className="bg-white border border-gray-200 shadow-md rounded-xl p-4 sm:p-6 mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
					{/* Search Input */}
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							className="pl-9 h-10 sm:h-11 bg-white border border-gray-300 rounded-lg focus-visible:ring-2 focus-visible:ring-gray-400"
							placeholder="Search items..."
							type="text"
							value={searchQuery}
							onChange={(event_) => {
								setSearchQuery(event_.target.value);
							}}
						/>
					</div>

					{/* Filter Dropdown */}
					<div className="sm:w-48">
						<Select
							className="h-10 sm:h-11 w-full"
							value={filterCategory}
							onChange={(event_) => {
								setFilterCategory(event_.target.value);
							}}
						>
							<option value="all">All Categories</option>
							{categories.map((category) => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
						</Select>
					</div>
				</div>

				{/* Items Grid */}
				{items.length > 0 ? (
					<div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
						{items.map((item) => (
							<div
								key={item.id}
								className="bg-white border border-gray-200 shadow-md rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg group"
								onClick={() => {
									handleItemClick(item.id.toString());
								}}
							>
								{/* Item Image */}
								<div className="w-full h-40 sm:h-48 overflow-hidden bg-gray-100 relative">
									<Image
										alt={item.title}
										className="w-full h-full object-cover transition-transform group-hover:scale-110"
										src={item.image}
									/>
									{/* Small Icon Overlay */}
									<div className="absolute top-3 right-3 bg-gray-50 border border-gray-200 rounded-lg p-2">
										<Package className="h-4 w-4 text-foreground" />
									</div>
								</div>

								{/* Item Content */}
								<div className="p-4 sm:p-6">
									{/* Title */}
									<h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 line-clamp-1">
										{item.title}
									</h2>

									{/* Description */}
									<p className="text-sm sm:text-base text-muted-foreground mb-4 line-clamp-2">
										{item.description}
									</p>

									{/* Metadata */}
									<div className="flex items-center justify-between pt-4 border-t border-gray-200">
										<span className="text-xs sm:text-sm px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-foreground font-medium">
											{item.category}
										</span>
										<span className="text-base sm:text-lg font-bold text-foreground">
											{t("items.list.price", { price: item.price })}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="bg-white border border-gray-200 shadow-md rounded-xl p-12 text-center">
						<Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
						<p className="text-base font-medium text-foreground mb-2">
							No items found
						</p>
						<p className="text-sm text-muted-foreground">
							{searchQuery || filterCategory !== "all"
								? "Try adjusting your search or filter"
								: t("items.list.noItems")}
						</p>
					</div>
				)}
			</div>
		</div>
	);
};
