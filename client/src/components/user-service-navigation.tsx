import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, ChevronDown, Eye, Brain, Globe, Smartphone, Code, Building, Cloud, Shield, Cog, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  status: string;
}

interface ServiceSubcategory {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  status: string;
}

interface ServicePage {
  id: number;
  title: string;
  slug: string;
  subcategoryId: number;
  status: string;
  content?: string;
}

interface Service {
  id: number;
  title: string;
  slug: string;
  pageName: string; // This is the field admin fills for user navigation  
  category: string;
  subCategory: string;
  content?: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string;
  status: string;
  startingPrice?: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface UserServiceNavigationProps {
  className?: string;
  onPageClick?: (page: ServicePage, content?: Service) => void;
  onCategoryClick?: (category: ServiceCategory) => void;
  onSubcategoryClick?: (subcategory: ServiceSubcategory) => void;
}

export default function UserServiceNavigation({ 
  className, 
  onPageClick,
  onCategoryClick,
  onSubcategoryClick
}: UserServiceNavigationProps) {
  const [openCategories, setOpenCategories] = useState<Set<number>>(new Set());
  const [openSubcategories, setOpenSubcategories] = useState<Set<number>>(new Set());
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [hoveredSubcategory, setHoveredSubcategory] = useState<number | null>(null);

  const { data: categories = [] } = useQuery<ServiceCategory[]>({
    queryKey: ['/api/service-categories']
  });

  const { data: subcategories = [] } = useQuery<ServiceSubcategory[]>({
    queryKey: ['/api/service-subcategories']
  });

  const { data: pages = [] } = useQuery<ServicePage[]>({
    queryKey: ['/api/service-pages']
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ['/api/services']
  });

  // Debug logging to understand the three-layer hierarchy
  React.useEffect(() => {
    console.log("🔍 THREE-LAYER HIERARCHY DEBUG:");
    console.log("📂 Categories loaded:", categories.length);
    console.log("📁 Subcategories loaded:", subcategories.length);
    console.log("📄 Services with Page Names:", services.filter(s => s.pageName && s.status === 'active').length);
    console.log("📋 Service Pages loaded:", pages.length);
    
    if (services.length > 0 && subcategories.length > 0 && categories.length > 0) {
      categories.forEach(category => {
        const categorySubcategories = subcategories.filter(sub => sub.categoryId === category.id);
        console.log(`\n📂 CATEGORY: "${category.name}" (${categorySubcategories.length} subcategories)`);
        
        categorySubcategories.forEach(subcategory => {
          const matchingServices = services.filter(service => 
            (service.subCategory === subcategory.name || service.subCategory === subcategory.slug) && 
            service.status === 'active' &&
            service.pageName
          );
          const matchingPages = pages.filter(page => page.subcategoryId === subcategory.id && page.status === 'active');
          
          console.log(`  📁 SUBCATEGORY: "${subcategory.name}"`);
          console.log(`    📄 Services with Page Names: ${matchingServices.length}`);
          console.log(`    📋 Service Pages: ${matchingPages.length}`);
          
          if (matchingServices.length > 0) {
            matchingServices.forEach(service => {
              console.log(`      ✓ SERVICE PAGE: "${service.pageName}" (from service: ${service.title})`);
            });
          }
          
          if (matchingPages.length > 0) {
            matchingPages.forEach(page => {
              console.log(`      ✓ STATIC PAGE: "${page.title}"`);
            });
          }
        });
      });
    }
  }, [services, subcategories, categories, pages]);

  // Helper function to get category icon
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: { [key: string]: any } = {
      'AI & Machine Learning': Brain,
      'Web3 & Blockchain': Globe,
      'Mobile Development': Smartphone,
      'Web Development': Code,
      'Enterprise Solutions': Building,
      'Cloud & DevOps': Cloud,
      'IoT & Security': Shield,
      'Automation & Testing': Cog,
      'Design & UX': Settings
    };
    return iconMap[categoryName] || Settings;
  };

  const toggleCategory = (categoryId: number) => {
    const newOpen = new Set(openCategories);
    if (newOpen.has(categoryId)) {
      newOpen.delete(categoryId);
    } else {
      newOpen.add(categoryId);
    }
    setOpenCategories(newOpen);
  };

