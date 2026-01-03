import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, ChevronDown, ExternalLink, Loader2, Menu, X, Search } from "lucide-react";
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
}

interface Service {
  id: number;
  title: string;
  slug: string;
  pageName: string;
  category: string;
  subCategory: string;
  status: string;
}

interface DynamicServicesMenuProps {
  className?: string;
  onMenuClose?: () => void;
  isOpen?: boolean;
  isMobile?: boolean; // New prop to detect mobile view
}

export default function DynamicServicesMenu({ className, onMenuClose, isOpen: externalIsOpen, isMobile = false }: DynamicServicesMenuProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [hoveredSubcategory, setHoveredSubcategory] = useState<number | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();

  // Mobile/Tablet specific states
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<number>>(new Set());

  // Fetch all data dynamically
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<ServiceCategory[]>({
    queryKey: ['/api/service-categories'],
    enabled: isOpen,
  });

  const { data: subcategories = [], isLoading: subcategoriesLoading } = useQuery<ServiceSubcategory[]>({
    queryKey: ['/api/service-subcategories'],
    enabled: isOpen,
  });

  const { data: pages = [], isLoading: pagesLoading } = useQuery<ServicePage[]>({
    queryKey: ['/api/service-pages'],
    enabled: isOpen,
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ['/api/services'],
    enabled: isOpen,
  });

  const isLoading = categoriesLoading || subcategoriesLoading || pagesLoading || servicesLoading;

  // Hover timeout refs
  const categoryHoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const subcategoryHoverTimeout = useRef<NodeJS.Timeout | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setInternalIsOpen(false);
        setHoveredCategory(null);
        setHoveredSubcategory(null);
        onMenuClose?.();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onMenuClose]);

  // Handle keyboard navigation
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setInternalIsOpen(false);
        setHoveredCategory(null);
        setHoveredSubcategory(null);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  // Handle hover for categories
  const handleCategoryMouseEnter = (categoryId: number) => {
    if (categoryHoverTimeout.current) {
      clearTimeout(categoryHoverTimeout.current);
    }
    setHoveredCategory(categoryId);
    setHoveredSubcategory(null);
  };

  const handleCategoryMouseLeave = () => {
    categoryHoverTimeout.current = setTimeout(() => {
      setHoveredCategory(null);
      setHoveredSubcategory(null);
    }, 200);
  };

  // Handle hover for subcategories
  const handleSubcategoryMouseEnter = (subcategoryId: number) => {
    if (subcategoryHoverTimeout.current) {
      clearTimeout(subcategoryHoverTimeout.current);
    }
    setHoveredSubcategory(subcategoryId);
  };

  const handleSubcategoryMouseLeave = () => {
    subcategoryHoverTimeout.current = setTimeout(() => {
      setHoveredSubcategory(null);
    }, 200);
  };

  // Helper function to check if a slug is valid (no HTML content)
  const isValidSlug = (slug: string) => {
    if (!slug || typeof slug !== 'string') return false;
    // Check for HTML tags or invalid characters
    const hasHTML = /<[^>]*>/.test(slug);
    const hasInvalidChars = /[<>]/.test(slug);
    return !hasHTML && !hasInvalidChars && slug.trim().length > 0;
  };

  const handlePageClick = (pageSlug: string, type: 'service' | 'page') => {
    // Validate slug before navigation
    if (!isValidSlug(pageSlug)) {
      console.warn('Invalid slug detected:', pageSlug);
      return;
    }
    
    if (type === 'service') {
      setLocation(`/services/${pageSlug}`);
    } else {
      setLocation(`/service-pages/${pageSlug}`);
    }
    setInternalIsOpen(false);
    setHoveredCategory(null);
    setHoveredSubcategory(null);
    onMenuClose?.();
  };

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobilePageClick = (pageSlug: string, type: 'service' | 'page') => {
    // Validate slug before navigation
    if (!isValidSlug(pageSlug)) {
      console.warn('Invalid slug detected:', pageSlug);
      return;
    }
    
    if (type === 'service') {
      setLocation(`/services/${pageSlug}`);
    } else {
      setLocation(`/service-pages/${pageSlug}`);
    }
    // Close mobile menu properly
    setInternalIsOpen(false);
    setExpandedCategories(new Set());
    setExpandedSubcategories(new Set());
    onMenuClose?.();
  };

  const getServicesForSubcategory = (subcategory: ServiceSubcategory) => {
    return services.filter(service =>
      (service.subCategory === subcategory.name || service.subCategory === subcategory.slug) &&
      service.status === 'active' &&
      service.pageName &&
      isValidSlug(service.slug)
    );
  };

  const getPagesForSubcategory = (subcategoryId: number) => {
    return pages.filter(page =>
      page.subcategoryId === subcategoryId &&
      page.status === 'active' &&
      isValidSlug(page.slug)
    );
  };

  // Mobile/Tablet helper functions
  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const toggleSubcategory = (subcategoryId: number) => {
    setExpandedSubcategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subcategoryId)) {
        newSet.delete(subcategoryId);
      } else {
        newSet.add(subcategoryId);
      }
      return newSet;
    });
  };

  const filteredCategories = categories.filter(category =>
    searchQuery === "" ||
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCategories = categories.filter(cat => cat.status === 'active');

  return (
    <>
      {/* Desktop/Tablet Services Button */}
      <div className={cn("relative hidden md:block", className)} ref={menuRef}>
        <button
          onClick={() => externalIsOpen === undefined && setInternalIsOpen(!internalIsOpen)}
          onMouseEnter={() => setHoveredItem('services')}
          onMouseLeave={() => setHoveredItem(null)}
          className={cn(
            "flex items-center space-x-1 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 hover:bg-clip-text hover:text-transparent transition-colors font-medium text-base lg:text-lg text-poppins",
            isOpen ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent" : ""
          )}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label="Services menu"
        >
          <span>Services</span>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              isOpen ? "rotate-180" : ""
            )}
          />
        </button>

        {/* Desktop Dropdown Menu (Large screens) */}
        {isOpen && !isMobile && (
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 min-w-[900px] max-w-[1200px] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 hidden lg:block"
            style={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
            }}
            role="menu"
            aria-orientation="vertical"
          >
            <div className="p-8">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  <span className="ml-2 text-sm text-gray-500">Loading services...</span>
                </div>
              ) : activeCategories.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <p className="text-sm">No service categories available</p>
                </div>
              ) : (
                <div className="flex max-h-[calc(100vh-250px)] overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                  {/* Layer 1 - Categories */}
                  <div className="w-64 lg:w-72 xl:w-80 border-r border-gray-200 bg-gradient-to-b from-blue-50 to-gray-50 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50 hover:scrollbar-thumb-blue-400">
                    {/* Header */}
                    {/* <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 border-b border-gray-200">
                      <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        Categories
                      </h4>
                    </div> */}
                    {/* Category List */}
                    {activeCategories.map((category) => {
                      const categorySubcategories = subcategories.filter(
                        sub => sub.categoryId === category.id && sub.status === 'active'
                      );
                      const isActive = hoveredCategory === category.id;

                      return (
                        <div
                          key={category.id}
                          onMouseEnter={() => handleCategoryMouseEnter(category.id)}
                          className={cn(
                            "flex items-center space-x-3 p-3 border-b border-gray-100 cursor-pointer transition-all duration-300",
                            isActive
                              ? "bg-gradient-to-r from-blue-100 to-purple-50 border-l-4 border-blue-500 shadow-sm"
                              : "hover:bg-white hover:shadow-sm"
                          )}
                        >
                          <div className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm transition-all duration-300",
                            isActive
                              ? "bg-gradient-to-br from-blue-500 to-purple-600 scale-105"
                              : "bg-gradient-to-br from-gray-400 to-gray-500"
                          )}>
                            {category.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={cn(
                              "font-semibold text-sm truncate transition-colors duration-200",
                              isActive ? "text-blue-700" : "text-gray-700"
                            )}>
                              {category.name}
                            </div>
                            <div className={cn(
                              "text-xs transition-colors duration-200",
                              isActive ? "text-blue-600" : "text-gray-500"
                            )}>
                              {categorySubcategories.length} subcategories
                            </div>
                          </div>
                          {isActive && (
                            <ChevronRight className="w-4 h-4 text-blue-500 animate-pulse" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Layer 2 - Subcategories */}
                  <div className="w-64 lg:w-72 xl:w-80 border-r border-gray-200 bg-gradient-to-b from-white to-gray-50 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-50 hover:scrollbar-thumb-purple-400">
                    {/* <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 border-b border-gray-200">
                      <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                        {hoveredCategory
                          ? activeCategories.find(cat => cat.id === hoveredCategory)?.name || 'Subcategories' : ''
                        }
                      </h4>
                    </div> */}
                    {hoveredCategory ? (
                      (() => {
                        const selectedCategory = activeCategories.find(cat => cat.id === hoveredCategory);
                        if (!selectedCategory) return null;

                        const categorySubcategories = subcategories.filter(
                          sub => sub.categoryId === selectedCategory.id && sub.status === 'active'
                        );

                        return categorySubcategories.map((subcategory) => {
                          const subcategoryServices = getServicesForSubcategory(subcategory);
                          const subcategoryPages = getPagesForSubcategory(subcategory.id);
                          const allItems = [...subcategoryServices, ...subcategoryPages];
                          const isSubActive = hoveredSubcategory === subcategory.id;

                          return (
                            <div
                              key={subcategory.id}
                              onMouseEnter={() => handleSubcategoryMouseEnter(subcategory.id)}
                              className={cn(
                                "p-3 border-b border-gray-100 cursor-pointer transition-all duration-300",
                                isSubActive
                                  ? "bg-gradient-to-r from-purple-100 to-pink-50 border-l-4 border-purple-500 shadow-sm"
                                  : "hover:bg-gray-50 hover:shadow-sm"
                              )}
                            >
                              <div className="flex items-center space-x-2">
                                <div className={cn(
                                  "w-2 h-2 rounded-full transition-colors duration-200",
                                  isSubActive ? "bg-purple-500" : "bg-gray-400"
                                )}></div>
                                <div className="flex-1 min-w-0">
                                  <div className={cn(
                                    "font-semibold text-sm truncate transition-colors duration-200",
                                    isSubActive ? "text-purple-700" : "text-gray-700"
                                  )}>
                                    {subcategory.name}
                                  </div>
                                  <div className={cn(
                                    "text-xs mt-1 transition-colors duration-200",
                                    isSubActive ? "text-purple-600" : "text-gray-500"
                                  )}>
                                    {allItems.length} service{allItems.length !== 1 ? 's' : ''}
                                  </div>
                                </div>
                                {isSubActive && (
                                  <ChevronRight className="w-3 h-3 text-purple-500 animate-pulse" />
                                )}
                              </div>
                            </div>
                          );
                        });
                      })()
                    ) : (
                      <div className="p-6 text-center text-gray-400">
                        <div className="text-sm">No Service Selected</div>
                      </div>
                    )}
                  </div>

                  {/* Layer 3 - Services/Pages */}
                  <div className="flex-1 bg-gradient-to-b from-white to-blue-50 min-w-0 overflow-y-auto scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-pink-50 hover:scrollbar-thumb-pink-400">
                    {/* <div className="p-3 bg-gradient-to-r from-pink-100 to-blue-100 border-b border-gray-200">
                      <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide flex items-center">
                        <div className="w-2 h-2 bg-pink-500 rounded-full mr-2"></div>
                        <span className="truncate">
                          {hoveredSubcategory
                            ? subcategories.find(sub => sub.id === hoveredSubcategory)?.name || 'Service Pages'
                            : 'Service Pages'}
                        </span>
                      </h4>
                    </div> */}
                    {hoveredSubcategory ? (
                      (() => {
                        const selectedSubcategory = subcategories.find(sub => sub.id === hoveredSubcategory);
                        if (!selectedSubcategory) return null;

                        const subcategoryServices = getServicesForSubcategory(selectedSubcategory);
                        const subcategoryPages = getPagesForSubcategory(selectedSubcategory.id);
                        const allItems = [...subcategoryServices, ...subcategoryPages];

                        if (allItems.length === 0) {
                          return (
                            <div className="p-6 text-center text-gray-400">
                              <div className="text-sm">No service pages available</div>
                            </div>
                          );
                        }

                        return (
                          <div className="p-2">
                            {subcategoryServices.map((service) => (
                              <button
                                key={`service-${service.id}`}
                                onClick={() => handlePageClick(service.slug, 'service')}
                                className="w-full text-left p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group border-b border-gray-50 hover:shadow-sm hover:border-blue-200"
                              >
                                <div className="flex items-start space-x-2">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 group-hover:bg-blue-600 transition-colors"></div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm text-gray-700 group-hover:text-blue-700 line-clamp-2">
                                      {service.pageName || service.title}
                                    </div>
                                    {/* <div className="text-xs text-blue-600 mt-1 hidden sm:block flex items-center">
                                      <span className="inline-block w-1 h-1 bg-blue-400 rounded-full mr-1"></span>
                                      Admin Created
                                    </div> */}
                                  </div>
                                </div>
                              </button>
                            ))}

                            {subcategoryPages.map((page) => (
                              <button
                                key={`page-${page.id}`}
                                onClick={() => handlePageClick(page.slug, 'page')}
                                className="w-full text-left p-3 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-300 group border-b border-gray-50 hover:shadow-sm hover:border-pink-200"
                              >
                                <div className="flex items-start space-x-2">
                                  <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 group-hover:bg-pink-600 transition-colors"></div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm text-gray-700 group-hover:text-pink-700 line-clamp-2">
                                      {page.title}
                                    </div>
                                    <div className="text-xs text-pink-600 mt-1 hidden sm:block flex items-center">
                                      <span className="inline-block w-1 h-1 bg-pink-400 rounded-full mr-1"></span>
                                      Static Page
                                    </div>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        );
                      })()
                    ) : (
                      <div className="p-6 text-center text-gray-400">
                        <div className="text-sm mb-2">No Service page</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tablet Navigation (Medium screens) */}
        {isOpen && !isMobile && (
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 min-w-[700px] max-w-[900px] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 hidden md:block lg:hidden"
            style={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
            }}
            role="menu"
            aria-orientation="vertical"
          >
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  <span className="ml-2 text-sm text-gray-500">Loading services...</span>
                </div>
              ) : activeCategories.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <p className="text-sm">No service categories available</p>
                </div>
              ) : (
                <div className="flex h-80 overflow-x-auto">
                  {/* Tablet Layer 1 - Categories */}
                  <div className="w-60 border-r border-gray-200 bg-gray-50 min-h-full">
                    <div className="p-3 bg-gray-100 border-b border-gray-200">
                      <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Services</h4>
                    </div>
                    <div className="overflow-y-auto h-full">
                      {activeCategories.map((category) => {
                        const categorySubcategories = subcategories.filter(
                          sub => sub.categoryId === category.id && sub.status === 'active'
                        );
                        const isActive = hoveredCategory === category.id;

                        return (
                          <div
                            key={category.id}
                            onMouseEnter={() => handleCategoryMouseEnter(category.id)}
                            className={cn(
                              "flex items-center space-x-3 p-3 border-b border-gray-100 cursor-pointer transition-all duration-200",
                              isActive ? "bg-blue-50 border-l-4 border-blue-500" : "hover:bg-white"
                            )}
                          >
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm",
                              isActive ? "bg-blue-500" : "bg-gray-400"
                            )}>
                              {category.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={cn(
                                "font-medium text-sm truncate",
                                isActive ? "text-blue-700" : "text-gray-700"
                              )}>
                                {category.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {categorySubcategories.length} subcategories
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tablet Layer 2 - Subcategories */}
                  <div className="w-60 border-r border-gray-200 bg-white min-h-full">
                    <div className="p-3 bg-gray-100 border-b border-gray-200">
                      <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        {hoveredCategory ?
                          activeCategories.find(cat => cat.id === hoveredCategory)?.name || 'Subcategories'
                          : ''
                        }
                      </h4>
                    </div>
                    <div className="overflow-y-auto h-full">
                      {hoveredCategory ? (
                        activeCategories.find(cat => cat.id === hoveredCategory)?.id &&
                        subcategories.filter(
                          sub => sub.categoryId === hoveredCategory && sub.status === 'active'
                        ).map((subcategory) => {
                          const subcategoryServices = getServicesForSubcategory(subcategory);
                          const subcategoryPages = getPagesForSubcategory(subcategory.id);
                          const allItems = [...subcategoryServices, ...subcategoryPages];
                          const isSubActive = hoveredSubcategory === subcategory.id;

                          return (
                            <div
                              key={subcategory.id}
                              onMouseEnter={() => handleSubcategoryMouseEnter(subcategory.id)}
                              className={cn(
                                "p-3 border-b border-gray-100 cursor-pointer transition-all duration-200",
                                isSubActive ? "bg-blue-50 border-l-4 border-blue-500" : "hover:bg-gray-50"
                              )}
                            >
                              <div className="flex items-center space-x-2">
                                <div className={cn(
                                  "w-2 h-2 rounded-full",
                                  isSubActive ? "bg-blue-500" : "bg-gray-400"
                                )}></div>
                                <div className="flex-1 min-w-0">
                                  <div className={cn(
                                    "font-medium text-sm truncate",
                                    isSubActive ? "text-blue-700" : "text-gray-700"
                                  )}>
                                    {subcategory.name}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {allItems.length} service{allItems.length !== 1 ? 's' : ''}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-6 text-center text-gray-400">
                          <div className="text-sm">Select a service to view subservices</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tablet Layer 3 - Service Pages */}
                  <div className="flex-1 bg-white min-h-full">
                    <div className="p-3 bg-gray-100 border-b border-gray-200">
                      <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        {hoveredSubcategory ?
                          subcategories.find(sub => sub.id === hoveredSubcategory)?.name || 'Service Pages'
                          : 'Service Pages'
                        }
                      </h4>
                    </div>
                    <div className="overflow-y-auto h-full">
                      {hoveredSubcategory ? (
                        subcategories.find(sub => sub.id === hoveredSubcategory)?.id &&
                        (() => {
                          const selectedSubcategory = subcategories.find(sub => sub.id === hoveredSubcategory);
                          if (!selectedSubcategory) return null;

                          const subcategoryServices = getServicesForSubcategory(selectedSubcategory);
                          const subcategoryPages = getPagesForSubcategory(selectedSubcategory.id);
                          const allItems = [...subcategoryServices, ...subcategoryPages];

                          if (allItems.length === 0) {
                            return (
                              <div className="p-6 text-center text-gray-400">
                                <div className="text-sm">No service pages available</div>
                              </div>
                            );
                          }

                          return (
                            <div className="p-2">
                              {subcategoryServices.map((service) => (
                                <button
                                  key={`tablet-service-${service.id}`}
                                  onClick={() => handlePageClick(service.slug, 'service')}
                                  className="w-full text-left p-3 rounded-lg hover:bg-blue-50 transition-colors group border-b border-gray-50"
                                >
                                  <div className="font-medium text-sm text-gray-700 group-hover:text-blue-700 truncate">
                                    {service.pageName || service.title}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    Admin Created Service
                                  </div>
                                </button>
                              ))}

                              {subcategoryPages.map((page) => (
                                <button
                                  key={`tablet-page-${page.id}`}
                                  onClick={() => handlePageClick(page.slug, 'page')}
                                  className="w-full text-left p-3 rounded-lg hover:bg-blue-50 transition-colors group border-b border-gray-50"
                                >
                                  <div className="font-medium text-sm text-gray-700 group-hover:text-blue-700 truncate">
                                    {page.title}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    Static Service Page
                                  </div>
                                </button>
                              ))}
                            </div>
                          );
                        })()
                      ) : (
                        <div className="p-6 text-center text-gray-400">
                          <div className="p-6 text-center text-gray-400">
                            <div className="text-sm">No service pages available</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Services Button and Menu */}
        {isMobile && (
          <div className="md:hidden">
            <button
              onClick={() => setInternalIsOpen(true)}
              className="flex items-center space-x-1 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 hover:bg-clip-text hover:text-transparent transition-colors font-medium text-base text-poppins"
              aria-label="Open services menu"
            >
              <span>Services</span>
              <Menu className="w-4 h-4" />
            </button>

            {/* Mobile Overlay */}
            {isOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => {
                setInternalIsOpen(false);
                onMenuClose?.();
              }}>
                <div className="bg-white h-full w-full max-w-sm ml-auto flex flex-col" onClick={(e) => e.stopPropagation()}>
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">SERVICES</h2>
                      <div className="flex items-center mt-1">
                        <ChevronDown className="w-3 h-3 text-gray-500 mr-1" />
                        <span className="text-xs text-gray-600">Tap to expand categories</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setInternalIsOpen(false);
                        onMenuClose?.();
                      }}
                      className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search services..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      />
                    </div>
                  </div>

                  {/* Accordion Navigation */}
                  <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                        <span className="ml-2 text-sm text-gray-500">Loading...</span>
                      </div>
                    ) : (
                      <div className="p-4 space-y-2">
                        {filteredCategories.map((category) => {
                          const categorySubcategories = subcategories.filter(
                            sub => sub.categoryId === category.id && sub.status === 'active'
                          );
                          const isExpanded = expandedCategories.has(category.id);

                          return (
                            <div key={category.id} className="mb-2">
                              <button
                                onClick={() => toggleCategory(category.id)}
                                className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 transition-all duration-200"
                              >
                                <span className="text-base font-semibold text-blue-600">{category.name}</span>
                                <ChevronDown className={cn("w-5 h-5 text-blue-600 transition-transform duration-200", isExpanded ? "rotate-180" : "")} />
                              </button>

                              {isExpanded && (
                                <div className="mt-2 ml-4 space-y-1">
                                  {categorySubcategories.map((subcategory) => {
                                    const subcategoryServices = getServicesForSubcategory(subcategory);
                                    const subcategoryPages = getPagesForSubcategory(subcategory.id);
                                    const allItems = [...subcategoryServices, ...subcategoryPages];
                                    const isSubExpanded = expandedSubcategories.has(subcategory.id);

                                    return (
                                      <div key={subcategory.id}>
                                        <button
                                          onClick={() => toggleSubcategory(subcategory.id)}
                                          className="w-full flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 transition-all duration-200"
                                        >
                                          <span className="text-sm font-medium text-gray-700">{subcategory.name}</span>
                                          <ChevronDown className={cn("w-4 h-4 text-blue-600 transition-transform duration-200", isSubExpanded ? "rotate-180" : "")} />
                                        </button>

                                        {isSubExpanded && (
                                          <div className="mt-2 ml-4 space-y-1">
                                            {allItems.map((item) => (
                                              <button
                                                key={item.id}
                                                onClick={() => handleMobilePageClick(
                                                  item.slug,
                                                  'pageName' in item ? 'service' : 'page'
                                                )}
                                                className="w-full text-left p-3 pl-6 rounded-md bg-white hover:bg-blue-50 transition-colors group border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-md"
                                              >
                                                <div className="flex items-start space-x-2">
                                                  <div className={cn(
                                                    "w-2 h-2 rounded-full mt-2 transition-colors",
                                                    'pageName' in item ? "bg-blue-400 group-hover:bg-blue-600" : "bg-purple-400 group-hover:bg-purple-600"
                                                  )}></div>
                                                  <div className="flex-1 min-w-0">
                                                    <div className={cn(
                                                      "font-medium text-sm transition-colors",
                                                      'pageName' in item ? "text-gray-800 group-hover:text-blue-700" : "text-gray-800 group-hover:text-purple-700"
                                                    )}>
                                                      {'pageName' in item ? (item.pageName || item.title) : item.title}
                                                    </div>
                                                    <div className={cn(
                                                      "text-xs mt-1 flex items-center transition-colors",
                                                      'pageName' in item ? "text-blue-600" : "text-purple-600"
                                                    )}>
                                                      <span className={cn(
                                                        "inline-block w-1 h-1 rounded-full mr-1",
                                                        'pageName' in item ? "bg-blue-400" : "bg-purple-400"
                                                      )}></span>
                                                      {'pageName' in item ? "Admin Created" : "Static Page"}
                                                    </div>
                                                  </div>
                                                </div>
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
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}