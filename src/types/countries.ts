/**
 * Types untuk REST Countries API
 * Dokumentasi: https://restcountries.com
 */

/**
 * Flag images dari REST Countries API
 */
export type CountryFlags = {
	png: string;
	svg: string;
	alt?: string;
};

/**
 * Country name dari REST Countries API
 */
export type CountryName = {
	common: string;
	official: string;
	nativeName?: Record<string, { official: string; common: string }>;
};

/**
 * Country data dari REST Countries API
 */
export type Country = {
	name: CountryName;
	flags: CountryFlags;
	cca2: string; // ISO 3166-1 alpha-2 code (e.g., "ID")
	cca3: string; // ISO 3166-1 alpha-3 code (e.g., "IDN")
	ccn3?: string; // ISO 3166-1 numeric code
	cioc?: string; // IOC code
	independent?: boolean;
	status: string;
	unMember: boolean;
	currencies?: Record<string, { name: string; symbol: string }>;
	idd?: {
		root?: string;
		suffixes?: string[];
	};
	capital?: string[];
	altSpellings?: string[];
	region: string;
	subregion?: string;
	languages?: Record<string, string>;
	translations?: Record<string, { official: string; common: string }>;
	latlng?: [number, number];
	landlocked?: boolean;
	borders?: string[];
	area?: number;
	demonyms?: Record<string, { f: string; m: string }>;
	flag?: string; // Emoji flag
	maps?: {
		googleMaps: string;
		openStreetMaps: string;
	};
	population?: number;
	gini?: Record<string, number>;
	fifa?: string;
	car?: {
		signs?: string[];
		side: string;
	};
	timezones?: string[];
	continents?: string[];
	coatOfArms?: {
		png?: string;
		svg?: string;
	};
	startOfWeek?: string;
	postalCode?: {
		format: string;
		regex: string;
	};
};

/**
 * Response untuk list countries
 */
export type CountriesListResponse = {
	countries: Array<Country>;
	total: number;
};

/**
 * Response untuk single country
 */
export type CountryDetailResponse = {
	country: Country;
};
