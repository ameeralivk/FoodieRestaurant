

import React, { useState } from "react";
import { AlertCircle, Upload } from "lucide-react";

interface RejectionModalProps {
  isOpen: boolean;
  rejectionReason: string;
  documentType: "proof" | "photo";
  onReupload: (file: File) => void;
}

const RejectionModal: React.FC<RejectionModalProps> = ({
  isOpen,
  rejectionReason,
  documentType,
  onReupload,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  if (!isOpen) return null;
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    const IMAGE_TYPES = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];

    const PROOF_TYPES = [
      "application/pdf",
      ...IMAGE_TYPES,
    ];
    if (file.size > MAX_SIZE) {
      setError("File size must be less than 5MB");
      setSelectedFile(null);
      return;
    }
    if (
      (documentType === "proof" && !PROOF_TYPES.includes(file.type)) ||
      (documentType === "photo" && !IMAGE_TYPES.includes(file.type))
    ) {
      setError(
        documentType === "proof"
          ? "Only PDF or image files are allowed"
          : "Only image files are allowed"
      );
      setSelectedFile(null);
      return;
    }

    setError("");
    setSelectedFile(file);
  };



  const handleSubmit = () => {
    if (!selectedFile || error) return;
    onReupload(selectedFile);
    setSelectedFile(null);
    setError("");
  };

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-[#2a3f5f] rounded-lg w-full max-w-2xl mx-4 shadow-2xl">

        {/* Header */}
        <div className="p-6 border-b border-gray-600">
          <h2 className="text-xl font-semibold text-white">
            Document Rejected
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* Rejection Reason */}
          <div className="bg-[#1e2f47] rounded-lg p-4 border border-red-500/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-500 mt-1" size={20} />
              <div>
                <h3 className="text-white font-medium mb-1">
                  Rejection Reason
                </h3>
                <p className="text-gray-300 text-sm">
                  {rejectionReason}
                </p>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div>
            <label className="block text-white font-medium mb-3">
              Upload New {documentType === "proof" ? "Document" : "Photo"}
            </label>

            <div className="relative">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                accept={
                  documentType === "proof"
                    ? ".pdf,image/*"
                    : "image/*"
                }
                className="hidden"
              />

              <label
                htmlFor="file-upload"
                className="flex items-center justify-center gap-2 bg-[#1e2f47]
                border-2 border-dashed border-gray-600 hover:border-yellow-500
                rounded-lg p-8 cursor-pointer transition-all"
              >
                <Upload className="text-gray-400" size={24} />
                <span className="text-gray-300">
                  {selectedFile
                    ? selectedFile.name
                    : "Click to upload file"}
                </span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                <AlertCircle size={14} />
                {error}
              </p>
            )}

            {/* Success */}
            {selectedFile && !error && (
              <p className="text-green-400 text-sm mt-2">
                ✓ File selected: {selectedFile.name}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-600">
          <button
            onClick={handleSubmit}
            disabled={!selectedFile || !!error}
            className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600
            text-black font-medium rounded-lg transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reupload Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectionModal;

