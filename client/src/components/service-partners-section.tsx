import React from "react";
import { motion } from "framer-motion";
import zebpayLogo from "@assets/1_1753792402610.png";
import borrowlandLogo from "@assets/2_1753792402610.png";
import mercedesBenzLogo from "@assets/3_1753792402610.png";
import spheriumLogo from "@assets/4_1753792402611.jpg";
import goldmanSachsLogo from "@assets/6_1753792706464.jpg";
import goldmanSachsAltLogo from "@assets/6_1753792402611.jpg";
import alacrityLogo from "@assets/7_1753792402611.png";
import mightyJaxxLogo from "@assets/8_1753792402611.png";
import docTraceLogo from "@assets/9_1753792402611.png";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { COMPANY_INFO } from "@/lib/constants";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export function ServicePartnersSection() {
  const { settings } = useSiteSettings();
  const siteName = settings?.siteName || COMPANY_INFO.name;
  const partners = [
    {
      name: "ZebPay",
      logo: <img src={zebpayLogo} alt="ZebPay" className="h-6 sm:h-8 md:h-10 w-auto object-contain" />,
    },
    {
      name: "Borrowland",
      logo: <img src={borrowlandLogo} alt="Borrowland" className="h-6 sm:h-8 md:h-10 w-auto object-contain" />,
    },
    {
      name: "Mercedes-Benz",
      logo: <img src={mercedesBenzLogo} alt="Mercedes-Benz" className="h-6 sm:h-8 md:h-10 w-auto object-contain" />,
    },
    {
      name: "Spherium",
      logo: <img src={spheriumLogo} alt="Spherium" className="h-6 sm:h-8 md:h-10 w-auto object-contain" />,
    },
    {
      name: "Goldman Sachs",
      logo: <img src={goldmanSachsLogo} alt="Goldman Sachs" className="h-6 sm:h-8 md:h-10 w-auto object-contain" />,
    },
    {
      name: "Alacrity",
      logo: <img src={alacrityLogo} alt="Alacrity" className="h-6 sm:h-8 md:h-10 w-auto object-contain" />,
    },
    {
      name: "Mighty Jaxx",
      logo: <img src={mightyJaxxLogo} alt="Mighty Jaxx" className="h-6 sm:h-8 md:h-10 w-auto object-contain" />,
    },
    {
      name: "Doc Trace",
      logo: <img src={docTraceLogo} alt="Doc Trace" className="h-6 sm:h-8 md:h-10 w-auto object-contain" />,
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 heading-georgia">
              Trusted by Global Brands
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto text-poppins">
              Join leading companies that trust {siteName} for their digital transformation journey.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="relative overflow-hidden">
            <div className="flex animate-scroll-left space-x-8 sm:space-x-12 hover:pause-scroll">
              {partners.concat(partners).map((partner, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center flex-shrink-0 w-44 sm:w-52 md:w-60 lg:w-64 h-20 px-4"
                >
                  <div className="opacity-70 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center w-full h-full">
                    <span className="sr-only">{partner.name}</span>
                    {partner.logo}
                  </div>
                </div>
              ))}
            </div>

            {/* Fade gradients */}
            <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}