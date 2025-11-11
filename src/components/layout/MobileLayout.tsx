import { useLocation, useNavigate, Outlet, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { FunctionComponent } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utilities";
import { getFlagUrlByCountryCode } from "../../api/countries";

type MobileLayoutProps = {
	className?: string;
};

export const MobileLayout: FunctionComponent<MobileLayoutProps> = ({
	className,
}) => {
	const location = useLocation();
	const navigate = useNavigate();
	const { i18n } = useTranslation();
	const isHomePage = location.pathname === "/";

	// Mapping kode bahasa ke kode negara untuk bendera
	const languages = [
		{ code: "en", countryCode: "us" }, // English -> United States
		{ code: "es", countryCode: "es" }, // Spanish -> Spain
		{ code: "id", countryCode: "id" }, // Indonesian -> Indonesia
	] as const;

	const currentLanguage =
		languages.find((lang) => lang.code === i18n.resolvedLanguage) ??
		languages[0];

	const handleBack = (): void => {
		if (window.history.length > 1) {
			window.history.back();
		} else {
			void navigate({ to: "/" });
		}
	};

	const handleLanguageChange = async (): Promise<void> => {
		const currentIndex = languages.findIndex(
			(lang) => lang.code === i18n.resolvedLanguage
		);
		const nextIndex = (currentIndex + 1) % languages.length;
		const nextLanguage = languages[nextIndex];
		if (nextLanguage) {
			await i18n.changeLanguage(nextLanguage.code);
		}
	};

	return (
		<div className="min-h-screen w-full flex flex-col overflow-x-hidden relative z-10 bg-white">
			{/* Header */}
			<header className="sticky top-0 z-20 w-full bg-white border-b border-gray-200 shadow-sm">
				<div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
					{/* Left Side - Logo/Title and Back Button */}
					<div className="flex items-center gap-3">
						{!isHomePage && (
							<Button
								aria-label="Go back"
								className="bg-gray-50 hover:bg-gray-100 rounded-lg"
								size="icon"
								variant="ghost"
								onClick={handleBack}
							>
								<ArrowLeft className="h-5 w-5" />
							</Button>
						)}
						<Link
							className="flex items-center gap-2 hover:opacity-80 transition-opacity"
							to="/"
						>
							<span className="text-base sm:text-lg font-bold text-foreground">
								Example Boilerplate
							</span>
						</Link>
					</div>

					{/* Right Side - Actions */}
					<div className="flex items-center gap-2">
						<Button
							aria-label="Change language"
							className="bg-gray-50 hover:bg-gray-100 rounded-lg p-1.5"
							size="icon"
							variant="ghost"
							onClick={handleLanguageChange}
						>
							<img
								alt={`${currentLanguage?.code.toUpperCase()} flag`}
								className="w-6 h-4 object-cover rounded-sm border border-gray-200"
								loading="eager"
								src={getFlagUrlByCountryCode(
									currentLanguage?.countryCode ?? "us",
									"png",
									"w40"
								)}
							/>
						</Button>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main
				className={cn(
					"flex-1 w-full max-w-7xl mx-auto overflow-x-hidden",
					className
				)}
			>
				<Outlet />
			</main>
		</div>
	);
};
