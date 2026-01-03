import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroAnimatedButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function HeroAnimatedButton({ 
  children, 
  href, 
  onClick, 
  className 
}: HeroAnimatedButtonProps) {
  const buttonContent = (
    <motion.div
      className={cn(
        "group relative inline-flex items-center justify-center cursor-pointer px-8 py-4 border border-black rounded-full bg-white hover:bg-black transition-colors duration-300",
        className
      )}
      onClick={onClick}
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
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d"
      }}
    >
      {/* Arrow icon - positioned on the left */}
      <ArrowRight className="w-5 h-5 text-black group-hover:text-white transition-colors duration-300 mr-3" />
      
      {/* Text */}
      <span className="font-medium text-black group-hover:text-white text-lg whitespace-nowrap transition-colors duration-300">
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