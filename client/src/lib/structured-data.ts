import { COMPANY_INFO } from './constants';

export const getOrganizationStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": COMPANY_INFO.name,
  "description": COMPANY_INFO.description,
  "url": "https://www.greenapplex.com",
  "logo": "https://www.greenapplex.com/attached_assets/Logo A_1752582606982.jpg",
  "image": "https://www.greenapplex.com/attached_assets/Logo A_1752582606982.jpg",
  "foundingDate": "2016",
  "numberOfEmployees": "200+",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": COMPANY_INFO.address.split(',')[0],
    "addressLocality": "Silicon Valley",
    "addressRegion": "CA",
    "postalCode": "94025",
    "addressCountry": "US"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": COMPANY_INFO.phone,
    "email": COMPANY_INFO.email,
    "contactType": "customer service"
  },
  "sameAs": [
    COMPANY_INFO.social.linkedin,
    COMPANY_INFO.social.twitter,
    COMPANY_INFO.social.github
  ],
  "offers": {
    "@type": "Offer",
    "category": "Technology Services",
    "availability": "https://schema.org/InStock"
  },
  "areaServed": {
    "@type": "Place",
    "name": "North America"
  }
});

export const getWebsiteStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": COMPANY_INFO.name,
  "description": COMPANY_INFO.description,
  "url": "https://www.greenapplex.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://greenapplex.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": COMPANY_INFO.name,
    "logo": "https://www.greenapplex.com/attached_assets/Logo A_1752582606982.jpg"
  }
});

export const getServiceStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "AI Development Services",
  "description": "Comprehensive AI development services including enterprise AI solutions, generative AI development, Web3 & blockchain, mobile apps, custom software, and digital transformation.",
  "provider": {
    "@type": "Organization",
    "name": COMPANY_INFO.name,
    "url": "https://www.greenapplex.com"
  },
  "serviceType": "Software Development",
  "category": "AI Development",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "price": "Contact for pricing",
    "priceCurrency": "USD"
  },
  "areaServed": {
    "@type": "Place",
    "name": "North America"
  }
});

export const getLocalBusinessStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": COMPANY_INFO.name,
  "description": COMPANY_INFO.description,
  "image": "https://greenapplex.com/attached_assets/1_1752484440560.png",
  "telephone": COMPANY_INFO.phone,
  "email": COMPANY_INFO.email,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": COMPANY_INFO.address.split(',')[0],
    "addressLocality": "Silicon Valley",
    "addressRegion": "CA",
    "postalCode": "94025",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "37.4419",
    "longitude": "-122.1430"
  },
  "url": "https://greenapplex.com",
  "priceRange": "$$$$",
  "openingHours": "Mo-Fr 09:00-18:00",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "150"
  }
});

export const getFAQStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What AI development services does GreenAppleX offer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "GreenAppleX offers comprehensive AI development services including enterprise AI solutions, generative AI development, machine learning consulting, AI automation services, and custom AI software development."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to develop a custom AI solution?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The development timeline varies based on project complexity, typically ranging from 3-12 months for enterprise AI solutions. We provide detailed project timelines during our consultation process."
      }
    },
    {
      "@type": "Question",
      "name": "What technologies does GreenAppleX use for AI development?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We use cutting-edge technologies including TensorFlow, PyTorch, OpenAI, Python, React, Node.js, and cloud platforms like AWS and Azure for scalable AI solutions."
      }
    }
  ]
});

export const getBreadcrumbStructuredData = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});