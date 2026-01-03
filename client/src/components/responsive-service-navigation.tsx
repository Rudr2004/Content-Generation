import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, ChevronDown, Eye, Settings, Globe, Brain, Code, Smartphone, Building, Cloud, Shield, Cog, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";

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
}

interface ResponsiveServiceNavigationProps {
  className?: string;
  onPageClick?: (page: ServicePage) => void;
  compact?: boolean;
}

export default function ResponsiveServiceNavigation({
  className,
  onPageClick,
  compact = false
}: ResponsiveServiceNavigationProps) {
  const [openCategories, setOpenCategories] = useState<Set<number>>(new Set());
  const [openSubcategories, setOpenSubcategories] = useState<Set<number>>(new Set());
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

  const handlePageClick = (page: ServicePage) => {
    if (onPageClick) {
      onPageClick(page);
    }
  };

  if (compact) {
    return (
      <div className={cn("bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden", className)}>
        <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-2">
            <Grid3X3 className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-gray-900 text-sm">Services</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {categories.length} categories
            </span>
          </div>
        </div>

        <div className="max-h-[200px] overflow-y-auto">
          {categories.map((category) => {
            const categorySubcategories = subcategories.filter(
              sub => sub.categoryId === category.id && sub.status === 'active'
            );
            const CategoryIcon = getCategoryIcon(category.name);

            return (
              <div key={category.id} className="border-b border-gray-100 last:border-b-0">
                <div className="flex items-center p-2 hover:bg-gray-50 transition-colors">
                  <div className="w-5 h-5 rounded bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center mr-2 flex-shrink-0">
                    <CategoryIcon className="w-3 h-3 text-white" />
                  </div>
                  <span className="font-medium text-gray-900 text-xs truncate flex-1">
                    {category.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {categorySubcategories.length}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden", className)}>
      <div className="p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Services Navigation</h3>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span className="hidden sm:inline">{categories.length} categories</span>
            <span className="bg-gray-100 px-2 py-0.5 rounded-full">
              {pages.length} pages
            </span>
          </div>
        </div>
      </div>

      <div className="max-h-[300px] sm:max-h-[400px] lg:max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {categories.map((category) => {
          const categorySubcategories = subcategories.filter(
            sub => sub.categoryId === category.id && sub.status === 'active'
          );
          const isOpen = openCategories.has(category.id);
          const CategoryIcon = getCategoryIcon(category.name);
          const totalPages = categorySubcategories.reduce(
            (total, sub) => total + pages.filter(page => page.subcategoryId === sub.id && page.status === 'active').length, 0
          );

          return (
            <div key={category.id} className="border-b border-gray-100 last:border-b-0">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group"
                title={`${category.name} - ${categorySubcategories.length} subcategories, ${totalPages} total pages`}
              >
                <div className="flex items-center min-w-0 flex-1">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center mr-3 flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                    <CategoryIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-gray-900 text-sm sm:text-base truncate block">
                      {category.name}
                    </span>
                    <span className="text-xs text-gray-500 hidden sm:block">
                      {categorySubcategories.length} subcategories • {totalPages} pages
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full hidden sm:inline">
                    {totalPages}
                  </span>
                  {categorySubcategories.length > 0 && (
                    <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                    </div>
                  )}
                </div>
              </button>

              {isOpen && categorySubcategories.length > 0 && (
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-100">
                  {categorySubcategories.map((subcategory) => {
                    const subcategoryPages = pages.filter(
                      page => page.subcategoryId === subcategory.id && page.status === 'active'
                    );
                    const isSubOpen = openSubcategories.has(subcategory.id);

                    return (
                      <div key={subcategory.id} className="border-b border-gray-200 last:border-b-0 relative">
                        <button
                          onClick={() => toggleSubcategory(subcategory.id)}
                          onMouseEnter={() => setHoveredSubcategory(subcategory.id)}
                          onMouseLeave={() => setHoveredSubcategory(null)}
                          className="w-full flex items-center justify-between p-3 sm:p-4 pl-12 sm:pl-16 text-left hover:bg-white transition-all duration-200 group"
                          title={subcategoryPages.length > 0 ? `${subcategory.name} - ${subcategoryPages.length} pages available` : `${subcategory.name} - No pages yet`}
                        >
                          <div className="flex-1 min-w-0">
                            <span className="text-gray-800 font-medium text-sm truncate block group-hover:text-blue-700 transition-colors">
                              {subcategory.name}
                            </span>
                            <span className="text-xs text-gray-500 hidden sm:block">
                              {subcategoryPages.length} pages available
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            {subcategoryPages.length > 0 && (
                              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                {subcategoryPages.length}
                              </span>
                            )}
                            {subcategoryPages.length > 0 && (
                              <div className={`transform transition-transform duration-200 ${isSubOpen ? 'rotate-90' : ''}`}>
                                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-blue-500" />
                              </div>
                            )}
                          </div>

                          {/* Enhanced hover tooltip for page names */}
                          {subcategoryPages.length > 0 && hoveredSubcategory === subcategory.id && (
                            <div className="absolute left-full top-0 ml-3 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 z-50 whitespace-nowrap max-w-xs shadow-lg opacity-0 animate-in fade-in-0 duration-200 pointer-events-none">
                              <div className="font-semibold mb-2 text-blue-300">{subcategory.name} Pages:</div>
                              {subcategoryPages.slice(0, 5).map((page, index) => (
                                <div key={page.id} className="text-gray-300 flex items-center space-x-2 mb-1">
                                  <Eye className="w-3 h-3 text-blue-400" />
                                  <span>{index + 1}. {page.title}</span>
                                </div>
                              ))}
                              {subcategoryPages.length > 5 && (
                                <div className="text-gray-400 text-center mt-2 pt-2 border-t border-gray-700">
                                  +{subcategoryPages.length - 5} more pages
                                </div>
                              )}
                            </div>
                          )}
                        </button>

                        {isSubOpen && subcategoryPages.length > 0 && (
                          <div className="bg-white border-t border-gray-200">
                            {subcategoryPages.map((page) => (
                              <button
                                key={page.id}
                                onClick={() => handlePageClick(page)}
                                className="w-full flex items-center p-3 sm:p-4 pl-16 sm:pl-24 text-left hover:bg-blue-50 transition-all duration-200 group border-b border-gray-100 last:border-b-0"
                                title={`View ${page.title} page`}
                              >
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mr-3 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <span className="text-gray-700 text-sm group-hover:text-blue-700 transition-colors truncate block font-medium">
                                    {page.title}
                                  </span>
                                  <span className="text-xs text-gray-500 hidden sm:block">
                                    Click to view page details
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
            <Grid3X3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <div className="text-gray-500 text-sm mb-2">No service categories available</div>
            <div className="text-gray-400 text-xs">Create categories to organize your services</div>
          </div>
        )}
      </div>
    </div>
  );
}