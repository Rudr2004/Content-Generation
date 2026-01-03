import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Sparkles, Plus, X, Check } from "lucide-react";

interface Technology {
  id: number;
  name: string;
  category: string;
  iconType: string;
  iconData?: string;
  iconColor?: string;
  description?: string;
  status: string;
  displayOrder: number;
}

interface ServiceTechnologySelectorProps {
  serviceCategory?: string;
  selectedTechnologyIds?: number[];
  onTechnologyChange: (selectedIds: number[]) => void;
  onGenerateAIContent?: () => void;
  isGeneratingAI?: boolean;
  className?: string;
}

// Service category to technology category mapping
const serviceToTechnologyMapping: Record<string, string[]> = {
  "AI & Machine Learning": ["AI/ML", "Backend", "Database", "Cloud"],
  "Web3 & Blockchain": ["Blockchain", "Frontend", "Backend", "Database"],
  "Mobile Development": ["Mobile", "Backend", "Database", "Cloud"],
  "Web Development": ["Frontend", "Backend", "Database", "Cloud"],
  "Enterprise Solutions": ["Backend", "Database", "DevOps", "Frontend"],
  "Cloud & DevOps": ["DevOps", "Database", "Backend", "Cloud"],
  "Design & UX": ["Frontend", "Mobile"],
  "Automation & Testing": ["Testing", "DevOps", "Backend"]
};

