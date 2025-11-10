import { useLocation, useNavigate, Outlet, Link } from "@tanstack/react-router";
import { ArrowLeft, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { FunctionComponent } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utilities";

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

	const languages = [
		{ code: "en", flag: "🇺🇸" },
		{ code: "es", flag: "🇪🇸" },
		{ code: "id", flag: "🇮🇩" },
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
		<div className="min-h-screen w-full flex flex-col overflow-x-hidden relative z-10">
			{/* Header */}
			<header className="sticky top-0 z-20 w-full glass-effect-strong border-b border-white/20">
				<div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
					{/* Left Side - Logo/Title and Back Button */}
					<div className="flex items-center gap-3">
						{!isHomePage && (
							<Button
								aria-label="Go back"
								className="glass-effect-light hover:glass-effect rounded-lg"
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
							<div className="glass-effect-light rounded-lg p-1.5">
								<Globe className="h-5 w-5 text-foreground" />
							</div>
							<span className="text-base sm:text-lg font-bold text-foreground">
								App
							</span>
						</Link>
					</div>

					{/* Right Side - Actions */}
					<div className="flex items-center gap-2">
						<Button
							aria-label="Change language"
							className="glass-effect-light hover:glass-effect rounded-lg"
							size="icon"
							variant="ghost"
							onClick={handleLanguageChange}
						>
							<span className="text-xl">{currentLanguage.flag}</span>
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
