import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, ChevronDown, Eye, Settings, Globe, Brain, Code, Smartphone, Building, Cloud, Shield, Cog } from "lucide-react";
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

interface HierarchicalNavigationProps {
  className?: string;
  onPageClick?: (page: ServicePage) => void;
}

export default function HierarchicalNavigation({ 
  className, 
  onPageClick 
}: HierarchicalNavigationProps) {
  const [openCategories, setOpenCategories] = useState<Set<number>>(new Set());
  const [openSubcategories, setOpenSubcategories] = useState<Set<number>>(new Set());

  const { data: categories = [] } = useQuery<ServiceCategory[]>({
    queryKey: ['/api/service-categories']
  });

  const { data: subcategories = [] } = useQuery<ServiceSubcategory[]>({
    queryKey: ['/api/service-subcategories']
  });

  const { data: pages = [] } = useQuery<ServicePage[]>({
    queryKey: ['/api/service-pages']
  });

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

  const handlePageClick = (page: ServicePage) => {
    if (onPageClick) {
      onPageClick(page);
    }
  };

  return (
    <div className={cn("bg-white border border-gray-200 rounded-lg shadow-sm", className)}>
      <div className="p-3 sm:p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Services Navigation</h3>
      </div>
      
      <div className="max-h-[280px] sm:max-h-96 overflow-y-auto">
        {categories.map((category) => {
          const categorySubcategories = subcategories.filter(
            sub => sub.categoryId === category.id && sub.status === 'active'
          );
          const isOpen = openCategories.has(category.id);
          const CategoryIcon = getCategoryIcon(category.name);

          return (
            <div key={category.id} className="border-b border-gray-100 last:border-b-0">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-2 sm:p-3 text-left hover:bg-gray-50 transition-colors group"
                title={`${category.name} - ${categorySubcategories.length} subcategories`}
              >
                <div className="flex items-center min-w-0 flex-1">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                    <CategoryIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center space-x-1 flex-shrink-0">
                  {categorySubcategories.length > 0 && (
                    <span className="text-xs text-gray-400 hidden sm:inline">
                      {categorySubcategories.length}
                    </span>
                  )}
                  {categorySubcategories.length > 0 && (
                    isOpen ? <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" /> : <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  )}
                </div>
              </button>

              {isOpen && categorySubcategories.length > 0 && (
                <div className="bg-gray-50">
                  {categorySubcategories.map((subcategory) => {
                    const subcategoryPages = pages.filter(
                      page => page.subcategoryId === subcategory.id && page.status === 'active'
                    );
                    const isSubOpen = openSubcategories.has(subcategory.id);

                    return (
                      <div key={subcategory.id} className="border-b border-gray-200 last:border-b-0 group relative">
                        <button
                          onClick={() => toggleSubcategory(subcategory.id)}
                          className="w-full flex items-center justify-between p-2 sm:p-3 pl-8 sm:pl-12 text-left hover:bg-gray-100 transition-colors"
                          title={subcategoryPages.length > 0 ? `${subcategory.name} - ${subcategoryPages.length} pages available` : `${subcategory.name} - No pages yet`}
                        >
                          <span className="text-gray-800 font-medium text-xs sm:text-sm truncate pr-2">
                            {subcategory.name}
                          </span>
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            {subcategoryPages.length > 0 && (
                              <span className="text-xs text-gray-400 hidden sm:inline">
                                {subcategoryPages.length}
                              </span>
                            )}
                            {subcategoryPages.length > 0 && (
                              isSubOpen ? <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" /> : <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                            )}
                          </div>
                          
                          {/* Hover tooltip for page names */}
                          {subcategoryPages.length > 0 && (
                            <div className="absolute left-full top-0 ml-2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap max-w-xs pointer-events-none">
                              <div className="font-medium mb-1">{subcategory.name} Pages:</div>
                              {subcategoryPages.map((page, index) => (
                                <div key={page.id} className="text-gray-300">
                                  {index + 1}. {page.title}
                                </div>
                              ))}
                            </div>
                          )}
                        </button>

                        {isSubOpen && subcategoryPages.length > 0 && (
                          <div className="bg-white">
                            {subcategoryPages.map((page) => (
                              <button
                                key={page.id}
                                onClick={() => handlePageClick(page)}
                                className="w-full flex items-center p-2 sm:p-3 pl-12 sm:pl-16 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 group"
                                title={`View ${page.title} page`}
                              >
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mr-2 sm:mr-3 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                                <span className="text-gray-700 text-xs sm:text-sm group-hover:text-blue-700 transition-colors truncate">
                                  {page.title}
                                </span>
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
          <div className="p-4 text-center text-gray-500 text-sm">
            No service categories available
          </div>
        )}
      </div>
    </div>
  );
}