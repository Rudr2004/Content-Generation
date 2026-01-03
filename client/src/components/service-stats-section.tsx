import React from "react";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function ServiceStatsSection() {
  const stats = [
    {
      number: "500+",
      label: "Projects Delivered",
      color: "text-purple-600"
    },
    {
      number: "50M+",
      label: "App Downloads",
      color: "text-blue-600"
    },
    {
      number: "200+",
      label: "Expert Developers",
      color: "text-pink-600"
    },
    {
      number: "98%",
      label: "Client Satisfaction",
      color: "text-indigo-600"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerChildren}
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 heading-georgia">
              Trusted by Industry Leaders
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto text-poppins">
              Our proven track record speaks for itself with hundreds of successful projects across various industries.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className={`text-4xl md:text-5xl lg:text-6xl font-bold ${stat.color} mb-2`}>
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}