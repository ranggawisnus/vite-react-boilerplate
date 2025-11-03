import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { FunctionComponent } from "../common/types";

type ListResponse = {
	success: boolean;
	statusCode: number;
	message: string;
	data: unknown;
	meta: unknown;
	timestamp: string;
	requestId: string;
};

async function fetchBakFiles(): Promise<
	Array<{ bak: string; isZipExist: boolean }>
> {
	const response = await fetch("http://localhost:4000/list", {
		headers: { Accept: "application/json" },
	});

	if (!response.ok) {
		throw new Error(`Request failed: ${response.status}`);
	}

	const json = (await response.json()) as ListResponse;
	if (!json.success || !Array.isArray(json.data)) {
		throw new Error("Unexpected API response");
	}
	const raw = json.data as Array<string | { bak: string; isZipExist: boolean }>;
	return raw.map((item) =>
		typeof item === "string" ? { bak: item, isZipExist: false } : item
	);
}

export const ListBAKFiles = (): FunctionComponent => {
	const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
		queryKey: ["bak-files"],
		queryFn: fetchBakFiles,
	});
	const [downloadingName, setDownloadingName] = useState<string | null>(null);
	const [progressByFile, setProgressByFile] = useState<Record<string, number>>(
		{}
	);
	const [messageByFile, setMessageByFile] = useState<Record<string, string>>(
		{}
	);

	// Prevent accidental navigation/refresh and lock background while streaming
	useEffect(() => {
		if (!downloadingName) return;
		const beforeUnloadHandler = (event: BeforeUnloadEvent): void => {
			event.preventDefault();
			event.returnValue = "";
		};
		window.addEventListener("beforeunload", beforeUnloadHandler);
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return (): void => {
			window.removeEventListener("beforeunload", beforeUnloadHandler);
			document.body.style.overflow = previousOverflow;
		};
	}, [downloadingName]);

	const onDownloadClick = async (fileName: string): Promise<void> => {
		try {
			setDownloadingName(fileName);
			// 1) Stream progress
			const streamResponse = await fetch(
				"http://localhost:4000/convert/file/stream",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ filename: fileName }),
				}
			);
			if (!streamResponse.ok || !streamResponse.body) {
				throw new Error(`Progress stream failed: ${streamResponse.status}`);
			}
			const reader = streamResponse.body.getReader();
			const textDecoder = new TextDecoder();
			// Read all chunks
			for (;;) {
				// eslint-disable-next-line no-await-in-loop
				const { value, done } = await reader.read();
				if (done) break;
				const chunk = textDecoder.decode(value, { stream: true });
				const lines = chunk.split("\n\n");
				for (const line of lines) {
					if (line.startsWith("data: ")) {
						try {
							const event = JSON.parse(line.slice(6)) as {
								type?: string;
								percent?: number;
								message?: string;
							};
							if (typeof event.percent === "number") {
								setProgressByFile((previous) => ({
									...previous,
									[fileName]: event.percent ?? 0,
								}));
							}
							if (typeof event.message === "string") {
								setMessageByFile((previous) => ({
									...previous,
									[fileName]: event.message ?? "",
								}));
							}
						} catch {
							// ignore malformed event lines
						}
					}
				}
			}

			// 2) After completion, download final file
			const downloadResponse = await fetch(
				"http://localhost:4000/convert/file",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/octet-stream",
					},
					body: JSON.stringify({ filename: fileName }),
				}
			);
			if (!downloadResponse.ok) {
				throw new Error(`Convert failed: ${downloadResponse.status}`);
			}
			const resultBlob = await downloadResponse.blob();

			const url = URL.createObjectURL(resultBlob);
			const a = document.createElement("a");
			a.href = url;
			const suggestedName = fileName
				.replace(/\.bak$/i, ".rar")
				.replace(/\.BAK$/g, ".rar");
			a.download = suggestedName || "result.rar";
			a.click();
			URL.revokeObjectURL(url);
		} catch (error_) {
			alert((error_ as Error).message);
		} finally {
			setDownloadingName(null);
			setProgressByFile((previous) => ({ ...previous, [fileName]: 0 }));
			setMessageByFile((previous) => ({ ...previous, [fileName]: "" }));
		}
	};

	const activeFile = downloadingName;
	const activeProgress = activeFile
		? Math.round(progressByFile[activeFile] ?? 0)
		: 0;
	const activeMessage = activeFile ? (messageByFile[activeFile] ?? "") : "";

	return (
		<div className="min-h-screen w-full bg-gray-50 text-gray-900 flex flex-col items-center py-10 px-4">
			<div className="w-full max-w-2xl">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-bold">BAK Files</h1>
					<button
						className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50"
						disabled={isLoading || isRefetching}
						type="button"
						onClick={() => void refetch()}
					>
						{isRefetching || isLoading ? "Loading..." : "Refresh"}
					</button>
				</div>

				{isLoading && (
					<div className="p-4 bg-white rounded-md shadow">
						Loading bak files...
					</div>
				)}

				{isError && (
					<div className="p-4 bg-red-100 text-red-800 rounded-md shadow">
						Failed to load. {error?.message}
					</div>
				)}

				{!isLoading && !isError && (
					<div className="bg-white rounded-md shadow divide-y">
						{(data ?? []).length === 0 ? (
							<div className="p-4 text-gray-600">No .bak files found.</div>
						) : (
							<ul>
								{(data ?? []).map((item) => (
									<li
										key={item.bak}
										className="p-4 hover:bg-gray-50 flex items-center justify-between gap-4"
									>
										<div className="flex items-center gap-3">
											<span className="font-mono text-sm">{item.bak}</span>
											{item.isZipExist ? (
												<span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
													Generated
												</span>
											) : (
												<span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
													Not generated
												</span>
											)}
										</div>
										<div className="flex items-center gap-3">
											{(progressByFile[item.bak] ?? 0) > 0 && (
												<span className="text-xs text-gray-600 w-14 text-right">
													{Math.round(progressByFile[item.bak] ?? 0)}%
												</span>
											)}
											<button
												className="bg-purple-600 text-white px-3 py-1.5 rounded-md font-semibold hover:bg-purple-700 disabled:opacity-50"
												disabled={downloadingName === item.bak}
												type="button"
												onClick={() => void onDownloadClick(item.bak)}
											>
												{downloadingName === item.bak
													? "Downloading..."
													: "Download"}
											</button>
										</div>
										{messageByFile[item.bak] && (
											<div className="mt-2 text-xs text-gray-500">
												{messageByFile[item.bak]}
											</div>
										)}
									</li>
								))}
							</ul>
						)}
					</div>
				)}
			</div>

			{activeFile && (
				<div
					aria-modal="true"
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
					role="dialog"
				>
					<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
						<h2 className="text-lg font-semibold mb-2">Processing file</h2>
						<p className="text-sm text-gray-700 mb-4 break-all">{activeFile}</p>
						<div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
							<div
								className="h-3 bg-purple-600 transition-all duration-300"
								style={{
									width: `${Math.min(Math.max(activeProgress, 0), 100)}%`,
								}}
							/>
						</div>
						<div className="mt-2 flex items-center justify-between">
							<span className="text-xs text-gray-600">{activeProgress}%</span>
							<span className="text-xs text-gray-500">{activeMessage}</span>
						</div>
						<div className="mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3">
							Mohon jangan klik apapun dan tunggu proses selesai. Jangan menutup
							atau memuat ulang halaman. Please do not click anything and wait
							until processing completes. Do not close or refresh the page.
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
