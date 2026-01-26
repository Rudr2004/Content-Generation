import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Edit2, ExternalLink, Eye, Calendar, Hash, Tag, Star } from 'lucide-react';
import type { HirePage } from '@shared/schema';
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { COMPANY_INFO } from "@/lib/constants";

interface HireDeveloperPageViewProps {
  page: HirePage;
  onEdit: () => void;
}

export function HireDeveloperPageView({ page, onEdit }: HireDeveloperPageViewProps) {
  const { settings } = useSiteSettings();
  const siteName = settings?.siteName || COMPANY_INFO.name;
  const secondaryKeywords = page.secondaryKeywords?.split(', ') || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Published</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{page.title}</h1>
            {getStatusBadge(page.status)}
            {page.featured && (
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex items-center gap-1">
                <Star className="h-3 w-3" />
                Featured
              </Badge>
            )}
          </div>
          <p className="text-gray-600">/{page.slug}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Created: {new Date(page.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Updated: {new Date(page.updatedAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Hash className="h-4 w-4" />
              Order: {(page as any).displayOrder || 'Not set'}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Live
          </Button>
          <Button onClick={onEdit} size="sm">
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Page
          </Button>
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Title</h4>
            <p className="text-gray-600">{page.title}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-1">Slug</h4>
            <p className="text-gray-600">/{page.slug}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-1">Status</h4>
            {getStatusBadge(page.status)}
          </div>
        </CardContent>
      </Card>

      {/* SEO Information */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Meta Title</h4>
              <p className="text-gray-600">{page.metaTitle || 'Not set'}</p>
              {page.metaTitle && (
                <p className="text-xs text-gray-400 mt-1">{page.metaTitle.length}/60 characters</p>
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Primary Keyword</h4>
              <p className="text-gray-600">{page.primaryKeyword || 'Not set'}</p>
            </div>
          </div>

          {page.metaDescription && (
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Meta Description</h4>
              <p className="text-gray-600">{page.metaDescription}</p>
              <p className="text-xs text-gray-400 mt-1">{page.metaDescription.length}/160 characters</p>
            </div>
          )}

          {secondaryKeywords.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Secondary Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {secondaryKeywords.map((keyword, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {page.metaKeywords && (
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Meta Keywords</h4>
              <p className="text-gray-600 text-sm">{page.metaKeywords}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Sections */}
      <div className="space-y-6">
        {/* Hero Description */}
        {page.heroDescription && (
          <Card>
            <CardHeader>
              <CardTitle>Hero Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: page.heroDescription }}
              />
            </CardContent>
          </Card>
        )}

        {/* Why Hire Description */}
        {page.whyHireDescription && (
          <Card>
            <CardHeader>
              <CardTitle>Why Hire From {siteName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: page.whyHireDescription }}
              />
            </CardContent>
          </Card>
        )}

        {/* Services Description */}
        {page.servicesDescription && (
          <Card>
            <CardHeader>
              <CardTitle>Services Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: page.servicesDescription }}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}