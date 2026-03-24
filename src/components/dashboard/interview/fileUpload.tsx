"use client";

import { parsePdf } from "@/actions/parse-pdf";
import { useLanguage } from "@/contexts/language.context";
import { UploadCloud, X, CheckCircle2, FileText } from "lucide-react";
import { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

type Props = {
  isUploaded: boolean;
  setIsUploaded: (isUploaded: boolean) => void;
  fileName: string;
  setFileName: (fileName: string) => void;
  setUploadedDocumentContext: (context: string) => void;
};

const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "text/plain": [".txt"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
};

const ACCEPTED_EXTENSIONS = ".pdf, .txt, .doc, .docx";

async function extractText(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") {
    const formData = new FormData();
    formData.append("file", file);
    const result = await parsePdf(formData);
    if (!result.success) throw new Error(result.error);
    return result.text || "";
  }
  return await file.text();
}

function FileUpload({
  isUploaded,
  setIsUploaded,
  fileName,
  setFileName,
  setUploadedDocumentContext,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const handleFiles = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setFileName(file.name);
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Please upload a file smaller than 10MB.", {
        position: "bottom-right",
        duration: 3000,
      });
      return;
    }
    try {
      setUploading(true);
      const text = await extractText(file);
      setUploadedDocumentContext(text);
      setIsUploaded(true);
    } catch (error) {
      console.log(error);
      toast.error("Error reading file", {
        description: "Please try again.",
        duration: 3000,
      });
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    onDrop: handleFiles,
    noClick: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) handleFiles(files);
    e.target.value = "";
  };

  const handleRemove = () => {
    setIsUploaded(false);
    setFileName("");
    setUploadedDocumentContext("");
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        className="hidden"
        onChange={handleInputChange}
      />

      {!isUploaded ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl bg-secondary/30 flex flex-col justify-center items-center gap-2 py-6 px-4 transition-all ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-secondary/50"
          }`}
        >
          <input {...getInputProps()} />
          <div className={`p-3 rounded-full ${isDragActive ? "bg-primary/10" : "bg-secondary"}`}>
            <UploadCloud
              className={`w-6 h-6 ${isDragActive ? "text-primary" : "text-muted-foreground"}`}
            />
          </div>
          <div className="text-center">
            <p className="text-sm text-foreground font-medium">
              {isDragActive ? "Drop file here..." : "Drag & drop a file here"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">or</p>
          </div>
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="btn-primary py-2 px-4 text-sm disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Select File"}
          </button>
          <p className="text-xs text-muted-foreground">
            Supported: {ACCEPTED_EXTENSIONS}
          </p>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-700">File uploaded successfully</p>
              <div className="flex items-center gap-1.5 mt-1">
                <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground truncate max-w-[250px]">{fileName}</p>
              </div>
            </div>
          </div>
          <button
            type="button"
            title="Remove file"
            onClick={handleRemove}
            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
