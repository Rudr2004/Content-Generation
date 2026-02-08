import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroAnimatedButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  /** Use gradient theme styling (default: true for Bootsolo) */
  variant?: "gradient" | "outline" | "outline-light" | "hero-image" | "hero-image-outline";
}

export function HeroAnimatedButton({ 
  children, 
  href, 
  onClick, 
  className,
  variant = "gradient"
}: HeroAnimatedButtonProps) {
  const isGradient = variant === "gradient";
  const isOutlineLight = variant === "outline-light";
  const isHeroImage = variant === "hero-image";
  const isHeroImageOutline = variant === "hero-image-outline";

  const buttonContent = (
    <motion.div
      className={cn(
        "group relative inline-flex items-center justify-center cursor-pointer px-8 py-4 rounded-full transition-all duration-300",
        isGradient && "text-white shadow-lg hover:shadow-xl",
        variant === "outline" && "border-2 border-gray-900 bg-transparent text-gray-900 hover:bg-gray-900 hover:text-white",
        isOutlineLight && "border-2 border-white bg-transparent text-white hover:bg-white hover:text-gray-900",
        isHeroImage && "shadow-lg hover:shadow-xl backdrop-blur-sm hover:brightness-[0.97]",
        isHeroImageOutline && "border-2 bg-transparent backdrop-blur-sm hero-image-outline-hover",
        className
      )}
      onClick={onClick}
      style={{
        ...(isGradient ? {
          background: "linear-gradient(to right, var(--gradient-start, #3b82f6), var(--gradient-middle, #8b5cf6), var(--gradient-end, #ec4899))",
        } : {}),
        ...(isHeroImage ? {
          backgroundColor: "var(--hero-primary-btn-bg, #ffffff)",
          color: "var(--hero-primary-btn-text, #111827)",
        } : {}),
        ...(isHeroImageOutline ? {
          borderColor: "var(--hero-secondary-btn-border, rgba(255,255,255,0.9))",
          color: "var(--homepage-hero-text, #ffffff)",
        } : {}),
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
      whileHover={{ 
        rotateX: 10,
        rotateY: 5,
        scale: 1.05
      }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      onMouseEnter={isGradient ? (e) => { e.currentTarget.style.filter = "brightness(1.05)"; } : isHeroImage ? (e) => { e.currentTarget.style.filter = "brightness(0.97)"; } : undefined}
      onMouseLeave={isGradient || isHeroImage ? (e) => { e.currentTarget.style.filter = "none"; } : undefined}
    >
      <ArrowRight className={cn(
        "w-5 h-5 mr-3 transition-colors duration-300",
        (isGradient || isHeroImageOutline) && "text-current",
        variant === "outline" && "text-gray-900 group-hover:text-white",
        isOutlineLight && "text-white group-hover:text-gray-900"
      )} />
      
      <span className={cn(
        "font-medium text-lg whitespace-nowrap transition-colors duration-300",
        (isGradient || isHeroImageOutline) && "text-current",
        variant === "outline" && "text-gray-900 group-hover:text-white",
        isOutlineLight && "text-white group-hover:text-gray-900"
      )}>
        {children}
      </span>
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} className="inline-block">
        {buttonContent}
      </a>
    );
  }

  return buttonContent;
}