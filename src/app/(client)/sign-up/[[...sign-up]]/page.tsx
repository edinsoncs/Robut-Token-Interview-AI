import { SignUp } from "@clerk/nextjs";
import { Bot, Sparkles, Zap, Shield, Users } from "lucide-react";

function SignUpPage() {
  return (
    <div className="flex min-h-screen w-full bg-background absolute top-0 left-0 z-50">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-background via-secondary to-background p-12 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-accent/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/15 rounded-full blur-[100px]" />
        
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
              Start Building
              <br />
              <span className="text-accent">Smarter</span>
              <br />
              Interviews.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-md leading-relaxed">
              Join thousands of teams using AI to revolutionize their interview process.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-8">
            <div>
              <p className="text-3xl font-bold text-foreground">10k+</p>
              <p className="text-sm text-muted-foreground">Interviews Conducted</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">98%</p>
              <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">50%</p>
              <p className="text-sm text-muted-foreground">Time Saved</p>
            </div>
          </div>

          {/* Testimonial */}
          <div className="p-6 rounded-2xl bg-card/50 border border-border/50 max-w-lg">
            <p className="text-foreground italic leading-relaxed">
              {'"'}ROBUT transformed how we conduct interviews. The AI insights are incredible.{'"'}
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">HR Team Lead</p>
                <p className="text-xs text-muted-foreground">Enterprise Customer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-sm text-muted-foreground">
            No credit card required to get started
          </p>
        </div>
      </div>

      {/* Right Panel - Sign Up Form */}
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
            <p className="text-muted-foreground">Create your account</p>
          </div>
          <SignUp 
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
            Join <span className="text-primary">ROBUT</span>
          </h1>
          <div className="mt-6 p-6 rounded-2xl bg-card border border-border">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-3xl">{">"}</span>
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Desktop Required
            </h2>
            <p className="text-muted-foreground">
              For the best experience, please sign up using a desktop browser. Mobile support coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SignUpPage;
