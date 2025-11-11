import { useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utilities";

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
	src: string;
	alt: string;
	className?: string;
	fallback?: string;
};

/**
 * Converts an image URL to WebP format if possible
 * Uses services that support WebP or converts common image formats
 */
const convertToWebP = (url: string): string => {
	// If already WebP, return as is
	if (
		url.includes(".webp") ||
		url.includes("format=webp") ||
		url.includes("fm=webp")
	) {
		return url;
	}

	// For Picsum Photos, use Unsplash Source API which supports WebP
	if (url.includes("picsum.photos")) {
		// Extract the seed/random number from the URL
		const match = url.match(/random=(\d+)/);
		const seed = match ? match[1] : "1";
		// Use Unsplash Source API with WebP format
		return `https://source.unsplash.com/featured/800x600/?sig=${seed}&fm=webp`;
	}

	// For Unsplash URLs, add WebP format parameter
	if (url.includes("unsplash.com") || url.includes("source.unsplash.com")) {
		const separator = url.includes("?") ? "&" : "?";
		return `${url}${separator}fm=webp`;
	}

	// For other URLs, try to convert extension to .webp
	// In production, you might want to use a CDN service like Cloudinary or Imgix
	if (url.match(/\.(jpg|jpeg|png|gif)$/i)) {
		return url.replace(/\.(jpg|jpeg|png|gif)$/i, ".webp");
	}

	return url;
};

export const Image: React.FC<ImageProps> = ({
	src,
	alt,
	className,
	fallback,
	...props
}) => {
	const [imageSrc, setImageSrc] = useState<string>(convertToWebP(src));
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [hasError, setHasError] = useState<boolean>(false);

	const handleError = (): void => {
		if (fallback && imageSrc !== fallback) {
			setImageSrc(fallback);
			setHasError(false);
		} else {
			setHasError(true);
			setIsLoading(false);
		}
	};

	const handleLoad = (): void => {
		setIsLoading(false);
	};

	if (hasError && !fallback) {
		return (
			<div
				className={cn(
					"flex items-center justify-center bg-gray-200 text-gray-400",
					className
				)}
				{...props}
			>
				<span className="text-sm">No image</span>
			</div>
		);
	}

	return (
		<div className={cn("relative overflow-hidden", className)}>
			{isLoading && (
				<div className="absolute inset-0 bg-gray-200 animate-pulse" />
			)}
			<img
				src={imageSrc}
				alt={alt}
				className={cn(
					"w-full h-full object-cover transition-opacity duration-300",
					isLoading ? "opacity-0" : "opacity-100"
				)}
				loading="lazy"
				onError={handleError}
				onLoad={handleLoad}
				{...props}
			/>
		</div>
	);
};
