"use client";

import { useEffect, useState } from "react";
import { ImageIcon, FileText, File, Trash2, Upload, ExternalLink } from "lucide-react";
import { getTreatmentFiles, uploadTreatmentFiles, deleteTreatmentFile } from "@/services/treatment.service";
import type { TreatmentFile } from "@/types/treatment";
import { useMobile } from "@/hooks/useMobile";

type Props = {
	treatmentId: number;
};

export default function TreatmentFilesSection({ treatmentId }: Props) {
	const isMobile = useMobile();
	const [files, setFiles] = useState<TreatmentFile[]>([]);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [loading, setLoading] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [deleteFileId, setDeleteFileId] = useState<number | null>(null);
	const [showToast, setShowToast] = useState("");
	const [error, setError] = useState("");
	const [fileToDelete, setFileToDelete] = useState<TreatmentFile | null>(null);

	const [uploadHovered, setUploadHovered] = useState(false);

	useEffect(() => {
		fetchFiles();
	}, [treatmentId]);

	const fetchFiles = async () => {
		try {
			setLoading(true);
			const response = await getTreatmentFiles(treatmentId);
			setFiles(response);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleUpload = async () => {
		if (selectedFiles.length === 0) return;
		try {
			setUploading(true);
			setError("");
			await uploadTreatmentFiles(treatmentId, selectedFiles);
			setSelectedFiles([]);
			await fetchFiles();
			setShowToast("Files uploaded successfully");
			setTimeout(() => setShowToast(""), 2500);
		} catch (error: any) {
			setError(error?.response?.data?.detail || "Unsupported file type");
		} finally {
			setUploading(false);
		}
	};

	const handleDelete = async () => {
		if (!fileToDelete) return;
		try {
			await deleteTreatmentFile(fileToDelete.id);
			await fetchFiles();
			setFileToDelete(null);
			setShowToast("File deleted successfully");
			setTimeout(() => setShowToast(""), 2500);
		} catch (error) {
			console.error(error);
			setError("Failed to delete file");
		}
	};

	const formatSize = (bytes: number) => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

	const getFileIcon = (type: string) => {
		if (type.includes("image")) return <ImageIcon size={22} />;
		if (type.includes("pdf")) return <FileText size={22} />;
		return <File size={22} />;
	};

	return (
		<div
			style={{
				marginTop: "32px",
			}}
		>
			{showToast && (
				<div style={toastStyle}>
					{showToast}
				</div>
			)}

			<h3
				style={{
					color: "#f8fafc",
					marginBottom: "18px",
					fontSize: "22px",
				}}
			>
				Treatment Files
			</h3>

			<div
				style={{
					display: "flex",
					flexDirection: isMobile ? "column" : "row",
					alignItems: "stretch",
					gap: "16px",
					marginBottom: "20px",
				}}
			>
				<label
					style={{
						flex: 1,
						border: "1px dashed rgba(59,130,246,0.28)",
						background: "rgba(255,255,255,0.03)",
						borderRadius: "18px",
						padding: "18px 20px",
						cursor: "pointer",
						transition: "all 0.2s ease",
						display: "block", // Needed for input wrapping
					}}
				>
					<input
						type="file"
						multiple
						onChange={(e) => {
							const newFiles = Array.from(e.target.files || []);
							setSelectedFiles((prev) => [...prev, ...newFiles]);
							e.target.value = "";
						}}
						style={{ display: "none" }}
					/>

					<div>
						<div
							style={{
								color: "#f8fafc",
								fontWeight: 600,
								marginBottom: "6px",
							}}
						>
							Click to select files
						</div>

						<div
							style={{
								color: "#94a3b8",
								fontSize: "14px",
							}}
						>
							JPG, PNG, PDF • Multiple files supported
						</div>

						{selectedFiles.length > 0 && (
							<div
								style={{
									marginTop: "12px",
								}}
							>
								<div
									style={{
										color: "#60a5fa",
										fontSize: "13px",
										fontWeight: 600,
										marginBottom: "8px",
									}}
								>
									{selectedFiles.length} file(s) selected
								</div>

								<div
									style={{
										display: "flex",
										flexWrap: "wrap",
										gap: "8px",
									}}
								>
									{selectedFiles.map((file, index) => (
										<div
											key={index}
											style={{
												display: "flex",
												alignItems: "center",
												gap: "8px",
												padding: "8px 10px",
												borderRadius: "12px",
												background: "rgba(59,130,246,0.12)",
												border: "1px solid rgba(59,130,246,0.22)",
												color: "#dbeafe",
												fontSize: "12px",
												maxWidth: "260px",
												minWidth: "120px",
												overflow: "hidden",
											}}
										>
											<span
												style={{
													flex: 1,
													overflow: "hidden",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap",
												}}
											>
												{file.name}
											</span>

											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation();
													setSelectedFiles((prev) =>
														prev.filter((_, i) => i !== index)
													);
												}}
												onMouseEnter={(e) => {
													e.currentTarget.style.background =
														"rgba(239,68,68,0.18)";
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.background = "transparent";
												}}
												style={{
													width: "22px",
													height: "22px",
													border: "none",
													borderRadius: "50%",
													background: "transparent",
													color: "#f87171",
													cursor: "pointer",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													fontSize: "16px",
													fontWeight: 700,
													flexShrink: 0,
													transition: "all 0.2s ease",
												}}
											>
												×
											</button>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</label>

				<button
					onClick={handleUpload}
					onMouseEnter={(e) => {
						setUploadHovered(true);
						e.currentTarget.style.transform = "translateY(-2px)";
						e.currentTarget.style.boxShadow = "0 12px 30px rgba(37,99,235,0.28)";
					}}
					onMouseLeave={(e) => {
						setUploadHovered(false);
						e.currentTarget.style.transform = "translateY(0px)";
						e.currentTarget.style.boxShadow = "none";
					}}
					style={{
						height: isMobile ? "56px" : "auto", // Match height of flex parent on desktop, fixed height on mobile
						minWidth: "180px",
						padding: "0 24px",
						borderRadius: "18px",
						border: "1px solid rgba(59,130,246,0.25)",
						background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
						color: "white",
						cursor: "pointer",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: "10px",
						fontWeight: 600,
						fontSize: "15px",
						transition: "all 0.25s ease",
						flexShrink: 0,
					}}
				>
					<Upload size={18} />
					{uploading ? "Uploading..." : "Upload Files"}
				</button>
			</div>

			{error && (
				<div
					style={{
						color: "#f87171",
						fontSize: "14px",
						marginBottom: "18px",
					}}
				>
					{error}
				</div>
			)}

			{loading ? (
				<p
					style={{
						color: "#94a3b8",
					}}
				>
					Loading files...
				</p>
			) : files.length === 0 ? (
				<p
					style={{
						color: "#64748b",
					}}
				>
					No files uploaded
				</p>
			) : (
				<div
					style={{
						display: "grid",
						gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))",
						gap: "14px",
					}}
				>
					{files.map((file) => (
						<div
							key={file.id}
							style={{
								display: "flex",
								alignItems: "center",
								gap: "16px",
								padding: "18px",
								borderRadius: "18px",
								background: "rgba(255,255,255,0.04)",
								border: "1px solid rgba(255,255,255,0.06)",
							}}
						>
							<div style={{ color: "#60a5fa" }}>
								{getFileIcon(file.file_type)}
							</div>

							<div
								style={{
									flex: 1,
									minWidth: 0, // Prevents text overflow breaking grid
								}}
							>
								<div
									style={{
										color: "#f8fafc",
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis",
									}}
									title={file.original_file_name} // Show full name on hover
								>
									{file.original_file_name}
								</div>

								<div
									style={{
										color: "#94a3b8",
										fontSize: "13px",
									}}
								>
									{formatSize(file.file_size)}
								</div>
							</div>

							<a
								href={`${process.env.NEXT_PUBLIC_API_URL}${file.file_url}`}
								target="_blank"
								rel="noreferrer"
							>
								<ExternalLink size={18} color="#60a5fa" />
							</a>

							<button
								onClick={() => setFileToDelete(file)}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = "scale(1.08)";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = "scale(1)";
								}}
								style={{
									background: "none",
									border: "none",
									cursor: "pointer",
									color: "#ef4444",
									display: "flex",
									padding: 0,
									transition: "transform 0.2s ease",
								}}
							>
								<Trash2 size={18} />
							</button>
						</div>
					))}
				</div>
			)}

			{fileToDelete && (
				<div
					style={{
						position: "fixed",
						inset: 0,
						background: "rgba(0,0,0,0.72)",
						backdropFilter: "blur(8px)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 13000,
					}}
				>
					<div
						style={{
							width: isMobile ? "92vw" : "460px",
							borderRadius: "28px",
							padding: "30px",
							background: "linear-gradient(180deg, rgba(7,15,35,0.98), rgba(2,10,24,0.98))",
							border: "1px solid rgba(255,255,255,0.08)",
							boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
						}}
					>
						<h3
							style={{
								color: "#f8fafc",
								margin: "0 0 10px",
								fontSize: "22px",
							}}
						>
							Delete File
						</h3>

						<p
							style={{
								color: "#94a3b8",
								lineHeight: 1.6,
								marginBottom: "24px",
							}}
						>
							Are you sure you want to delete{" "}
							<strong style={{ color: "#f8fafc" }}>
								{fileToDelete.original_file_name}
							</strong>
							? This action cannot be undone.
						</p>

						<div
							style={{
								display: "flex",
								justifyContent: "flex-end",
								gap: "12px",
								flexDirection: isMobile ? "column" : "row",
							}}
						>
							<button
								onClick={() => setFileToDelete(null)}
								style={{
									height: "50px",
									padding: "0 20px",
									borderRadius: "14px",
									border: "1px solid rgba(255,255,255,0.08)",
									background: "rgba(255,255,255,0.04)",
									color: "#d6e2f0",
									cursor: "pointer",
									fontWeight: 600,
									transition: "all 0.22s ease",
									width: isMobile ? "100%" : "auto",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = "translateY(-2px)";
									e.currentTarget.style.background = "rgba(255,255,255,0.08)";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = "translateY(0px)";
									e.currentTarget.style.background = "rgba(255,255,255,0.04)";
								}}
							>
								Cancel
							</button>

							<button
								onClick={handleDelete}
								style={{
									height: "50px",
									padding: "0 20px",
									border: "none",
									borderRadius: "14px",
									background: "linear-gradient(135deg,#dc2626,#b91c1c)",
									color: "white",
									cursor: "pointer",
									fontWeight: 600,
									transition: "all 0.22s ease",
									width: isMobile ? "100%" : "auto",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = "translateY(-2px)";
									e.currentTarget.style.boxShadow = "0 12px 28px rgba(220,38,38,0.28)";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = "translateY(0px)";
									e.currentTarget.style.boxShadow = "none";
								}}
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

const toastStyle = {
	position: "fixed" as const,
	top: "30px",
	left: "50%",
	transform: "translateX(-50%)",
	background: "rgba(16,185,129,0.95)",
	color: "white",
	padding: "14px 24px",
	borderRadius: "16px",
	zIndex: 12000,
};
