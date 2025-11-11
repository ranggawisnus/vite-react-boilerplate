/**
 * Helper function untuk mendapatkan URL gambar bendera langsung dari kode negara
 * Tanpa perlu fetch data negara terlebih dahulu
 * Menggunakan flagcdn.com untuk mendapatkan gambar bendera
 *
 * @param countryCode - ISO 3166-1 alpha-2 code (e.g., "US", "ES", "ID")
 * @param format - Format gambar: 'png' atau 'svg' (default: 'png')
 * @param size - Ukuran untuk PNG (default: 'w40' untuk header)
 * @returns URL gambar bendera
 *
 * @example
 * ```tsx
 * const flagUrl = getFlagUrlByCountryCode("us", "png", "w40");
 * // Returns: "https://flagcdn.com/w40/us.png"
 * ```
 */
export function getFlagUrlByCountryCode(
	countryCode: string,
	format: "png" | "svg" = "png",
	size:
		| "w20"
		| "w40"
		| "w80"
		| "w160"
		| "w320"
		| "w640"
		| "w1280"
		| "w2560" = "w40"
): string {
	const code = countryCode.toLowerCase();
	if (format === "svg") {
		return `https://flagcdn.com/${code}.svg`;
	}
	return `https://flagcdn.com/${size}/${code}.png`;
}
