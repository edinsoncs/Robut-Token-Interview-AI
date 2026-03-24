import { Bot } from "lucide-react";
import styles from "./loader.module.css";

function LoaderWithLogo() {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 flex flex-col items-center">
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30">
          <Bot className="w-10 h-10 text-primary-foreground" />
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-lg animate-pulse" />
      </div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xl font-bold text-foreground tracking-tight">ROBUT</span>
      </div>
      <div className="flex flex-row items-center mx-auto">
        <div className={styles.loader} />
      </div>
    </div>
  );
}

export default LoaderWithLogo;
