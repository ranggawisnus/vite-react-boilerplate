import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Languages, Table2, FileText, FormInput, Package } from "lucide-react";
import type { FunctionComponent } from "../common/types";
import { Button } from "../components/ui/button";

export const Home = (): FunctionComponent => {
	const { t, i18n } = useTranslation();

	const languages = ["en", "es", "id"] as const;
	const onTranslateButtonClick = async (): Promise<void> => {
		const currentIndex = languages.indexOf(i18n.resolvedLanguage ?? "en");
		const nextIndex = (currentIndex + 1) % languages.length;
		await i18n.changeLanguage(languages[nextIndex]);
	};

	const menuItems = [
		{
			title: "View TanStack Table Showcase",
			to: "/table-showcase",
			icon: Table2,
			description: "Explore table features",
		},
		{
			title: "View BAK Files",
			to: "/list-bak-files",
			icon: FileText,
			description: "Browse backup files",
		},
		{
			title: "View Forms Example",
			to: "/form-example",
			icon: FormInput,
			description: "See form components",
		},
		{
			title: "View Items List",
			to: "/items",
			icon: Package,
			description: "Browse items collection",
		},
	];

	return (
		<div className="w-full flex flex-col min-h-screen relative z-10">
			{/* Floating Orbs */}
			<div className="floating-orb floating-orb-1" />
			<div className="floating-orb floating-orb-2" />
			<div className="floating-orb floating-orb-3" />

			{/* Main Content */}
			<div className="flex-1 flex flex-col justify-center items-center px-4 py-12 sm:py-16 relative z-10">
				<div className="w-full max-w-2xl mx-auto">
					{/* Hero Section */}
					<div className="glass-effect rounded-2xl p-8 sm:p-12 mb-8 text-center">
						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
							{t("home.greeting")}
						</h1>
						<p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
							Welcome to our modern web application
						</p>
						<Button
							className="glass-effect-light hover:glass-effect rounded-xl px-6 py-3 text-base font-semibold transition-all"
							type="button"
							onClick={onTranslateButtonClick}
						>
							<Languages className="h-5 w-5 mr-2" />
							Change Language
						</Button>
					</div>

					{/* Menu Items Grid */}
					<div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
						{menuItems.map((item) => {
							const Icon = item.icon;
							return (
								<Link
									key={item.to}
									className="glass-effect rounded-xl p-6 sm:p-8 hover:scale-[1.02] transition-all group cursor-pointer block"
									to={item.to}
								>
									<div className="flex items-start gap-4">
										<div className="glass-effect-light rounded-xl p-3 group-hover:scale-110 transition-transform">
											<Icon className="h-6 w-6 text-foreground" />
										</div>
										<div className="flex-1">
											<h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 group-hover:text-foreground transition-colors">
												{item.title}
											</h2>
											<p className="text-sm sm:text-base text-muted-foreground">
												{item.description}
											</p>
										</div>
									</div>
								</Link>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};
