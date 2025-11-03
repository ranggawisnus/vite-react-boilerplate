import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import type { FunctionComponent } from "../common/types";

export const Home = (): FunctionComponent => {
	const { t, i18n } = useTranslation();

	const languages = ["en", "es", "id"] as const;
	const onTranslateButtonClick = async (): Promise<void> => {
		const currentIndex = languages.indexOf(i18n.resolvedLanguage ?? "en");
		const nextIndex = (currentIndex + 1) % languages.length;
		await i18n.changeLanguage(languages[nextIndex]);
	};

	return (
		<div className="bg-blue-300 font-bold w-screen h-screen flex flex-col justify-center items-center">
			<p className="text-white text-6xl mb-8">{t("home.greeting")}</p>
			<div className="flex flex-col gap-4 items-center">
				<button
					className="hover:cursor-pointer bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
					type="submit"
					onClick={onTranslateButtonClick}
				>
					translate
				</button>
				<Link
					className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
					to="/table-showcase"
				>
					View TanStack Table Showcase
				</Link>
				<a
					className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
					href="/list-bak-files"
				>
					View BAK Files
				</a>
			</div>
		</div>
	);
};
