import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Package, Tag, DollarSign } from "lucide-react";
import { fetchItemDetail } from "../api/items";
import { Image } from "../components/ui/image";

export const ItemDetail: React.FC = () => {
	const { itemId } = useParams({ from: "/items/$itemId" });
	const { t } = useTranslation();

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["item", itemId],
		queryFn: async () => {
			if (!itemId) {
				throw new Error("Item ID is required");
			}
			const response = await fetchItemDetail(itemId);
			if (!response.success) {
				throw new Error(response.message);
			}
			return response.data;
		},
		enabled: Boolean(itemId),
	});

	if (isLoading) {
		return (
			<div className="w-full flex flex-col min-h-screen relative z-10">
				{/* Floating Orbs */}
				<div className="floating-orb floating-orb-1" />
				<div className="floating-orb floating-orb-2" />
				<div className="floating-orb floating-orb-3" />

				<div className="w-full max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8 relative z-10">
					<div className="glass-effect rounded-xl overflow-hidden animate-pulse">
						<div className="w-full h-64 sm:h-80 lg:h-96 bg-white/20" />
						<div className="p-6 sm:p-8 lg:p-10 space-y-6">
							<div className="h-6 w-32 bg-white/20 rounded-full" />
							<div className="h-8 sm:h-10 bg-white/20 rounded w-3/4" />
							<div className="h-6 bg-white/20 rounded w-full" />
							<div className="h-6 bg-white/20 rounded w-2/3" />
							<div className="h-10 w-40 bg-white/20 rounded" />
							<div className="border-t border-white/20 pt-6">
								<div className="h-6 w-48 bg-white/20 rounded mb-4" />
								<div className="grid gap-4 sm:grid-cols-2">
									{Array.from({ length: 4 }).map((_, index) => (
										<div
											key={index}
											className="glass-effect-light rounded-lg p-4 space-y-2"
										>
											<div className="h-4 bg-white/20 rounded w-24" />
											<div className="h-5 bg-white/20 rounded w-32" />
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (isError || !data?.item) {
		return (
			<div className="w-full flex flex-col min-h-screen relative z-10">
				{/* Floating Orbs */}
				<div className="floating-orb floating-orb-1" />
				<div className="floating-orb floating-orb-2" />
				<div className="floating-orb floating-orb-3" />

				<div className="w-full max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8 relative z-10">
					<div className="glass-effect rounded-xl p-12 text-center">
						<Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
						<h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
							{t("items.detail.notFound")}
						</h1>
						<p className="text-base text-muted-foreground mb-2">
							{t("items.detail.itemNotFound")}
						</p>
						{error instanceof Error && (
							<p className="text-sm text-destructive mt-2">{error.message}</p>
						)}
					</div>
				</div>
			</div>
		);
	}

	const item = data.item;

	return (
		<div className="w-full flex flex-col min-h-screen relative z-10">
			{/* Floating Orbs */}
			<div className="floating-orb floating-orb-1" />
			<div className="floating-orb floating-orb-2" />
			<div className="floating-orb floating-orb-3" />

			<div className="w-full max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8 relative z-10">
				{/* Main Content Card */}
				<div className="glass-effect rounded-xl overflow-hidden">
					{/* Hero Image */}
					<div className="w-full h-64 sm:h-80 lg:h-96 overflow-hidden bg-white/20 relative">
						<Image
							alt={item.title}
							className="w-full h-full object-cover"
							src={item.image}
						/>
						{/* Category Badge Overlay */}
						<div className="absolute top-4 left-4 glass-effect-light rounded-lg px-3 py-1.5 flex items-center gap-2">
							<Tag className="h-3.5 w-3.5 text-foreground" />
							<span className="text-xs sm:text-sm font-medium text-foreground">
								{item.category}
							</span>
						</div>
					</div>

					{/* Content */}
					<div className="p-6 sm:p-8 lg:p-10">
						{/* Title */}
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6">
							{item.title}
						</h1>

						{/* Description */}
						<p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
							{item.description}
						</p>

						{/* Price */}
						<div className="glass-effect-light rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 flex items-center gap-3">
							<div className="glass-effect rounded-lg p-2.5">
								<DollarSign className="h-5 w-5 text-foreground" />
							</div>
							<div>
								<p className="text-xs sm:text-sm text-muted-foreground mb-1">
									Price
								</p>
								<p className="text-2xl sm:text-3xl font-bold text-foreground">
									{t("items.list.price", { price: item.price })}
								</p>
							</div>
						</div>

						{/* Specifications */}
						<div className="border-t border-white/20 pt-6 sm:pt-8">
							<h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 sm:mb-6 flex items-center gap-2">
								<Package className="h-5 w-5" />
								{t("items.detail.specifications")}
							</h2>
							<div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
								{item.specifications.map((spec, index) => (
									<div
										key={index}
										className="glass-effect-light rounded-xl p-4 sm:p-6 flex flex-col"
									>
										<span className="text-xs sm:text-sm text-muted-foreground mb-2 font-medium uppercase tracking-wide">
											{spec.label}
										</span>
										<span className="text-base sm:text-lg font-semibold text-foreground">
											{spec.value}
										</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
