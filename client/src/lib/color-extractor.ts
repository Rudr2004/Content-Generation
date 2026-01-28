// Color extraction utility - extracts all current color codes used across the website

export interface ExtractedColors {
  general: {
    header: {
      backgroundColor: string;
      textColor: string;
      borderColor: string;
      shadowColor?: string;
    };
    footer: {
      backgroundColor: string;
      textColor: string;
      borderColor: string;
      linkColor?: string;
      hoverColor?: string;
    };
    navbar: {
      backgroundColor: string;
      textColor: string;
      activeColor: string;
      hoverColor: string;
      borderColor?: string;
    };
  };
  buttons: {
    primary: {
      backgroundColor: string;
      textColor: string;
      hoverColor: string;
    };
    secondary: {
      backgroundColor: string;
      textColor: string;
      hoverColor: string;
    };
    gradient: {
      start: string;
      middle: string;
      end: string;
    };
  };
  pages: {
    homepage: {
      heroBg: string;
      heroGradient: { start: string; middle: string; end: string };
      heroGradientOverlay: { start: string; middle: string; end: string };
      sectionBg?: string;
      textColor?: string;
    };
    blog: {
      cardBg: string;
      textColor: string;
      linkColor: string;
      borderColor: string;
    };
    service: {
      cardBg: string;
      gradientStart: string;
      gradientMiddle: string;
      gradientEnd: string;
      textColor: string;
    };
    industry: {
      primaryBg: string;
      accentBg: string;
      buttonBg: string;
      textColor: string;
    };
    caseStudy: {
      heroBg: string;
      heroGradientStart: string;
      heroGradientMiddle: string;
      heroGradientEnd: string;
      cardBg: string;
      textColor: string;
      borderColor: string;
    };
    hireDeveloper: {
      heroBg: string;
      cardBg: string;
      buttonBg: string;
      textColor: string;
    };
  };
  forms: {
    inputBg: string;
    inputBorder: string;
    inputText: string;
    inputPlaceholder?: string;
    labelText: string;
    errorText: string;
  };
}

// Extract current colors from the codebase
export const currentColors: ExtractedColors = {
  general: {
    header: {
      backgroundColor: "#ffffff", // bg-white
      textColor: "#1a1a1a", // text-gray-900
      borderColor: "#e5e7eb", // border-gray-200
      shadowColor: "rgba(0, 0, 0, 0.1)",
    },
    footer: {
      backgroundColor: "#ffffff", // bg-white
      textColor: "#4b5563", // text-gray-600
      borderColor: "#e5e7eb", // border-gray-200
      linkColor: "#4b5563", // text-gray-600
      hoverColor: "#111827", // hover:text-gray-900
    },
    navbar: {
      backgroundColor: "#ffffff", // bg-white
      textColor: "#4b5563", // text-gray-600
      activeColor: "#22c55e", // green-apple
      hoverColor: "#f3f4f6", // hover:bg-gray-50
      borderColor: "#f3f4f6", // border-gray-100
    },
  },
  buttons: {
    primary: {
      backgroundColor: "#22c55e", // green-apple
      textColor: "#ffffff",
      hoverColor: "#16a34a", // hover:bg-green-600
    },
    secondary: {
      backgroundColor: "#f3f4f6", // bg-gray-100
      textColor: "#1a1a1a", // text-gray-900
      hoverColor: "#e5e7eb", // hover:bg-gray-200
    },
    gradient: {
      start: "#3b82f6", // blue-500
      middle: "#8b5cf6", // purple-500
      end: "#ec4899", // pink-500
    },
  },
  pages: {
    homepage: {
      heroGradient: {
        start: "#3b82f6", // blue-500
        middle: "#8b5cf6", // purple-500
        end: "#ec4899", // pink-500
      },
      sectionBg: "#ffffff",
      textColor: "#1a1a1a",
      heroBg: "#ffffff", // Hero section background color
      heroGradientOverlay: {
        start: "rgba(59, 130, 246, 0.3)", // Light blue overlay start
        middle: "rgba(255, 255, 255, 1)", // White middle
        end: "rgba(34, 197, 94, 0.2)", // Light green overlay end
      },
    },
    blog: {
      cardBg: "#ffffff",
      textColor: "#374151", // text-gray-700
      linkColor: "#2563eb", // text-blue-600
      borderColor: "#e5e7eb", // border-gray-200
    },
    service: {
      cardBg: "#ffffff",
      gradientStart: "#3b82f6", // blue-500
      gradientMiddle: "#8b5cf6", // purple-500
      gradientEnd: "#ec4899", // pink-500
      textColor: "#1a1a1a",
    },
    industry: {
      primaryBg: "#eff6ff", // from-blue-50
      accentBg: "#eef2ff", // to-indigo-100
      buttonBg: "#2563eb", // bg-blue-600
      textColor: "#1a1a1a",
    },
    caseStudy: {
      heroBg: "#1e3a8a", // blue-900 (primary hero background)
      heroGradientStart: "#1e3a8a", // blue-900
      heroGradientMiddle: "#581c87", // purple-900
      heroGradientEnd: "#312e81", // indigo-900
      cardBg: "#ffffff",
      textColor: "#1a1a1a",
      borderColor: "#e5e7eb",
    },
    hireDeveloper: {
      heroBg: "#eff6ff", // from-blue-50
      cardBg: "#ffffff",
      buttonBg: "#2563eb", // bg-blue-600
      textColor: "#1a1a1a",
    },
  },
  forms: {
    inputBg: "#ffffff",
    inputBorder: "#d1d5db", // border-gray-300
    inputText: "#1a1a1a",
    inputPlaceholder: "#6b7280", // text-gray-500
    labelText: "#374151", // text-gray-700
    errorText: "#dc2626", // text-red-600
  },
};

// Convert Tailwind color classes to hex codes
export const tailwindToHex: Record<string, string> = {
  "white": "#ffffff",
  "gray-50": "#f9fafb",
  "gray-100": "#f3f4f6",
  "gray-200": "#e5e7eb",
  "gray-300": "#d1d5db",
  "gray-400": "#9ca3af",
  "gray-500": "#6b7280",
  "gray-600": "#4b5563",
  "gray-700": "#374151",
  "gray-800": "#1f2937",
  "gray-900": "#111827",
  "blue-50": "#eff6ff",
  "blue-100": "#dbeafe",
  "blue-400": "#60a5fa",
  "blue-500": "#3b82f6",
  "blue-600": "#2563eb",
  "blue-700": "#1d4ed8",
  "purple-500": "#8b5cf6",
  "purple-600": "#7c3aed",
  "pink-500": "#ec4899",
  "pink-600": "#db2777",
  "green-500": "#22c55e",
  "green-600": "#16a34a",
  "teal-600": "#0d9488",
  "red-600": "#dc2626",
};
