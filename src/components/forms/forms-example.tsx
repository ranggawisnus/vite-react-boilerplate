"use client";

import type * as React from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Bug, Send, RotateCcw } from "lucide-react";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	InputGroupTextarea,
} from "@/components/ui/input-group";

const formSchema = z.object({
	title: z
		.string()
		.min(5, "Bug title must be at least 5 characters.")
		.max(32, "Bug title must be at most 32 characters."),
	description: z
		.string()
		.min(20, "Description must be at least 20 characters.")
		.max(100, "Description must be at most 100 characters."),
});

export function BugReportForm(): React.ReactElement {
	const form = useForm({
		defaultValues: {
			title: "",
			description: "",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: ({ value }) => {
			toast("You submitted the following values:", {
				description: (
					<pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
						<code>{JSON.stringify(value, null, 2)}</code>
					</pre>
				),
				position: "bottom-right",
				classNames: {
					content: "flex flex-col gap-2",
				},
			});
		},
	});

	return (
		<div className="w-full flex flex-col min-h-screen relative z-10">
			{/* Floating Orbs */}
			<div className="floating-orb floating-orb-1" />
			<div className="floating-orb floating-orb-2" />
			<div className="floating-orb floating-orb-3" />

			{/* Main Content */}
			<div className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16 relative z-10">
				<div className="w-full max-w-2xl mx-auto">
					{/* Form Card */}
					<div className="glass-effect rounded-2xl overflow-hidden">
						{/* Header */}
						<div className="p-6 sm:p-8 border-b border-white/20">
							<div className="flex items-center gap-4 mb-4">
								<div className="glass-effect-light rounded-xl p-3">
									<Bug className="h-6 w-6 text-foreground" />
								</div>
								<div>
									<h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
										Bug Report
									</h1>
									<p className="text-sm sm:text-base text-muted-foreground">
										Help us improve by reporting bugs you encounter.
									</p>
								</div>
							</div>
						</div>

						{/* Form Content */}
						<div className="p-6 sm:p-8">
							<form
								id="bug-report-form"
								onSubmit={(event_) => {
									event_.preventDefault();
									form.handleSubmit().catch((error) => {
										console.error(error);
									});
								}}
							>
								<FieldGroup>
									<form.Field
										children={(field) => {
											console.log(field.store);
											const isInvalid =
												field.state.meta.isTouched && !field.state.meta.isValid;
											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel htmlFor={field.name}>
														Bug Title
													</FieldLabel>
													<Input
														aria-invalid={isInvalid}
														autoComplete="off"
														className="glass-effect-light bg-white/30 backdrop-blur-md border-white/30 rounded-lg focus-visible:ring-2 focus-visible:ring-white/50"
														id={field.name}
														name={field.name}
														placeholder="Login button not working on mobile"
														value={field.state.value}
														onBlur={field.handleBlur}
														onChange={(event_) => {
															field.handleChange(event_.target.value);
														}}
													/>
													{isInvalid && (
														<FieldError errors={field.state.meta.errors} />
													)}
												</Field>
											);
										}}
										name="title"
									/>
									<form.Field
										children={(field) => {
											const isInvalid =
												field.state.meta.isTouched && !field.state.meta.isValid;
											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel htmlFor={field.name}>
														Description
													</FieldLabel>
													<InputGroup>
														<InputGroupTextarea
															aria-invalid={isInvalid}
															className="min-h-24 resize-none glass-effect-light bg-white/30 backdrop-blur-md border-white/30 rounded-lg focus-visible:ring-2 focus-visible:ring-white/50"
															id={field.name}
															name={field.name}
															placeholder="I'm having an issue with the login button on mobile."
															rows={6}
															value={field.state.value}
															onBlur={field.handleBlur}
															onChange={(event_) => {
																field.handleChange(event_.target.value);
															}}
														/>
														<InputGroupAddon align="block-end">
															<InputGroupText className="tabular-nums text-xs text-muted-foreground">
																{field.state.value.length}/100 characters
															</InputGroupText>
														</InputGroupAddon>
													</InputGroup>
													<FieldDescription>
														Include steps to reproduce, expected behavior, and
														what actually happened.
													</FieldDescription>
													{isInvalid && (
														<FieldError errors={field.state.meta.errors} />
													)}
												</Field>
											);
										}}
										name="description"
									/>
								</FieldGroup>
							</form>
						</div>

						{/* Footer */}
						<div className="p-6 sm:p-8 border-t border-white/20">
							<Field orientation="horizontal">
								<Button
									className="glass-effect-light hover:glass-effect rounded-xl"
									type="button"
									variant="outline"
									onClick={() => {
										form.reset();
									}}
								>
									<RotateCcw className="h-4 w-4 mr-2" />
									Reset
								</Button>
								<Button
									className="glass-effect hover:glass-effect-strong rounded-xl"
									form="bug-report-form"
									type="submit"
								>
									<Send className="h-4 w-4 mr-2" />
									Submit
								</Button>
							</Field>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
