"use client";

import Modal from "@/components/dashboard/Modal";
import { useLanguage } from "@/contexts/language.context";
import { Copy, CopyCheck, Link2, Code2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

interface SharePopupProps {
  open: boolean;
  onClose: () => void;
  shareContent: string;
}

function SharePopup({ open, onClose, shareContent }: SharePopupProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [url, setUrl] = useState<string>("Loading...");
  const [embedCode, setEmbedCode] = useState<string>("Loading...");
  const [activeTab, setActiveTab] = useState<"url" | "embed">("url");
  const { t } = useLanguage();

  const [embedWidth, setEmbedWidth] = useState(1350);
  const [embedHeight, setEmbedHeight] = useState(735);

  useEffect(() => {
    const interviewURL = shareContent;
    if (interviewURL) {
      setUrl(interviewURL);
      setEmbedCode(
        `<iframe src="${interviewURL}" width="${embedWidth}" height="${embedHeight}"></iframe>`,
      );
    }
  }, [shareContent, embedWidth, embedHeight]);

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(url).then(
      () => {
        setCopiedLink(true);
        toast.success(t("interview.linkCopied"), {
          position: "bottom-right",
          duration: 3000,
        });

        setTimeout(() => setCopiedLink(false), 2000);
        setTimeout(() => onClose(), 1000);
      },

      (err) => console.error("Failed to copy", err.message),
    );
  };

  const copyEmbedToClipboard = () => {
    navigator.clipboard.writeText(embedCode).then(
      () => {
        setCopiedEmbed(true);
        toast.success("The embed HTML code for your interview has been copied to your clipboard.", {
          position: "bottom-right",
          duration: 3000,
        });

        setTimeout(() => setCopiedEmbed(false), 2000);
        setTimeout(() => onClose(), 1000);
      },
      (err) => console.error("Failed to copy", err.message),
    );
  };

  if (!open) {
    return null;
  }

  return (
    <Modal open={open} closeOnOutsideClick={false} onClose={onClose}>
      <div className="w-[28rem]">
        <h2 className="text-xl font-bold text-foreground mb-6">{t("interview.share")}</h2>

        {/* Tab Switcher */}
        <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === "url"
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Link2 className="w-4 h-4" />
            URL
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("embed")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === "embed"
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Code2 className="w-4 h-4" />
            Embed
          </button>
        </div>

        {/* URL Tab */}
        {activeTab === "url" && (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={url}
                className="input-modern pr-12"
                readOnly
              />
              <button
                type="button"
                onClick={copyLinkToClipboard}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                {copiedLink ? (
                  <CopyCheck className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
            <button
              type="button"
              onClick={copyLinkToClipboard}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {copiedLink ? (
                <>
                  <CopyCheck className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy URL
                </>
              )}
            </button>
          </div>
        )}

        {/* Embed Tab */}
        {activeTab === "embed" && (
          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={embedCode}
                className="input-modern text-xs font-mono"
                readOnly
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="width" className="block text-sm font-medium text-foreground mb-1.5">
                  Width (px)
                </label>
                <input
                  id="width"
                  type="number"
                  min="1050"
                  value={embedWidth}
                  className="input-modern"
                  onChange={(e) => setEmbedWidth(Number(e.target.value))}
                  onBlur={(e) => {
                    const value = Math.max(1050, Number(e.target.value));
                    setEmbedWidth(value);
                  }}
                />
              </div>
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-foreground mb-1.5">
                  Height (px)
                </label>
                <input
                  id="height"
                  type="number"
                  min="700"
                  value={embedHeight}
                  className="input-modern"
                  onChange={(e) => setEmbedHeight(Number(e.target.value))}
                  onBlur={(e) => {
                    const value = Math.max(700, Number(e.target.value));
                    setEmbedHeight(value);
                  }}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={copyEmbedToClipboard}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {copiedEmbed ? (
                <>
                  <CopyCheck className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Embed Code
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default SharePopup;
