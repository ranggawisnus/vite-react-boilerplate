import type { ApiResponse } from "../types/api";
import type {
	Item,
	ItemDetail,
	ItemDetailResponse,
	ItemsListResponse,
} from "../types/items";

/**
 * Mock data untuk items
 */
const mockItems: Array<Item> = [
	{
		id: 1,
		title: "Laptop",
		description: "High-performance laptop for work and gaming",
		price: 12000000,
		category: "Electronics",
		image: "https://source.unsplash.com/400x300/?sig=1&fm=webp",
	},
	{
		id: 2,
		title: "Smartphone",
		description: "Latest smartphone with advanced features",
		price: 8000000,
		category: "Electronics",
		image: "https://source.unsplash.com/400x300/?sig=2&fm=webp",
	},
	{
		id: 3,
		title: "Headphones",
		description: "Wireless noise-cancelling headphones",
		price: 2500000,
		category: "Audio",
		image: "https://source.unsplash.com/400x300/?sig=3&fm=webp",
	},
	{
		id: 4,
		title: "Keyboard",
		description: "Mechanical keyboard for typing enthusiasts",
		price: 1500000,
		category: "Accessories",
		image: "https://source.unsplash.com/400x300/?sig=4&fm=webp",
	},
	{
		id: 5,
		title: "Monitor",
		description: "4K monitor for professional work",
		price: 5000000,
		category: "Electronics",
		image: "https://source.unsplash.com/400x300/?sig=5&fm=webp",
	},
];

/**
 * Mock data untuk item details dengan specifications
 */
const mockItemDetails: Record<number, ItemDetail> = {
	1: {
		id: 1,
		title: "Laptop",
		description: "High-performance laptop for work and gaming",
		price: 12000000,
		category: "Electronics",
		image: "https://source.unsplash.com/800x600/?sig=1&fm=webp",
		specifications: [
			{ label: "Processor", value: "Intel Core i7" },
			{ label: "RAM", value: "16GB" },
			{ label: "Storage", value: "512GB SSD" },
			{ label: "Display", value: "15.6 inch FHD" },
		],
	},
	2: {
		id: 2,
		title: "Smartphone",
		description: "Latest smartphone with advanced features",
		price: 8000000,
		category: "Electronics",
		image: "https://source.unsplash.com/800x600/?sig=2&fm=webp",
		specifications: [
			{ label: "Screen", value: "6.5 inch AMOLED" },
			{ label: "RAM", value: "8GB" },
			{ label: "Storage", value: "128GB" },
			{ label: "Camera", value: "48MP + 12MP" },
		],
	},
	3: {
		id: 3,
		title: "Headphones",
		description: "Wireless noise-cancelling headphones",
		price: 2500000,
		category: "Audio",
		image: "https://source.unsplash.com/800x600/?sig=3&fm=webp",
		specifications: [
			{ label: "Type", value: "Over-ear" },
			{ label: "Connectivity", value: "Bluetooth 5.0" },
			{ label: "Battery", value: "30 hours" },
			{ label: "Noise Cancelling", value: "Active" },
		],
	},
	4: {
		id: 4,
		title: "Keyboard",
		description: "Mechanical keyboard for typing enthusiasts",
		price: 1500000,
		category: "Accessories",
		image: "https://source.unsplash.com/800x600/?sig=4&fm=webp",
		specifications: [
			{ label: "Type", value: "Mechanical" },
			{ label: "Switch", value: "Cherry MX Blue" },
			{ label: "Layout", value: "Full-size" },
			{ label: "Backlight", value: "RGB" },
		],
	},
	5: {
		id: 5,
		title: "Monitor",
		description: "4K monitor for professional work",
		price: 5000000,
		category: "Electronics",
		image: "https://source.unsplash.com/800x600/?sig=5&fm=webp",
		specifications: [
			{ label: "Size", value: "27 inch" },
			{ label: "Resolution", value: "4K UHD (3840x2160)" },
			{ label: "Panel", value: "IPS" },
			{ label: "Refresh Rate", value: "60Hz" },
		],
	},
};

/**
 * Simulates network delay
 */
const delay = (ms: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(resolve, ms);
	});

/**
 * Fake fetch untuk mendapatkan list items
 */
export async function fetchItems(): Promise<ApiResponse<ItemsListResponse>> {
	// Simulate network delay
	await delay(800);

	const response: ApiResponse<ItemsListResponse> = {
		success: true,
		statusCode: 200,
		message: "Items fetched successfully",
		data: {
			items: mockItems,
			total: mockItems.length,
		},
		meta: {
			page: 1,
			limit: 10,
		},
		timestamp: new Date().toISOString(),
		requestId: `req-${Date.now()}`,
	};

	return response;
}

/**
 * Fake fetch untuk mendapatkan item detail berdasarkan ID
 */
export async function fetchItemDetail(
	itemId: string
): Promise<ApiResponse<ItemDetailResponse>> {
	// Simulate network delay
	await delay(600);

	const id = Number.parseInt(itemId, 10);
	const item = mockItemDetails[id];

	if (!item) {
		const errorResponse: ApiResponse<ItemDetailResponse> = {
			success: false,
			statusCode: 404,
			message: "Item not found",
			data: {
				item: {} as ItemDetail,
			},
			meta: null,
			timestamp: new Date().toISOString(),
			requestId: `req-${Date.now()}`,
		};
		return errorResponse;
	}

	const response: ApiResponse<ItemDetailResponse> = {
		success: true,
		statusCode: 200,
		message: "Item detail fetched successfully",
		data: {
			item,
		},
		meta: null,
		timestamp: new Date().toISOString(),
		requestId: `req-${Date.now()}`,
	};

	return response;
}
