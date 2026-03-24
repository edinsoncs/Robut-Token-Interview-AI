"use client";

import Modal from "@/components/dashboard/Modal";
import InterviewerDetailsModal from "@/components/dashboard/interviewer/interviewerDetailsModal";
import { useLanguage } from "@/contexts/language.context";
import { useInterviewers } from "@/contexts/interviewers.context";
import type { Interviewer } from "@/types/interviewer";
import axios from "axios";
import {
  FileText,
  Upload,
  Sparkles,
  Info,
  ChevronLeft,
  ChevronRight,
  Bot,
  Zap,
  Eye,
  X,
  CheckCircle2,
  Loader2,
  Languages,
  FileQuestion,
  Download,
} from "lucide-react";
import Image from "next/image";
import React, { useState, useRef, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

const SUPPORTED_LANGUAGES = [
  { code: "es", name: "Espanol", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "pt", name: "Portugues", flag: "🇧🇷" },
  { code: "fr", name: "Francais", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
];

const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "text/plain": [".txt"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
};

interface GeneratedQuestion {
  id: string;
  question: string;
  category?: string;
}

function InterviewDocumentPage() {
  const { interviewers, interviewersLoading } = useInterviewers();
  const { t, language: appLanguage } = useLanguage();
  const sliderRef = useRef<HTMLDivElement>(null);

  // State
  const [selectedLanguage, setSelectedLanguage] = useState<string>(appLanguage === "es" ? "es" : "en");
  const [selectedInterviewer, setSelectedInterviewer] = useState<Interviewer | null>(null);
  const [openInterviewerDetails, setOpenInterviewerDetails] = useState(false);
  const [interviewerDetails, setInterviewerDetails] = useState<Interviewer | null>(null);

  // Document state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [documentContent, setDocumentContent] = useState<string>("");
  const [documentUrl, setDocumentUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);

  // Questions state
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [numQuestions, setNumQuestions] = useState<number>(5);

  // Filter interviewers by language
  const filteredInterviewers = useMemo(() => {
    return interviewers.filter((interviewer) => {
      const interviewerLang = interviewer.language?.toLowerCase() || "";
      return interviewerLang.includes(selectedLanguage) || selectedLanguage === "";
    });
  }, [interviewers, selectedLanguage]);

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft -= 120;
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft += 120;
    }
  };

  // Extract text from PDF using server action
  const extractTextFromFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/parse-document", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error parsing document");
      }

      const data = await response.json();
      return data.text || "";
    } catch (error) {
      // Fallback to text extraction for non-PDF files
      if (file.type === "text/plain") {
        return await file.text();
      }
      throw error;
    }
  };

  const handleFileUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("El archivo debe ser menor a 10MB");
      return;
    }

    setIsUploading(true);
    setUploadedFile(file);

    try {
      // Upload to Vercel Blob
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/upload-document", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Error uploading file");
      }

      const { url } = await uploadResponse.json();
      setDocumentUrl(url);

      // Extract text content
      const text = await extractTextFromFile(file);
      setDocumentContent(text);

      toast.success("Documento subido exitosamente");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error al subir el documento");
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    onDrop: handleFileUpload,
  });

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setDocumentContent("");
    setDocumentUrl("");
    setGeneratedQuestions([]);
  };

  const handleGenerateQuestions = async () => {
    if (!documentContent || !selectedInterviewer) {
      toast.error("Por favor selecciona un entrevistador y sube un documento");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await axios.post("/api/generate-document-questions", {
        documentContent,
        language: selectedLanguage,
        numQuestions,
        interviewerName: selectedInterviewer.name,
      });

      const questions = response.data.questions || [];
      setGeneratedQuestions(questions);

      toast.success(`${questions.length} preguntas generadas exitosamente`);
    } catch (error) {
      console.error("Error generating questions:", error);
      toast.error("Error al generar preguntas");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-primary/20">
              <FileQuestion className="w-8 h-8 text-primary" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent rounded-lg flex items-center justify-center border-2 border-background">
              <Sparkles className="w-3 h-3 text-accent-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {appLanguage === "es" ? "Entrevista con Documento" : "Interview with Document"}
            </h1>
            <p className="text-muted-foreground mt-0.5">
              {appLanguage === "es"
                ? "Sube un documento y genera preguntas automaticamente"
                : "Upload a document and generate questions automatically"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Configuration */}
        <div className="space-y-6">
          {/* Language Selection */}
          <div className="bg-card rounded-2xl border border-border/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Languages className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                {appLanguage === "es" ? "Seleccionar Idioma" : "Select Language"}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                    selectedLanguage === lang.code
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-secondary/50 text-foreground hover:bg-secondary"
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interviewer Selection */}
          <div className="bg-card rounded-2xl border border-border/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                {appLanguage === "es" ? "Seleccionar Entrevistador" : "Select Interviewer"}
              </h2>
              {filteredInterviewers.length > 0 && (
                <span className="ml-auto text-sm text-muted-foreground">
                  {filteredInterviewers.length}{" "}
                  {appLanguage === "es" ? "disponibles" : "available"}
                </span>
              )}
            </div>

            {interviewersLoading ? (
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-24 h-28 rounded-2xl bg-secondary/30 animate-pulse"
                  />
                ))}
              </div>
            ) : filteredInterviewers.length === 0 ? (
              <div className="text-center py-8 bg-secondary/30 rounded-xl">
                <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  {appLanguage === "es"
                    ? "No hay entrevistadores para este idioma"
                    : "No interviewers for this language"}
                </p>
              </div>
            ) : (
              <div className="relative">
                <div
                  ref={sliderRef}
                  className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide py-2"
                >
                  {filteredInterviewers.map((interviewer) => (
                    <div key={String(interviewer.id)} className="flex-none relative">
                      <button
                        type="button"
                        className="absolute -top-1 -right-1 z-10 p-1 bg-primary rounded-full shadow-md hover:bg-primary/90 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setInterviewerDetails(interviewer);
                          setOpenInterviewerDetails(true);
                        }}
                      >
                        <Info className="w-3 h-3 text-primary-foreground" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedInterviewer(interviewer)}
                        className={`w-24 h-24 rounded-2xl overflow-hidden border-3 transition-all duration-200 ${
                          selectedInterviewer?.id === interviewer.id
                            ? "border-primary ring-4 ring-primary/20"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Image
                          src={interviewer.image}
                          alt={interviewer.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </button>
                      <p className="text-xs text-center text-muted-foreground mt-1.5 truncate w-24">
                        {interviewer.name}
                      </p>
                    </div>
                  ))}
                </div>
                {filteredInterviewers.length > 4 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={slideRight}
                      className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={slideLeft}
                      className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {selectedInterviewer && (
              <div className="mt-4 p-3 bg-primary/5 rounded-xl border border-primary/20 flex items-center gap-3">
                <Image
                  src={selectedInterviewer.image}
                  alt={selectedInterviewer.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <p className="font-medium text-foreground">{selectedInterviewer.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedInterviewer.description}</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />
              </div>
            )}
          </div>

          {/* Document Upload */}
          <div className="bg-card rounded-2xl border border-border/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-xl">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                {appLanguage === "es" ? "Subir Documento" : "Upload Document"}
              </h2>
            </div>

            {!uploadedFile ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl flex flex-col justify-center items-center gap-3 py-10 px-4 transition-all cursor-pointer ${
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-secondary/30"
                }`}
              >
                <input {...getInputProps()} />
                <div
                  className={`p-4 rounded-2xl ${
                    isDragActive ? "bg-primary/10" : "bg-secondary"
                  }`}
                >
                  <Upload
                    className={`w-8 h-8 ${
                      isDragActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div className="text-center">
                  <p className="text-foreground font-medium">
                    {isDragActive
                      ? appLanguage === "es"
                        ? "Suelta el archivo aqui..."
                        : "Drop the file here..."
                      : appLanguage === "es"
                        ? "Arrastra y suelta tu documento"
                        : "Drag and drop your document"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {appLanguage === "es"
                      ? "o haz clic para seleccionar"
                      : "or click to select"}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">PDF, TXT, DOC, DOCX (Max 10MB)</p>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      {isUploading ? (
                        <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-700">
                        {isUploading
                          ? appLanguage === "es"
                            ? "Subiendo..."
                            : "Uploading..."
                          : appLanguage === "es"
                            ? "Documento subido"
                            : "Document uploaded"}
                      </p>
                      <p className="text-xs text-green-600 truncate max-w-[200px]">
                        {uploadedFile.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {documentUrl && (
                      <button
                        type="button"
                        onClick={() => setShowDocumentPreview(true)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title={appLanguage === "es" ? "Ver documento" : "View document"}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Generate Questions */}
          <div className="bg-card rounded-2xl border border-border/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                {appLanguage === "es" ? "Generar Preguntas" : "Generate Questions"}
              </h2>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                {appLanguage === "es" ? "Numero de preguntas" : "Number of questions"}
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={numQuestions}
                onChange={(e) => setNumQuestions(Math.min(10, Math.max(1, Number(e.target.value))))}
                className="input-modern w-32 text-center"
              />
            </div>

            <button
              type="button"
              onClick={handleGenerateQuestions}
              disabled={!uploadedFile || !selectedInterviewer || isGenerating || isUploading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {appLanguage === "es" ? "Generando..." : "Generating..."}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {appLanguage === "es" ? "Generar Preguntas con IA" : "Generate Questions with AI"}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          {/* Document Preview Card */}
          {documentContent && (
            <div className="bg-card rounded-2xl border border-border/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary rounded-xl">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {appLanguage === "es" ? "Contenido del Documento" : "Document Content"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDocumentPreview(true)}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  {appLanguage === "es" ? "Ver completo" : "View full"}
                </button>
              </div>

              <div className="bg-secondary/30 rounded-xl p-4 max-h-48 overflow-y-auto">
                <p className="text-sm text-foreground whitespace-pre-wrap line-clamp-6">
                  {documentContent.substring(0, 500)}
                  {documentContent.length > 500 && "..."}
                </p>
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                {documentContent.length.toLocaleString()}{" "}
                {appLanguage === "es" ? "caracteres" : "characters"}
              </p>
            </div>
          )}

          {/* Generated Questions */}
          <div className="bg-card rounded-2xl border border-border/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-xl">
                <FileQuestion className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                {appLanguage === "es" ? "Preguntas Generadas" : "Generated Questions"}
              </h2>
              {generatedQuestions.length > 0 && (
                <span className="ml-auto px-2.5 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                  {generatedQuestions.length}
                </span>
              )}
            </div>

            {generatedQuestions.length === 0 ? (
              <div className="text-center py-12 bg-secondary/30 rounded-xl">
                <FileQuestion className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  {appLanguage === "es"
                    ? "Las preguntas apareceran aqui despues de generarlas"
                    : "Questions will appear here after generation"}
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {generatedQuestions.map((q, index) => (
                  <div
                    key={q.id}
                    className="bg-secondary/30 rounded-xl p-4 border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-7 h-7 bg-primary/10 text-primary text-sm font-semibold rounded-lg flex items-center justify-center">
                        {index + 1}
                      </span>
                      <p className="text-foreground">{q.question}</p>
                    </div>
                    {q.category && (
                      <span className="inline-block mt-2 ml-10 px-2 py-0.5 bg-secondary text-muted-foreground text-xs rounded-full">
                        {q.category}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {generatedQuestions.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  const text = generatedQuestions
                    .map((q, i) => `${i + 1}. ${q.question}`)
                    .join("\n");
                  navigator.clipboard.writeText(text);
                  toast.success(
                    appLanguage === "es"
                      ? "Preguntas copiadas al portapapeles"
                      : "Questions copied to clipboard"
                  );
                }}
                className="btn-secondary w-full mt-4 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                {appLanguage === "es" ? "Copiar Preguntas" : "Copy Questions"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      {showDocumentPreview && (
        <Modal open={showDocumentPreview} onClose={() => setShowDocumentPreview(false)}>
          <div className="w-[800px] max-w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {uploadedFile?.name || "Document"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {documentContent.length.toLocaleString()}{" "}
                    {appLanguage === "es" ? "caracteres" : "characters"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDocumentPreview(false)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-secondary/30">
              <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                {documentContent}
              </pre>
            </div>
          </div>
        </Modal>
      )}

      {/* Interviewer Details Modal */}
      <Modal
        open={openInterviewerDetails}
        closeOnOutsideClick={true}
        onClose={() => setOpenInterviewerDetails(false)}
      >
        <InterviewerDetailsModal interviewer={interviewerDetails ?? undefined} />
      </Modal>
    </div>
  );
}

export default InterviewDocumentPage;
