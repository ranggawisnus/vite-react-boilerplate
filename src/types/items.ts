/**
 * Item Types
 * Types untuk item data
 */

/**
 * Specification item untuk detail item
 */
export type ItemSpecification = {
	label: string;
	value: string;
};

/**
 * Base item type (untuk list)
 */
export type Item = {
	id: number;
	title: string;
	description: string;
	price: number;
	category: string;
	image: string;
};

/**
 * Item detail type (extends Item dengan specifications)
 */
export type ItemDetail = Item & {
	specifications: Array<ItemSpecification>;
};

/**
 * API Response untuk items list
 */
export type ItemsListResponse = {
	items: Array<Item>;
	total: number;
};

/**
 * API Response untuk item detail
 */
export type ItemDetailResponse = {
	item: ItemDetail;
};
