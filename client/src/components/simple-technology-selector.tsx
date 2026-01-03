import { useState, useCallback, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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

interface SimpleTechnologySelectorProps {
  selectedTechnologyIds: number[];
  onTechnologyChange: (selectedIds: number[]) => void;
  onGenerateAIContent?: () => void;
  isGeneratingAI?: boolean;
  className?: string;
}

export function SimpleTechnologySelector({
  selectedTechnologyIds = [],
  onTechnologyChange,
  onGenerateAIContent,
  isGeneratingAI = false,
  className = ""
}: SimpleTechnologySelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>("AI/ML");
  const onTechnologyChangeRef = useRef(onTechnologyChange);
  onTechnologyChangeRef.current = onTechnologyChange;

  // Fetch all technologies from the database
  const { data: allTechnologies = [], isLoading } = useQuery({
    queryKey: ['/api/technologies'],
    queryFn: () => fetch('/api/technologies').then(res => res.json())
  });

  const activeTechnologies = useMemo(() => 
    allTechnologies.filter((tech: Technology) => tech.status === 'active'),
    [allTechnologies]
  );
  
  // Group technologies by category - memoized to prevent infinite loops
  const groupedTechnologies = useMemo(() => {
    return activeTechnologies.reduce((acc: Record<string, Technology[]>, tech: Technology) => {
      if (!acc[tech.category]) {
        acc[tech.category] = [];
      }
      acc[tech.category].push(tech);
      return acc;
    }, {});
  }, [activeTechnologies]);

  const categories = useMemo(() => Object.keys(groupedTechnologies), [groupedTechnologies]);
  
  const selectedTechnologies = useMemo(() => 
    activeTechnologies.filter((tech: Technology) => selectedTechnologyIds.includes(tech.id)),
    [activeTechnologies, selectedTechnologyIds]
  );

  const handleTechnologyToggle = useCallback((techId: number) => {
    const newSelectedIds = selectedTechnologyIds.includes(techId)
      ? selectedTechnologyIds.filter(id => id !== techId)
      : [...selectedTechnologyIds, techId];
    
    onTechnologyChangeRef.current(newSelectedIds);
  }, [selectedTechnologyIds]);

  const handleSelectAll = useCallback(() => {
    const categoryTechIds = groupedTechnologies[activeCategory]?.map((tech: Technology) => tech.id) || [];
    const newSelectedIds = Array.from(new Set([...selectedTechnologyIds, ...categoryTechIds]));
    onTechnologyChangeRef.current(newSelectedIds);
  }, [groupedTechnologies, activeCategory, selectedTechnologyIds]);

  const handleDeselectAll = useCallback(() => {
    const categoryTechIds = groupedTechnologies[activeCategory]?.map((tech: Technology) => tech.id) || [];
    const newSelectedIds = selectedTechnologyIds.filter(id => !categoryTechIds.includes(id));
    onTechnologyChangeRef.current(newSelectedIds);
  }, [groupedTechnologies, activeCategory, selectedTechnologyIds]);

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
              <Badge variant="secondary">{selectedTechnologyIds.length} selected</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Choose technologies to include in AI-generated content.
            </p>
          </div>
          {onGenerateAIContent && (
            <Button
              onClick={onGenerateAIContent}
              disabled={isGeneratingAI || selectedTechnologyIds.length === 0}
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
        {selectedTechnologyIds.length > 0 && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg border">
            <Label className="text-sm font-medium text-green-800 mb-2 block">
              Selected Technologies ({selectedTechnologyIds.length})
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

        {/* Category Selection */}
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">Technology Categories</Label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                data-testid={`category-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Active Category Management */}
        {activeCategory && groupedTechnologies[activeCategory] && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">
                {activeCategory} Technologies
              </h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  data-testid={`button-select-all-${activeCategory.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeselectAll}
                  data-testid={`button-deselect-all-${activeCategory.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                >
                  <X className="w-3 h-3 mr-1" />
                  Deselect All
                </Button>
              </div>
            </div>

            {/* Technology Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {groupedTechnologies[activeCategory].map((tech: Technology) => {
                const isSelected = selectedTechnologyIds.includes(tech.id);
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
          </div>
        )}

        {selectedTechnologyIds.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No technologies selected.</p>
            <p className="text-xs">Choose technologies from the categories above to generate AI content.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SimpleTechnologySelector;