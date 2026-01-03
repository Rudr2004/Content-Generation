import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "large";
  className?: string;
}

export function AnimatedButton({ 
  children, 
  href, 
  onClick, 
  variant = "default",
  className 
}: AnimatedButtonProps) {
  const buttonContent = (
    <div
      className={cn(
        "group relative inline-flex items-center cursor-pointer py-2",
        variant === "large" ? "text-lg" : "text-base",
        className
      )}
      onClick={onClick}
    >
      {/* Expanding border background */}
      <motion.div
        className="absolute border border-black bg-white"
        style={{
          borderRadius: "50px"
        }}
        animate={{
          width: "2.25rem",
          height: "2.25rem",
          left: "-0.125rem",
          top: "50%",
          y: "-50%"
        }}
        whileHover={{
          width: "calc(100% + 0.5rem)",
          height: "2.75rem",
          left: "-0.25rem",
          top: "50%",
          y: "-50%"
        }}
        transition={{ 
          duration: 0.3, 
          ease: "easeOut"
        }}
      />
      
      {/* Arrow icon - slightly protruding from circle */}
      <div className="relative z-10 w-8 h-8 flex items-center justify-center">
        <motion.div
          whileHover={{ x: 2 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowRight className="w-4 h-4 text-black" />
        </motion.div>
      </div>
      
      {/* Text - positioned to the right with spacing */}
      <span className="relative z-10 font-medium text-black ml-3 whitespace-nowrap">
        {children}
      </span>
    </div>
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