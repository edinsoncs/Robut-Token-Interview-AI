"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Language = "en" | "es";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    "nav.interviews": "Interviews",
    "nav.interviewers": "Interviewers",
    "nav.interviewDocument": "Interview with Document",
    "nav.settings": "Settings",
    
    // Dashboard
    "dashboard.myInterviews": "My Interviews",
    "dashboard.startGettingResponses": "Start getting responses now!",
    "dashboard.createInterview": "Create Interview",
    "dashboard.noInterviews": "No interviews yet",
    "dashboard.responses": "Responses",
    "dashboard.cannotCreate": "You cannot create any more interviews unless you upgrade",
    
    // Interviewers
    "interviewers.title": "Interviewers",
    "interviewers.subtitle": "Get to know them by clicking the profile.",
    "interviewers.create": "Create Interviewer",
    "interviewers.createDefault": "Create two Default Interviewers",
    "interviewers.aiInterviewer": "AI Interviewer",
    "interviewers.voicePreview": "Voice Preview",
    "interviewers.settings": "Interviewer Settings",
    "interviewers.empathy": "Empathy",
    "interviewers.rapport": "Rapport",
    "interviewers.exploration": "Exploration",
    "interviewers.speed": "Speed",
    "interviewers.noImage": "No image",
    "interviewers.totalInterviewers": "Total Interviewers",
    "interviewers.manageTeam": "Manage your AI interviewer team",
    "interviewers.emptyState": "No interviewers yet",
    "interviewers.emptyDescription": "Create your first AI interviewer to start conducting interviews automatically.",
    "interviewers.getStarted": "Get Started",
    "interviewers.deleteInterviewer": "Delete Interviewer",
    "interviewers.confirmDelete": "Are you sure you want to delete this interviewer? This action cannot be undone.",
    "interviewers.deleteTitle": "Delete this interviewer?",
    "interviewers.createNew": "New Interviewer",
    "interviewers.clickToStart": "Click to create",
    "interviewers.createNewTitle": "Create AI Interviewers",
    "interviewers.selectLanguageDesc": "Choose the language for your new AI interviewers",
    "interviewers.selectLanguage": "Select Language",
    "interviewers.willCreate": "This will create",
    "interviewers.aiInterviewers": "AI interviewers",
    "interviewers.inLanguage": "in",
    "interviewers.creating": "Creating...",
    "interviewers.createInterviewers": "Create Interviewers",
    
    // Interview Card
    "interview.linkCopied": "The link to your interview has been copied to your clipboard.",
    "interview.preview": "Preview",
    "interview.share": "Share",
    "interview.edit": "Edit",
    "interview.themeColor": "Theme Color",
    "interview.active": "Active",
    "interview.inactive": "Inactive",
    "interview.statusUpdated": "Interview status updated",
    "interview.statusDescription": "The interview is now",
    "interview.themeUpdated": "Theme color updated",
    "interview.errorUpdate": "Failed to update the interview status.",
    
    // Create Interview Modal
    "createInterview.title": "Create an Interview",
    "createInterview.name": "Interview Name",
    "createInterview.namePlaceholder": "e.g. Name of the Interview",
    "createInterview.selectInterviewer": "Select an Interviewer",
    "createInterview.objective": "Objective",
    "createInterview.objectivePlaceholder": "e.g. Find best candidates based on their technical skills and previous projects.",
    "createInterview.uploadDocs": "Upload any documents related to the interview.",
    "createInterview.enterManually": "Enter your questions manually.",
    "createInterview.upload": "Upload",
    "createInterview.manual": "Manual",
    "createInterview.anonymous": "Do you prefer the interviewees' responses to be anonymous?",
    "createInterview.anonymousNote": "Note: If not anonymous, the interviewee's email and name will be collected.",
    "createInterview.numQuestions": "Number of Questions",
    "createInterview.duration": "Duration (mins)",
    "createInterview.generateQuestions": "Generate Questions",
    "createInterview.doItMyself": "I'll do it myself",
    "createInterview.proceedWithQuestions": "Proceed with Questions",
    "createInterview.setNumQuestions": "Set the number of questions above to add inputs.",
    
    // Questions Popup
    "questions.title": "Create Interview",
    "questions.reviewQuestions": "We will be using these questions during the interviews. Please make sure they are ok.",
    "questions.description": "Interview Description",
    "questions.descriptionNote": "Note: Interviewees will see this description.",
    "questions.descriptionPlaceholder": "Enter your interview description.",
    "questions.save": "Save",
    "questions.followUps": "Follow-ups",
    
    // Upgrade Modal
    "upgrade.title": "Upgrade to Pro",
    "upgrade.message": "You have reached your limit for the free trial. Please upgrade to pro to continue using our features.",
    "upgrade.freePlan": "Free Plan",
    "upgrade.proPlan": "Pro Plan",
    "upgrade.freeResponses": "10 Responses",
    "upgrade.freeSupport": "Basic Support",
    "upgrade.freeFeatures": "Limited Features",
    "upgrade.proResponses": "Flexible Pay-Per-Response",
    "upgrade.proSupport": "Priority Support",
    "upgrade.proFeatures": "All Features",
    "upgrade.contact": "Contact",
    "upgrade.toUpgrade": "to upgrade your plan.",
    
    // Responses
    "responses.noResponses": "No responses to display",
    "responses.anonymous": "Anonymous",
    "responses.response": "Response",
    "responses.filterBy": "Filter By",
    "responses.noStatus": "No Status",
    "responses.notSelected": "Not Selected",
    "responses.potential": "Potential",
    "responses.selected": "Selected",
    "responses.all": "All",
    "responses.overallScore": "Overall Score",
    
    // Summary
    "summary.interviewSummary": "Interview Summary",
    "summary.noResponses": "No responses have been submitted yet.",
    "summary.waitingResponses": "Waiting for responses...",
    "summary.shareLink": "Share your interview link to start collecting responses.",
    
    // General
    "general.loading": "Loading...",
    "general.error": "Error",
    "general.success": "Success",
    "general.cancel": "Cancel",
    "general.confirm": "Confirm",
    "general.delete": "Delete",
    "general.close": "Close",
    "general.back": "Back",
    "general.next": "Next",
    "general.save": "Save",
    "general.create": "Create",
    
    // Settings
    "settings.title": "Settings",
    "settings.subtitle": "Manage your account and organization settings",
    "settings.profile": "Profile",
    "settings.profileDescription": "Manage your organization profile",
    "settings.organizationName": "Organization Name",
    "settings.organizationNamePlaceholder": "Enter organization name",
    "settings.preferences": "Preferences",
    "settings.preferencesDescription": "Customize your experience",
    "settings.language": "Language",
    "settings.languageDescription": "Select your preferred language",
    "settings.billing": "Billing & Plan",
    "settings.billingDescription": "Manage your subscription and billing",
    "settings.currentPlan": "Current Plan",
    "settings.responsesUsed": "Responses Used",
    "settings.of": "of",
    "settings.unlimited": "Unlimited",
    "settings.upgradePlan": "Upgrade Plan",
    "settings.contactSupport": "Contact Support",
    "settings.dangerZone": "Danger Zone",
    "settings.dangerZoneDescription": "Irreversible and destructive actions",
    "settings.deleteOrganization": "Delete Organization",
    "settings.deleteOrganizationWarning": "Once you delete an organization, there is no going back. Please be certain.",
    "settings.saveChanges": "Save Changes",
    "settings.saving": "Saving...",
    "settings.changesSaved": "Changes saved successfully",
    "settings.errorSaving": "Error saving changes",
  },
  es: {
    // Navigation
    "nav.interviews": "Entrevistas",
    "nav.interviewers": "Entrevistadores",
    "nav.interviewDocument": "Entrevista con Documento",
    "nav.settings": "Configuracion",
    
    // Dashboard
    "dashboard.myInterviews": "Mis Entrevistas",
    "dashboard.startGettingResponses": "Comienza a recibir respuestas ahora!",
    "dashboard.createInterview": "Crear Entrevista",
    "dashboard.noInterviews": "Aun no hay entrevistas",
    "dashboard.responses": "Respuestas",
    "dashboard.cannotCreate": "No puedes crear mas entrevistas a menos que actualices tu plan",
    
    // Interviewers
    "interviewers.title": "Entrevistadores",
    "interviewers.subtitle": "Conocelos haciendo clic en su perfil.",
    "interviewers.create": "Crear Entrevistador",
    "interviewers.createDefault": "Crear dos Entrevistadores por Defecto",
    "interviewers.aiInterviewer": "Entrevistador IA",
    "interviewers.voicePreview": "Vista Previa de Voz",
    "interviewers.settings": "Configuracion del Entrevistador",
    "interviewers.empathy": "Empatia",
    "interviewers.rapport": "Conexion",
    "interviewers.exploration": "Exploracion",
    "interviewers.speed": "Velocidad",
    "interviewers.noImage": "Sin imagen",
    "interviewers.totalInterviewers": "Total de Entrevistadores",
    "interviewers.manageTeam": "Administra tu equipo de entrevistadores IA",
    "interviewers.emptyState": "Aun no hay entrevistadores",
    "interviewers.emptyDescription": "Crea tu primer entrevistador IA para comenzar a realizar entrevistas automaticamente.",
    "interviewers.getStarted": "Comenzar",
    "interviewers.deleteInterviewer": "Eliminar Entrevistador",
    "interviewers.confirmDelete": "Estas seguro de que deseas eliminar este entrevistador? Esta accion no se puede deshacer.",
    "interviewers.deleteTitle": "Eliminar este entrevistador?",
    "interviewers.createNew": "Nuevo Entrevistador",
    "interviewers.clickToStart": "Clic para crear",
    "interviewers.createNewTitle": "Crear Entrevistadores IA",
    "interviewers.selectLanguageDesc": "Elige el idioma para tus nuevos entrevistadores IA",
    "interviewers.selectLanguage": "Seleccionar Idioma",
    "interviewers.willCreate": "Esto creara",
    "interviewers.aiInterviewers": "entrevistadores IA",
    "interviewers.inLanguage": "en",
    "interviewers.creating": "Creando...",
    "interviewers.createInterviewers": "Crear Entrevistadores",
    
    // Interview Card
    "interview.linkCopied": "El enlace de tu entrevista ha sido copiado al portapapeles.",
    "interview.preview": "Vista previa",
    "interview.share": "Compartir",
    "interview.edit": "Editar",
    "interview.themeColor": "Color del tema",
    "interview.active": "Activo",
    "interview.inactive": "Inactivo",
    "interview.statusUpdated": "Estado de la entrevista actualizado",
    "interview.statusDescription": "La entrevista ahora esta",
    "interview.themeUpdated": "Color del tema actualizado",
    "interview.errorUpdate": "Error al actualizar el estado de la entrevista.",
    
    // Create Interview Modal
    "createInterview.title": "Crear una Entrevista",
    "createInterview.name": "Nombre de la Entrevista",
    "createInterview.namePlaceholder": "ej. Nombre de la Entrevista",
    "createInterview.selectInterviewer": "Selecciona un Entrevistador",
    "createInterview.objective": "Objetivo",
    "createInterview.objectivePlaceholder": "ej. Encontrar los mejores candidatos basandose en sus habilidades tecnicas y proyectos anteriores.",
    "createInterview.uploadDocs": "Sube cualquier documento relacionado con la entrevista.",
    "createInterview.enterManually": "Ingresa tus preguntas manualmente.",
    "createInterview.upload": "Subir",
    "createInterview.manual": "Manual",
    "createInterview.anonymous": "Prefieres que las respuestas de los entrevistados sean anonimas?",
    "createInterview.anonymousNote": "Nota: Si no es anonimo, se recopilara el correo electronico y nombre del entrevistado.",
    "createInterview.numQuestions": "Numero de Preguntas",
    "createInterview.duration": "Duracion (mins)",
    "createInterview.generateQuestions": "Generar Preguntas",
    "createInterview.doItMyself": "Lo hare yo mismo",
    "createInterview.proceedWithQuestions": "Continuar con Preguntas",
    "createInterview.setNumQuestions": "Establece el numero de preguntas arriba para agregar campos.",
    
    // Questions Popup
    "questions.title": "Crear Entrevista",
    "questions.reviewQuestions": "Usaremos estas preguntas durante las entrevistas. Por favor asegurate de que estan bien.",
    "questions.description": "Descripcion de la Entrevista",
    "questions.descriptionNote": "Nota: Los entrevistados veran esta descripcion.",
    "questions.descriptionPlaceholder": "Ingresa la descripcion de tu entrevista.",
    "questions.save": "Guardar",
    "questions.followUps": "Seguimientos",
    
    // Upgrade Modal
    "upgrade.title": "Actualizar a Pro",
    "upgrade.message": "Has alcanzado el limite de la prueba gratuita. Por favor actualiza a pro para continuar usando nuestras funciones.",
    "upgrade.freePlan": "Plan Gratuito",
    "upgrade.proPlan": "Plan Pro",
    "upgrade.freeResponses": "10 Respuestas",
    "upgrade.freeSupport": "Soporte Basico",
    "upgrade.freeFeatures": "Funciones Limitadas",
    "upgrade.proResponses": "Pago Flexible por Respuesta",
    "upgrade.proSupport": "Soporte Prioritario",
    "upgrade.proFeatures": "Todas las Funciones",
    "upgrade.contact": "Contacta",
    "upgrade.toUpgrade": "para actualizar tu plan.",
    
    // Responses
    "responses.noResponses": "No hay respuestas para mostrar",
    "responses.anonymous": "Anonimo",
    "responses.response": "Respuesta",
    "responses.filterBy": "Filtrar Por",
    "responses.noStatus": "Sin Estado",
    "responses.notSelected": "No Seleccionado",
    "responses.potential": "Potencial",
    "responses.selected": "Seleccionado",
    "responses.all": "Todos",
    "responses.overallScore": "Puntuacion General",
    
    // Summary
    "summary.interviewSummary": "Resumen de la Entrevista",
    "summary.noResponses": "Aun no se han enviado respuestas.",
    "summary.waitingResponses": "Esperando respuestas...",
    "summary.shareLink": "Comparte el enlace de tu entrevista para comenzar a recopilar respuestas.",
    
    // General
    "general.loading": "Cargando...",
    "general.error": "Error",
    "general.success": "Exito",
    "general.cancel": "Cancelar",
    "general.confirm": "Confirmar",
    "general.delete": "Eliminar",
    "general.close": "Cerrar",
    "general.back": "Atras",
    "general.next": "Siguiente",
    "general.save": "Guardar",
    "general.create": "Crear",
    
    // Settings
    "settings.title": "Configuracion",
    "settings.subtitle": "Administra tu cuenta y configuracion de organizacion",
    "settings.profile": "Perfil",
    "settings.profileDescription": "Administra el perfil de tu organizacion",
    "settings.organizationName": "Nombre de la Organizacion",
    "settings.organizationNamePlaceholder": "Ingresa el nombre de la organizacion",
    "settings.preferences": "Preferencias",
    "settings.preferencesDescription": "Personaliza tu experiencia",
    "settings.language": "Idioma",
    "settings.languageDescription": "Selecciona tu idioma preferido",
    "settings.billing": "Facturacion y Plan",
    "settings.billingDescription": "Administra tu suscripcion y facturacion",
    "settings.currentPlan": "Plan Actual",
    "settings.responsesUsed": "Respuestas Usadas",
    "settings.of": "de",
    "settings.unlimited": "Ilimitado",
    "settings.upgradePlan": "Actualizar Plan",
    "settings.contactSupport": "Contactar Soporte",
    "settings.dangerZone": "Zona de Peligro",
    "settings.dangerZoneDescription": "Acciones irreversibles y destructivas",
    "settings.deleteOrganization": "Eliminar Organizacion",
    "settings.deleteOrganizationWarning": "Una vez que elimines la organizacion, no hay vuelta atras. Por favor, ten cuidado.",
    "settings.saveChanges": "Guardar Cambios",
    "settings.saving": "Guardando...",
    "settings.changesSaved": "Cambios guardados exitosamente",
    "settings.errorSaving": "Error al guardar cambios",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es")) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