export function ServiceTechnologySelector({
  serviceCategory = "",
  selectedTechnologyIds = [],
  onTechnologyChange,
  onGenerateAIContent,
  isGeneratingAI = false,
  className = ""
}: ServiceTechnologySelectorProps) {
  const [localSelectedIds, setLocalSelectedIds] = useState<number[]>(selectedTechnologyIds);

  // Fetch all technologies from the database
  const { data: allTechnologies = [], isLoading } = useQuery({
    queryKey: ['/api/technologies'],
    queryFn: () => fetch('/api/technologies').then(res => res.json())
  });

  // Calculate suggested categories based on service category
  const suggestedCategories = useMemo(() => {
    const categoryKey = serviceCategory || "Web Development";
    return serviceToTechnologyMapping[categoryKey] || ["Frontend", "Backend", "Database"];
  }, [serviceCategory]);

  // Sync with parent state changes
  useEffect(() => {
    setLocalSelectedIds(selectedTechnologyIds);
  }, [selectedTechnologyIds.join(',')]);

  // Auto-select suggested technologies only when initializing
  useEffect(() => {
    if (selectedTechnologyIds.length === 0 && allTechnologies.length > 0) {
      const suggestedTechs = allTechnologies
        .filter((tech: Technology) => 
          tech.status === 'active' && 
          suggestedCategories.includes(tech.category)
        )
        .slice(0, 6)
        .map((tech: Technology) => tech.id);
      
      if (suggestedTechs.length > 0) {
        setLocalSelectedIds(suggestedTechs);
        onTechnologyChange(suggestedTechs);
      }
    }
  }, [allTechnologies.length, suggestedCategories.join(','), selectedTechnologyIds.length]);

  // Filter technologies based on status and group by category
  const activeTechnologies = allTechnologies.filter((tech: Technology) => tech.status === 'active');
  const groupedTechnologies = activeTechnologies.reduce((acc: Record<string, Technology[]>, tech: Technology) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {});

  // Sort categories to show suggested ones first
  const sortedCategories = Object.keys(groupedTechnologies).sort((a, b) => {
    const aIsSuggested = suggestedCategories.includes(a);
    const bIsSuggested = suggestedCategories.includes(b);
    if (aIsSuggested && !bIsSuggested) return -1;
    if (!aIsSuggested && bIsSuggested) return 1;
    return a.localeCompare(b);
  });

  const handleTechnologyToggle = (techId: number) => {
    const newSelectedIds = localSelectedIds.includes(techId)
      ? localSelectedIds.filter(id => id !== techId)
      : [...localSelectedIds, techId];
    
    setLocalSelectedIds(newSelectedIds);
    onTechnologyChange(newSelectedIds);
  };

  const handleSelectAll = (category: string) => {
    const categoryTechIds = groupedTechnologies[category].map((tech: Technology) => tech.id);
    const newSelectedIds = Array.from(new Set([...localSelectedIds, ...categoryTechIds]));
    setLocalSelectedIds(newSelectedIds);
    onTechnologyChange(newSelectedIds);
  };

  const handleDeselectAll = (category: string) => {
    const categoryTechIds = groupedTechnologies[category].map((tech: Technology) => tech.id);
    const newSelectedIds = localSelectedIds.filter(id => !categoryTechIds.includes(id));
    setLocalSelectedIds(newSelectedIds);
    onTechnologyChange(newSelectedIds);
  };

  const selectedTechnologies = allTechnologies.filter((tech: Technology) => 
    localSelectedIds.includes(tech.id)
  );

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Loading Technologies...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span>🛠️ Technology Stack Selection</span>
              <Badge variant="secondary">{localSelectedIds.length} selected</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Choose technologies for AI content generation. Suggested categories are shown first.
            </p>
          </div>
          {onGenerateAIContent && (
            <Button
              onClick={onGenerateAIContent}
              disabled={isGeneratingAI || localSelectedIds.length === 0}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              data-testid="button-generate-ai-content"
            >
              {isGeneratingAI ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate AI Content
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Selected Technologies Summary */}
        {localSelectedIds.length > 0 && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg border">
            <Label className="text-sm font-medium text-green-800 mb-2 block">
              Selected Technologies ({localSelectedIds.length})
            </Label>
            <div className="flex flex-wrap gap-2">
              {selectedTechnologies.slice(0, 10).map((tech: Technology) => (
                <Badge 
                  key={tech.id} 
                  variant="secondary" 
                  className="bg-green-100 text-green-800 hover:bg-green-200"
                  data-testid={`selected-tech-${tech.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                >
                  {tech.iconData && (
                    <span className="mr-1" style={{ color: tech.iconColor }}>
                      {tech.iconData}
                    </span>
                  )}
                  {tech.name}
                  <button
                    onClick={() => handleTechnologyToggle(tech.id)}
                    className="ml-1 hover:bg-green-300 rounded-full p-0.5"
                    data-testid={`remove-tech-${tech.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {selectedTechnologies.length > 10 && (
                <Badge variant="outline">
                  +{selectedTechnologies.length - 10} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Technology Selection Tabs */}
        <Tabs defaultValue={sortedCategories[0]} className="w-full">
          <TabsList className="grid w-full overflow-x-auto" style={{ gridTemplateColumns: `repeat(${Math.min(sortedCategories.length, 6)}, 1fr)` }}>
            {sortedCategories.slice(0, 6).map((category) => (
              <TabsTrigger 
                key={category} 
                value={category} 
                className="text-xs whitespace-nowrap"
                data-testid={`tab-category-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              >
                {category}
                {suggestedCategories.includes(category) && (
                  <Badge variant="outline" className="ml-1 text-xs bg-blue-50 text-blue-600">
                    Suggested
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {sortedCategories.map((category) => {
            const techs = groupedTechnologies[category] || [];
            const selectedInCategory = techs.filter((tech: Technology) => localSelectedIds.includes(tech.id)).length;
            
            return (
              <TabsContent key={category} value={category} className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium">
                      {category} Technologies
                    </h4>
                    <Badge variant="outline">
                      {selectedInCategory}/{techs.length} selected
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectAll(category)}
                      disabled={selectedInCategory === techs.length}
                      data-testid={`button-select-all-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Select All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeselectAll(category)}
                      disabled={selectedInCategory === 0}
                      data-testid={`button-deselect-all-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    >
                      <X className="w-3 h-3 mr-1" />
                      Deselect All
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {techs.map((tech: Technology) => {
                    const isSelected = localSelectedIds.includes(tech.id);
                    return (
                      <div
                        key={tech.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200' 
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleTechnologyToggle(tech.id)}
                        data-testid={`tech-option-${tech.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleTechnologyToggle(tech.id)}
                            className="pointer-events-none"
                          />
                          {tech.iconData && (
                            <span 
                              className="text-lg"
                              style={{ color: tech.iconColor }}
                            >
                              {tech.iconData}
                            </span>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {tech.name}
                            </p>
                            {tech.description && (
                              <p className="text-xs text-gray-500 truncate" title={tech.description}>
                                {tech.description}
                              </p>
                            )}
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>

        {localSelectedIds.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No technologies selected.</p>
            <p className="text-xs">Choose technologies from the categories above to generate AI content.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}