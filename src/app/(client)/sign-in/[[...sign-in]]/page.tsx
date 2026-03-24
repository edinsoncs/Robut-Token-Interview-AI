import { SignIn } from "@clerk/nextjs";
import { Bot, Sparkles, Zap, Shield } from "lucide-react";

function SignInPage() {
  return (
    <div className="flex min-h-screen w-full bg-background absolute top-0 left-0 z-50">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-background via-secondary to-background p-12 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />
        
        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
              <Bot className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground tracking-tight">ROBUT</span>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-5xl font-bold text-foreground leading-tight tracking-tight text-balance">
              AI-Powered
              <br />
              <span className="text-primary">Interviews</span>
              <br />
              That Work.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-md leading-relaxed">
              Automate your interview process with intelligent AI interviewers. Save time, get better insights.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 max-w-lg">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border/50">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Lightning Fast</p>
                <p className="text-xs text-muted-foreground">Real-time responses</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border/50">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">AI Insights</p>
                <p className="text-xs text-muted-foreground">Smart analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border/50">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Secure</p>
                <p className="text-xs text-muted-foreground">Enterprise grade</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border/50">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Bot className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Custom Bots</p>
                <p className="text-xs text-muted-foreground">Your AI team</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-sm text-muted-foreground">
            Trusted by innovative teams worldwide
          </p>
        </div>
      </div>

      {/* Right Panel - Sign In Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        {/* Desktop */}
        <div className="hidden md:block w-full max-w-md">
          <div className="lg:hidden mb-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                <Bot className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground tracking-tight">ROBUT</span>
            </div>
            <p className="text-muted-foreground">AI-Powered Interviews</p>
          </div>
          <SignIn 
            forceRedirectUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-card border border-border shadow-2xl rounded-2xl",
                headerTitle: "text-foreground",
                headerSubtitle: "text-muted-foreground",
                formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 font-medium",
                formFieldInput: "bg-secondary border-border text-foreground rounded-xl focus:ring-primary",
                formFieldLabel: "text-foreground",
                footerActionLink: "text-primary hover:text-primary/80",
                identityPreviewText: "text-foreground",
                identityPreviewEditButton: "text-primary",
              },
            }}
          />
        </div>

        {/* Mobile */}
        <div className="block md:hidden px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
              <Bot className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to <span className="text-primary">ROBUT</span>
          </h1>
          <div className="mt-6 p-6 rounded-2xl bg-card border border-border">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-3xl">{">"}</span>
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Desktop Required
            </h2>
            <p className="text-muted-foreground">
              For the best experience, please sign in using a desktop browser. Mobile support coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SignInPage;
