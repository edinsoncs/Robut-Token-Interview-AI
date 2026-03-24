"use client";

import { useLanguage } from "@/contexts/language.context";
import { ClientService } from "@/services/clients.service";
import { ResponseService } from "@/services/responses.service";
import { useOrganization, useUser } from "@clerk/nextjs";
import {
  Settings,
  Building2,
  Globe,
  CreditCard,
  AlertTriangle,
  Check,
  Loader2,
  Mail,
  Zap,
  ChevronRight,
  Shield,
  Gem,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

interface OrganizationData {
  id: string;
  name: string;
  plan: string;
  allowed_responses_count: number;
  image_url?: string;
}

function SettingsPage() {
  const { t, language, setLanguage } = useLanguage();
  const { organization } = useOrganization();
  const { user } = useUser();
  
  const [orgData, setOrgData] = useState<OrganizationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [responsesUsed, setResponsesUsed] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!organization?.id) return;
      
      setLoading(true);
      try {
        const data = await ClientService.getOrganizationById(organization.id, organization.name);
        if (data) {
          setOrgData(data);
          setOrgName(data.name || organization.name || "");
        }
        
        const totalResponses = await ResponseService.getResponseCountByOrganizationId(organization.id);
        setResponsesUsed(totalResponses);
      } catch (error) {
        console.error("Error fetching organization data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [organization]);

  const handleSaveChanges = async () => {
    if (!organization?.id) return;
    
    setSaving(true);
    try {
      await ClientService.updateOrganization({ name: orgName }, organization.id);
      toast.success(t("settings.changesSaved"));
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error(t("settings.errorSaving"));
    } finally {
      setSaving(false);
    }
  };

  const getPlanBadgeStyles = (plan: string) => {
    switch (plan) {
      case "pro":
        return "bg-primary/10 text-primary border-primary/20";
      case "free":
        return "bg-accent/10 text-accent border-accent/20";
      case "free_trial_over":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case "pro":
        return "Pro";
      case "free":
        return t("upgrade.freePlan");
      case "free_trial_over":
        return t("upgrade.freePlan") + " (Expired)";
      default:
        return plan;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-secondary rounded-lg" />
          <div className="h-4 w-64 bg-secondary/50 rounded" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-secondary/30 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-primary/20">
              <Settings className="w-7 h-7 text-primary" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center border-2 border-background">
              <Zap className="w-2.5 h-2.5 text-accent-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {t("settings.title")}
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {t("settings.subtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="bg-card border border-border/50 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {t("settings.profile")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("settings.profileDescription")}
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="orgName" className="block text-sm font-medium text-foreground mb-2">
                {t("settings.organizationName")}
              </label>
              <input
                id="orgName"
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder={t("settings.organizationNamePlaceholder")}
                className="input-modern max-w-md"
              />
            </div>
            
            {user?.primaryEmailAddress && (
              <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-xl border border-border/30">
                <div className="p-2 bg-muted rounded-lg">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground">{user.primaryEmailAddress.emailAddress}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Preferences Section */}
        <section className="bg-card border border-border/50 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-xl">
                <Globe className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {t("settings.preferences")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("settings.preferencesDescription")}
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("settings.language")}
              </label>
              <p className="text-sm text-muted-foreground mb-3">
                {t("settings.languageDescription")}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setLanguage("es")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                    language === "es"
                      ? "bg-primary/10 border-primary/30 text-foreground"
                      : "bg-secondary/30 border-border/50 text-muted-foreground hover:border-border hover:bg-secondary/50"
                  }`}
                >
                  <span className="text-xl">🇪🇸</span>
                  <span className="font-medium">Espanol</span>
                  {language === "es" && (
                    <Check className="w-4 h-4 text-primary ml-2" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                    language === "en"
                      ? "bg-primary/10 border-primary/30 text-foreground"
                      : "bg-secondary/30 border-border/50 text-muted-foreground hover:border-border hover:bg-secondary/50"
                  }`}
                >
                  <span className="text-xl">🇺🇸</span>
                  <span className="font-medium">English</span>
                  {language === "en" && (
                    <Check className="w-4 h-4 text-primary ml-2" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Billing Section */}
        <section className="bg-card border border-border/50 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-xl">
                <CreditCard className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {t("settings.billing")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("settings.billingDescription")}
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {/* Current Plan */}
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border/30">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Gem className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("settings.currentPlan")}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`badge ${getPlanBadgeStyles(orgData?.plan || "free")}`}>
                      {getPlanDisplayName(orgData?.plan || "free")}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>

            {/* Responses Used */}
            <div className="p-4 bg-secondary/30 rounded-xl border border-border/30">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-foreground">{t("settings.responsesUsed")}</p>
                <p className="text-sm text-muted-foreground">
                  {responsesUsed} {t("settings.of")}{" "}
                  {orgData?.plan === "pro" ? t("settings.unlimited") : orgData?.allowed_responses_count || 10}
                </p>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{
                    width: orgData?.plan === "pro"
                      ? "25%"
                      : `${Math.min((responsesUsed / (orgData?.allowed_responses_count || 10)) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Upgrade Button */}
            {orgData?.plan !== "pro" && (
              <a
                href="mailto:support@robut.ai?subject=Upgrade to Pro Plan"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-primary-foreground rounded-xl font-medium transition-all hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                <Zap className="w-4 h-4" />
                {t("settings.upgradePlan")}
              </a>
            )}
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-card border border-destructive/30 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-destructive/20 bg-destructive/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {t("settings.dangerZone")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("settings.dangerZoneDescription")}
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-xl bg-destructive/5">
              <div>
                <p className="font-medium text-foreground">{t("settings.deleteOrganization")}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("settings.deleteOrganizationWarning")}
                </p>
              </div>
              <button
                type="button"
                disabled
                className="px-4 py-2 bg-destructive/10 text-destructive border border-destructive/30 rounded-xl text-sm font-medium opacity-50 cursor-not-allowed"
              >
                {t("general.delete")}
              </button>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("settings.saving")}
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                {t("settings.saveChanges")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
