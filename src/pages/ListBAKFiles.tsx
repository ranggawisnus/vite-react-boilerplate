import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
	RefreshCw,
	Download,
	FileText,
	CheckCircle2,
	Circle,
} from "lucide-react";
import type { FunctionComponent } from "../common/types";
import type { ApiResponse, BakFile, StreamEvent } from "../types";
import { Button } from "../components/ui/button";

async function fetchBakFiles(): Promise<Array<BakFile>> {
	try {
		console.log("Say Hello");
		const response = await fetch("http://localhost:4000/list", {
			headers: { Accept: "application/json" },
		});

		console.log("response", response);

		if (!response.ok) {
			throw new Error(`Request failed: ${response.status}`);
		}

		const json = (await response.json()) as ApiResponse<
			Array<string | BakFile>
		>;
		if (!json.success || !Array.isArray(json.data)) {
			throw new Error("Unexpected API response");
		}
		const raw = json.data;
		return raw.map((item) =>
			typeof item === "string" ? { bak: item, isZipExist: false } : item
		);
	} catch (error) {
		console.error("error", error);
		throw error;
	}
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

	console.log("error", error);

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
							const event = JSON.parse(line.slice(6)) as StreamEvent;
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
		<>
			<div className="w-full flex flex-col min-h-screen relative z-10">
				{/* Floating Orbs */}
				<div className="floating-orb floating-orb-1" />
				<div className="floating-orb floating-orb-2" />
				<div className="floating-orb floating-orb-3" />

				<div className="w-full max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8 relative z-10">
					{/* Header */}
					<div className="glass-effect rounded-xl p-6 sm:p-8 mb-6">
						<div className="flex items-center justify-between flex-col sm:flex-row gap-4">
							<div className="flex items-center gap-3">
								<div className="glass-effect-light rounded-lg p-2.5">
									<FileText className="h-6 w-6 text-foreground" />
								</div>
								<div>
									<h1 className="text-2xl sm:text-3xl font-bold text-foreground">
										BAK Files
									</h1>
									<p className="text-sm text-muted-foreground mt-1">
										Manage your backup files
									</p>
								</div>
							</div>
							<Button
								className="glass-effect-light hover:glass-effect rounded-xl"
								disabled={isLoading || isRefetching}
								type="button"
								onClick={() => {
									void refetch();
								}}
							>
								<RefreshCw
									className={`h-4 w-4 mr-2 ${isRefetching || isLoading ? "animate-spin" : ""}`}
								/>
								{isRefetching || isLoading ? "Loading..." : "Refresh"}
							</Button>
						</div>
					</div>

					{/* Loading State */}
					{isLoading && (
						<div className="glass-effect rounded-xl p-8 text-center">
							<div className="animate-pulse space-y-3">
								<div className="h-4 bg-white/20 rounded w-3/4 mx-auto" />
								<div className="h-4 bg-white/20 rounded w-1/2 mx-auto" />
							</div>
						</div>
					)}

					{/* Error State */}
					{isError && (
						<div className="glass-effect rounded-xl p-8 text-center">
							<p className="text-lg font-semibold text-destructive mb-2">
								Failed to load
							</p>
							<p className="text-sm text-muted-foreground">
								{error?.message ?? "Unknown error"}
							</p>
						</div>
					)}

					{/* Files List */}
					{!isLoading && !isError && (
						<div className="glass-effect rounded-xl overflow-hidden">
							{(data ?? []).length === 0 ? (
								<div className="p-12 text-center">
									<FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
									<p className="text-base font-medium text-foreground mb-2">
										No .bak files found
									</p>
									<p className="text-sm text-muted-foreground">
										Try refreshing the list
									</p>
								</div>
							) : (
								<ul className="divide-y divide-white/20">
									{(data ?? []).map((item) => (
										<li
											key={item.bak}
											className="p-4 sm:p-6 hover:bg-white/10 transition-colors"
										>
											<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
												<div className="flex items-center gap-3 flex-1 min-w-0">
													<div className="glass-effect-light rounded-lg p-2 flex-shrink-0">
														<FileText className="h-4 w-4 text-foreground" />
													</div>
													<div className="flex-1 min-w-0">
														<p className="font-mono text-sm sm:text-base text-foreground truncate">
															{item.bak}
														</p>
														{messageByFile[item.bak] && (
															<p className="text-xs text-muted-foreground mt-1">
																{messageByFile[item.bak]}
															</p>
														)}
													</div>
													{item.isZipExist ? (
														<span className="glass-effect-light rounded-full px-3 py-1 flex items-center gap-1.5 text-xs sm:text-sm font-medium text-foreground flex-shrink-0">
															<CheckCircle2 className="h-3.5 w-3.5" />
															Generated
														</span>
													) : (
														<span className="glass-effect-light rounded-full px-3 py-1 flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground flex-shrink-0">
															<Circle className="h-3.5 w-3.5" />
															Not generated
														</span>
													)}
												</div>
												<div className="flex items-center gap-3">
													{(progressByFile[item.bak] ?? 0) > 0 && (
														<span className="text-sm font-medium text-foreground w-14 text-right">
															{Math.round(progressByFile[item.bak] ?? 0)}%
														</span>
													)}
													<Button
														className="glass-effect-light hover:glass-effect rounded-xl"
														disabled={downloadingName === item.bak}
														type="button"
														onClick={() => {
															void onDownloadClick(item.bak);
														}}
													>
														<Download className="h-4 w-4 mr-2" />
														{downloadingName === item.bak
															? "Downloading..."
															: "Download"}
													</Button>
												</div>
											</div>
										</li>
									))}
								</ul>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Processing Modal */}
			{activeFile && (
				<div
					aria-modal="true"
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
					role="dialog"
				>
					<div className="glass-effect-strong rounded-2xl p-6 sm:p-8 w-full max-w-md mx-4 shadow-2xl">
						<h2 className="text-xl font-semibold text-foreground mb-2">
							Processing file
						</h2>
						<p className="text-sm text-muted-foreground mb-6 break-all">
							{activeFile}
						</p>
						<div className="w-full h-3 rounded-full bg-white/20 overflow-hidden mb-2">
							<div
								className="h-3 bg-blue-500 transition-all duration-300 rounded-full"
								style={{
									width: `${Math.min(Math.max(activeProgress, 0), 100)}%`,
								}}
							/>
						</div>
						<div className="flex items-center justify-between mb-6">
							<span className="text-sm font-medium text-foreground">
								{activeProgress}%
							</span>
							<span className="text-xs text-muted-foreground">
								{activeMessage}
							</span>
						</div>
						<div className="glass-effect-light rounded-xl p-4 text-sm text-foreground">
							<p className="font-medium mb-1">Please wait...</p>
							<p className="text-xs text-muted-foreground">
								Do not close or refresh the page while processing.
							</p>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