  const toggleSubcategory = (subcategoryId: number) => {
    const newOpen = new Set(openSubcategories);
    if (newOpen.has(subcategoryId)) {
      newOpen.delete(subcategoryId);
    } else {
      newOpen.add(subcategoryId);
    }
    setOpenSubcategories(newOpen);
  };

  const [, setLocation] = useLocation();

  const handlePageClick = (page: ServicePage) => {
    // Find associated service content for this page
    const associatedService = services.find(service => 
      service.subCategory === page.title || 
      service.pageName === page.title ||
      service.slug === page.slug
    );
    
    if (associatedService && associatedService.slug) {
      // Navigate to the service page
      setLocation(`/services/${associatedService.slug}`);
    } else if (onPageClick) {
      onPageClick(page, associatedService);
    }
  };

  return (
    <div className={cn("bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden", className)}>
      <div className="p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base flex items-center">
          <Cog className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
          Services Navigator
        </h3>
        <p className="text-xs text-gray-600 mt-1">Click on categories, subcategories, or page names to explore services</p>
      </div>
      
      <div className="max-h-[300px] sm:max-h-[400px] lg:max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {categories.map((category) => {
          const categorySubcategories = subcategories.filter(
            sub => sub.categoryId === category.id && sub.status === 'active'
          );
          const isOpen = openCategories.has(category.id);
          const CategoryIcon = getCategoryIcon(category.name);
          
          // Get all pages for this category for hover display
          const categoryPages = categorySubcategories.reduce((allPages, sub) => {
            const subPages = pages.filter(page => page.subcategoryId === sub.id && page.status === 'active');
            return [...allPages, ...subPages];
          }, [] as ServicePage[]);

          return (
            <div key={category.id} className="border-b border-gray-100 last:border-b-0">
              {/* Category Display - Now Clickable */}
              <div
                className="w-full flex items-center justify-between p-3 sm:p-4 relative group cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={() => onCategoryClick && onCategoryClick(category)}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="flex items-center min-w-0 flex-1">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center mr-3 flex-shrink-0">
                    <CategoryIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-gray-900 text-sm sm:text-base truncate block">
                      {category.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {categorySubcategories.length} subcategories • {categoryPages.length} pages
                    </span>
                  </div>
                </div>
                
                {/* Expand/Collapse Button */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  {categoryPages.length > 0 && (
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                      {categoryPages.length}
                    </span>
                  )}
                  {categorySubcategories.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent category click when clicking expand button
                        toggleCategory(category.id);
                      }}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title={isOpen ? "Collapse category" : "Expand category"}
                    >
                      <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>
                        <ChevronRight className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                      </div>
                    </button>
                  )}
                </div>

                {/* Enhanced hover tooltip for category pages */}
                {categoryPages.length > 0 && hoveredCategory === category.id && (
                  <div className="absolute left-full top-0 ml-3 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 z-50 whitespace-nowrap max-w-xs shadow-lg opacity-0 animate-in fade-in-0 duration-200 pointer-events-none">
                    <div className="font-semibold mb-2 text-blue-300">{category.name} Available Pages:</div>
                    {categoryPages.slice(0, 5).map((page, index) => (
                      <div key={page.id} className="text-gray-300 flex items-center space-x-2 mb-1">
                        <Eye className="w-3 h-3 text-blue-400" />
                        <span>{index + 1}. {page.title}</span>
                      </div>
                    ))}
                    {categoryPages.length > 5 && (
                      <div className="text-gray-400 text-center mt-2 pt-2 border-t border-gray-700">
                        +{categoryPages.length - 5} more pages
                      </div>
                    )}
                    <div className="text-blue-200 text-center mt-2 pt-2 border-t border-gray-700 text-xs">
                      Click page names below to view content
                    </div>
                  </div>
                )}
              </div>

              {isOpen && categorySubcategories.length > 0 && (
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-100">
                  {categorySubcategories.map((subcategory) => {
                    const subcategoryPages = pages.filter(
                      page => page.subcategoryId === subcategory.id && page.status === 'active'
                    );
                    const isSubOpen = openSubcategories.has(subcategory.id);

                    return (
                      <div key={subcategory.id} className="border-b border-gray-200 last:border-b-0 relative">
                        {/* Subcategory Display - Now Clickable */}
                        <div
                          className="w-full flex items-center justify-between p-3 sm:p-4 pl-12 sm:pl-16 relative group cursor-pointer hover:bg-blue-50 transition-colors"
                          onClick={() => onSubcategoryClick && onSubcategoryClick(subcategory)}
                          onMouseEnter={() => setHoveredSubcategory(subcategory.id)}
                          onMouseLeave={() => setHoveredSubcategory(null)}
                        >
                          <div className="flex-1 min-w-0">
                            <span className="text-gray-800 font-medium text-sm truncate block">
                              {subcategory.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {(() => {
                                const matchingServices = services.filter(service => 
                                  (service.subCategory === subcategory.name || service.subCategory === subcategory.slug) && 
                                  service.status === 'active' &&
                                  service.pageName
                                );
                                const totalPages = matchingServices.length + subcategoryPages.length;
                                console.log(`🔍 MENU COUNT: Subcategory "${subcategory.name}" → ${matchingServices.length} services + ${subcategoryPages.length} pages = ${totalPages} total`);
                                return totalPages;
                              })()} {(() => {
                                const matchingServices = services.filter(service => 
                                  (service.subCategory === subcategory.name || service.subCategory === subcategory.slug) && 
                                  service.status === 'active' &&
                                  service.pageName
                                );
                                const totalPages = matchingServices.length + subcategoryPages.length;
                                return totalPages === 1 ? 'page' : 'pages';
                              })()} available
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            {(() => {
                              const matchingServices = services.filter(service => 
                                (service.subCategory === subcategory.name || service.subCategory === subcategory.slug) && 
                                service.status === 'active' &&
                                service.pageName
                              );
                              const totalCount = matchingServices.length + subcategoryPages.length;
                              return totalCount > 0 ? (
                                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                  {totalCount}
                                </span>
                              ) : null;
                            })()}
                            {(() => {
                              const matchingServices = services.filter(service => 
                                (service.subCategory === subcategory.name || service.subCategory === subcategory.slug) && 
                                service.status === 'active' &&
                                service.pageName
                              );
                              const totalCount = matchingServices.length + subcategoryPages.length;
                              return totalCount > 0;
                            })() && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent subcategory click when clicking expand button
                                  toggleSubcategory(subcategory.id);
                                }}
                                className="p-1 hover:bg-white rounded transition-colors"
                                title={isSubOpen ? "Collapse subcategory" : "Expand subcategory"}
                              >
                                <div className={`transform transition-transform duration-200 ${isSubOpen ? 'rotate-90' : ''}`}>
                                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hover:text-blue-500" />
                                </div>
                              </button>
                            )}
                          </div>
                          
                          {/* Enhanced hover tooltip for subcategory with admin page names */}
                          {hoveredSubcategory === subcategory.id && (
                            <div className="absolute left-full top-0 ml-3 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 z-50 whitespace-nowrap max-w-xs shadow-lg animate-in fade-in-0 duration-200 pointer-events-none opacity-100">
                              <div className="font-semibold mb-2 text-blue-300">{subcategory.name} Services:</div>
                              
                              {/* Show admin-created services with page names */}
                              {services
                                .filter(service => 
                                  (service.subCategory === subcategory.name || service.subCategory === subcategory.slug) && 
                                  service.status === 'active' &&
                                  service.pageName
                                )
                                .slice(0, 5)
                                .map((service, index) => (
                                  <div key={service.id} className="text-gray-300 flex items-center space-x-2 mb-1">
                                    <Eye className="w-3 h-3 text-blue-400" />
                                    <span>{index + 1}. {service.pageName}</span>
                                  </div>
                                ))
                              }
                              
                              {/* Show service pages if no admin services */}
                              {services.filter(service => 
                                (service.subCategory === subcategory.name || service.subCategory === subcategory.slug) && 
                                service.status === 'active' &&
                                service.pageName
                              ).length === 0 && subcategoryPages.slice(0, 5).map((page, index) => (
                                <div key={page.id} className="text-gray-300 flex items-center space-x-2 mb-1">
                                  <Eye className="w-3 h-3 text-blue-400" />
                                  <span>{index + 1}. {page.title}</span>
                                </div>
                              ))}
                              
                              {/* Show fallback if no pages at all */}
                              {services.filter(service => 
                                (service.subCategory === subcategory.name || service.subCategory === subcategory.slug) && 
                                service.status === 'active' &&
                                service.pageName
                              ).length === 0 && subcategoryPages.length === 0 && (
                                <div className="text-gray-400 text-center">
                                  No pages available yet
                                </div>
                              )}
                              
                              {(services.filter(service => 
                                (service.subCategory === subcategory.name || service.subCategory === subcategory.slug) && 
                                service.status === 'active' &&
                                service.pageName
                              ).length > 5 || subcategoryPages.length > 5) && (
                                <div className="text-gray-400 text-center mt-2 pt-2 border-t border-gray-700">
                                  +{Math.max(
                                    services.filter(service => 
                                      (service.subCategory === subcategory.name || service.subCategory === subcategory.slug) && 
                                      service.status === 'active' &&
                                      service.pageName
                                    ).length - 5,
                                    subcategoryPages.length - 5
                                  )} more pages
                                </div>
                              )}
                              
                              <div className="text-blue-200 text-center mt-2 pt-2 border-t border-gray-700 text-xs">
                                Admin-created services
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Admin-Created Services (Clickable) */}
                        {isSubOpen && (
                          <div className="bg-white border-t border-gray-200">
                            {services
                              .filter(service => 
                                (service.subCategory === subcategory.name || service.subCategory === subcategory.slug) && 
                                service.status === 'active' &&
                                service.pageName
                              )
                              .map((service) => (
                                <button
                                  key={`service-${service.id}`}
                                  onClick={() => {
                                    if (service.slug) {
                                      setLocation(`/services/${service.slug}`);
                                    }
                                  }}
                                  className="w-full flex items-center p-3 sm:p-4 pl-16 sm:pl-24 text-left hover:bg-blue-50 transition-all duration-200 group border-b border-gray-100 last:border-b-0 cursor-pointer"
                                  title={`Click to view ${service.pageName} service content`}
                                >
                                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 mr-3 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <span className="text-gray-700 text-sm group-hover:text-blue-700 transition-colors truncate block font-medium">
                                      {service.pageName}
                                    </span>
                                    <span className="text-xs text-blue-500 group-hover:text-blue-600">
                                      Admin-created service • Click to view →
                                    </span>
                                  </div>
                                  <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-blue-500 transition-all duration-200 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1" />
                                </button>
                              ))
                            }
                            
                            {/* Service Pages (Clickable) - Show if no admin services */}
                            {services.filter(service => 
                              (service.subCategory === subcategory.name || service.subCategory === subcategory.slug) && 
                              service.status === 'active' &&
                              service.pageName
                            ).length === 0 && subcategoryPages.map((page) => (
                              <button
                                key={`page-${page.id}`}
                                onClick={() => handlePageClick(page)}
                                className="w-full flex items-center p-3 sm:p-4 pl-16 sm:pl-24 text-left hover:bg-blue-50 transition-all duration-200 group border-b border-gray-100 last:border-b-0 cursor-pointer"
                                title={`Click to view ${page.title} service content`}
                              >
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mr-3 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <span className="text-gray-700 text-sm group-hover:text-blue-700 transition-colors truncate block font-medium">
                                    {page.title}
                                  </span>
                                  <span className="text-xs text-gray-500 group-hover:text-blue-600">
                                    Click to view service content →
                                  </span>
                                </div>
                                <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-blue-500 transition-all duration-200 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        
        {categories.length === 0 && (
          <div className="p-8 text-center">
            <Cog className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <div className="text-gray-500 text-sm mb-2">No service categories available</div>
            <div className="text-gray-400 text-xs">Service navigation will appear here when categories are created</div>
          </div>
        )}
      </div>
    </div>
  );
}