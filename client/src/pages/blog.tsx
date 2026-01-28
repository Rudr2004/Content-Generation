import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  Calendar,
  Clock,
  ArrowLeft,
  MessageCircle,
  Filter,
  User,
  Share2,
  BookmarkPlus,
  List,
  FileText,
  Heart,
  Eye
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { SEOHead } from "@/components/seo-head";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { SafeImage } from "@/components/ui/safe-image";
import { parseMarkdownToHtml, parseMarkdownLinks, cleanTitleText } from "@/lib/markdown-utils";
import { HomeContactSection } from "@/components/contact-form-light";

// BlogCard component that fetches author information
function BlogCard({ post, onPostClick }: { post: any, onPostClick: () => void }) {
  // Fetch author information
  const { data: author } = useQuery({
    queryKey: ["/api/authors", post.authorId],
    queryFn: async () => {
      if (!post.authorId) return null;
      const response = await fetch(`/api/authors/${post.authorId}`);
      if (!response.ok) return null;
      const data = await response.json();
      return data.author;
    },
    enabled: !!post.authorId,
  });

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer" 
      onClick={onPostClick}
      style={{
        backgroundColor: 'var(--blog-card-bg, #ffffff)',
        borderColor: 'var(--blog-border, #e5e7eb)'
      }}
    >
      {post.imageUrl && (
        <div className="aspect-video overflow-hidden rounded-t-lg bg-gray-100 flex items-center justify-center">
          <img
            src={post.imageUrl}
            alt={post.imageAlt || post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="flex items-center justify-center h-full text-gray-400">
                    <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                `;
              }
            }}
          />
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags?.slice(0, 2).map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <h3
          className="text-xl font-bold mb-3 heading-georgia line-clamp-2"
          style={{ color: 'var(--blog-text, #111827)' }}
          onClick={(e) => {
            // Stop propagation if clicking a link inside the title
            if ((e.target as HTMLElement).closest('a')) {
              e.stopPropagation();
            }
          }}
          dangerouslySetInnerHTML={{
            __html: parseMarkdownLinks(post.title || '')
          }}
        />
        <p
          className="mb-4 text-poppins line-clamp-3 leading-relaxed"
          style={{ color: 'var(--blog-text, #4b5563)' }}
          dangerouslySetInnerHTML={{
            __html: parseMarkdownToHtml(post.excerpt || post.content?.replace(/<[^>]*>/g, '').substring(0, 150) + '...' || '')
          }}
        />
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-3">
            {author?.image ? (
              <SafeImage
                src={author.image}
                alt={author.name}
                className="w-8 h-8 rounded-full object-cover"
                fallbackClassName="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                {author?.name ? author.name.charAt(0) : "GA"}
              </div>
            )}
            <div>
              <div className="font-medium text-poppins">
                {author?.name || "GreenAppleX Team"}
              </div>
              <div className="text-xs text-poppins">
                {format(new Date(post.publishedAt || post.createdAt), 'MMM d, yyyy')}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-poppins"></span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const BLOG_CATEGORIES = [
  { value: "all", name: "All Articles" },
  { value: "Web3", name: "Web3" },
  { value: "AI and Machine Learning", name: "AI and Machine Learning" },
  { value: "Mobile Development", name: "Mobile Development" },
  { value: "Software Engineering", name: "Software Engineering" },
  { value: "Digital Transformation", name: "Digital Transformation" },
];

export default function Blog() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  // Extract slug from URL
  const slug = location.startsWith('/blog/') && !location.includes('?') ? location.replace('/blog/', '') : null;

  // Get category from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');

  // Fetch published blog posts
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["/api/blog/public"],
    queryFn: async () => {
      const response = await fetch("/api/blog/public");
      return response.json();
    },
  });

  // Fetch single blog post by slug
  const { data: singlePost } = useQuery({
    queryKey: ["/api/blog/public", slug],
    queryFn: async () => {
      if (!slug) return null;
      const response = await fetch(`/api/blog/public/${slug}`);
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!slug,
  });

  // If viewing a specific blog post
  if (slug && singlePost) {
    return <BlogPostView post={singlePost} />;
  }

  // Blog listing page
  return <BlogListingView posts={posts} isLoading={isLoading} initialCategory={categoryParam} />;
}

// Component for viewing a single blog post
function BlogPostView({ post }: { post: any }) {
  const [, setLocation] = useLocation();
  const [readingProgress, setReadingProgress] = useState(0);
  const [tocItems, setTocItems] = useState<{ id: string, title: string, level: number }[]>([]);

  // Fetch author information
  const { data: author } = useQuery({
    queryKey: ["/api/authors", post.authorId],
    queryFn: async () => {
      if (!post.authorId) return null;
      const response = await fetch(`/api/authors/${post.authorId}`);
      if (!response.ok) return null;
      const data = await response.json();
      return data.author;
    },
    enabled: !!post.authorId,
  });

  // Calculate reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  // Extract table of contents from content and add IDs to headings
  useEffect(() => {
    const content = post.content || '';
    const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/g;
    const headings: { id: string, title: string, level: number }[] = [];
    let match;

    // Reset regex lastIndex
    headingRegex.lastIndex = 0;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = parseInt(match[1]);
      let title = match[2].replace(/<[^>]*>/g, ''); // Remove any HTML tags
      title = cleanTitleText(title); // Remove markdown link syntax and clean the title
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      headings.push({ id, title, level });
    }

    setTocItems(headings);
    // Don't mutate the post object - it causes infinite re-renders
  }, [post.content]);

  // Reading progress indicator
  useEffect(() => {
    const updateReadingProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', updateReadingProgress);
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

  const readingTime = calculateReadingTime(post.content || '');

  return (
    <>
      <SEOHead
        title={`${cleanTitleText(post.title || '')} | GreenAppleX Blog`}
        description={post.excerpt || post.content?.replace(/<[^>]*>/g, '').substring(0, 155)}
        keywords={post.tags || ["Blog", "Technology", "GreenAppleX"]}
        canonicalUrl={`https://www.greenapplex.com/blog/${post.slug}`}
      />

      <Navigation />

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full transition-all duration-300 ease-out"
          style={{
            background: 'linear-gradient(to right, var(--gradient-start, #3b82f6), var(--gradient-middle, #8b5cf6), var(--gradient-end, #ec4899))',
            width: `${readingProgress}%`
          }}
        />
      </div>

      <div 
        className="min-h-screen"
        style={{
          background: 'linear-gradient(to bottom right, var(--blog-card-bg, #f8fafc), var(--blog-card-bg, #ffffff), var(--blog-card-bg, #eff6ff))'
        }}
      >
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <Button
                  variant="ghost"
                  onClick={() => setLocation('/blog')}
                  className="mb-4 text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all duration-300 -ml-2"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Button>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags?.map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Title */}
                <h1
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight heading-georgia"
                  dangerouslySetInnerHTML={{
                    __html: parseMarkdownLinks(post.title || '')
                  }}
                />

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xs">
                      {author?.name ? author.name.charAt(0) : "GA"}
                    </div>
                    <span className="font-medium">{author?.name || "GreenAppleX Team"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{readingTime} min read</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(post.publishedAt || post.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 hidden lg:block">Share:</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="w-10 h-10 p-0">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="w-10 h-10 p-0">
                    <BookmarkPlus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.imageUrl && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="relative group overflow-hidden rounded-2xl shadow-xl">
              <img
                src={post.imageUrl}
                alt={post.imageAlt || post.title}
                className="w-full h-[400px] md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            </div>
          </div>
        )}

        {/* Main Content Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of Contents - Desktop Sidebar */}
            {tocItems.length > 0 && (
              <div className="lg:col-span-1 order-2 lg:order-1">
                <div className="sticky top-24">
                  <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <List className="h-4 w-4" />
                        Table of Contents
                      </h3>
                      <nav className="space-y-2">
                        {tocItems.map((item) => (
                          <a
                            key={item.id}
                            href={`#${item.id}`}
                            className="block text-sm transition-colors py-1 border-l-2 border-transparent"
                            style={{
                              color: 'var(--blog-text, #4b5563)',
                              paddingLeft: `${(item.level - 1) * 12 + 8}px`
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = 'var(--blog-link, #2563eb)';
                              e.currentTarget.style.borderLeftColor = 'var(--blog-link, #2563eb)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = 'var(--blog-text, #4b5563)';
                              e.currentTarget.style.borderLeftColor = 'transparent';
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              const element = document.getElementById(item.id);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                // Update URL hash without triggering navigation
                                window.history.pushState(null, '', `#${item.id}`);
                              }
                            }}
                          >
                            {item.title}
                          </a>
                        ))}
                      </nav>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Article Content */}
            <div className={`order-1 lg:order-2 ${tocItems.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
              {/* Article Summary */}
              {post.excerpt && (
                <Card className="mb-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 border border-blue-200 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-1 h-20 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full flex-shrink-0"></div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-3 heading-georgia flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          Article Summary
                        </h2>
                        <p
                          className="text-lg text-gray-700 leading-relaxed text-poppins"
                          dangerouslySetInnerHTML={{
                            __html: parseMarkdownToHtml(post.excerpt || '')
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Main Article Content */}
              <Card className="bg-white shadow-xl border-0 overflow-hidden mb-8">
                <CardContent className="p-0">
                  <article className="prose prose-lg prose-blue max-w-none">
                    <div
                      className="px-8 sm:px-12 py-8 text-gray-800 leading-[1.7] text-poppins 
                      prose-headings:heading-georgia prose-headings:font-bold prose-headings:text-gray-900 
                      prose-headings:mb-4 prose-headings:mt-6 first:prose-headings:mt-0
                      prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8 
                      prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2
                      prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-5 
                      prose-h4:text-lg prose-h4:mb-3 prose-h4:mt-4
                      prose-p:mb-4 prose-p:text-base prose-p:leading-[1.7] prose-p:text-gray-700
                      prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-a:transition-colors
                      prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-gradient-to-r 
                      prose-blockquote:from-blue-50 prose-blockquote:to-purple-50 prose-blockquote:p-6 
                      prose-blockquote:rounded-r-xl prose-blockquote:my-6 prose-blockquote:italic prose-blockquote:text-gray-700
                      prose-code:bg-blue-50 prose-code:text-blue-800 prose-code:px-2 prose-code:py-1 prose-code:rounded-md 
                      prose-code:text-sm prose-code:font-mono prose-code:border prose-code:border-blue-200
                      prose-pre:bg-gray-900 prose-pre:text-white prose-pre:p-6 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:my-6
                      prose-img:rounded-xl prose-img:shadow-lg prose-img:my-6 prose-img:border prose-img:border-gray-200
                      prose-ul:my-4 prose-ul:space-y-2 prose-ol:my-4 prose-ol:space-y-2 prose-li:my-1 prose-li:text-gray-700
                      prose-strong:font-semibold prose-strong:text-gray-900
                      prose-table:border-collapse prose-table:border prose-table:border-gray-300 prose-table:my-6
                      prose-th:border prose-th:border-gray-300 prose-th:bg-gray-50 prose-th:px-4 prose-th:py-2
                      prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2"
                      dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(post.content || '') }}
                    />
                  </article>
                </CardContent>
              </Card>


              {/* Author Bio Section */}
              {author && (
                <Card className="mb-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 border border-blue-200 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-4"></div>
                      <h3 className="text-xl font-bold text-gray-900 heading-georgia">About the Author</h3>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                      {author.image ? (
                        <SafeImage
                          src={author.image}
                          alt={author.name}
                          className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-lg flex-shrink-0"
                          fallbackClassName="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                          {author.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-2 heading-georgia">{author.name}</h4>
                        {author.title && (
                          <p className="text-blue-600 font-medium mb-3 text-sm">{author.title}</p>
                        )}
                        <p className="text-gray-700 leading-relaxed text-sm">
                          {author.bio || `${author.name} is a technology expert and writer at GreenAppleX, specializing in cutting-edge solutions for enterprise digital transformation.`}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        <HomeContactSection />
        <Footer />
      </div>
    </>
  );
}

// Component for blog listing
function BlogListingView({ posts, isLoading, initialCategory }: { posts: any[], isLoading: boolean, initialCategory?: string | null }) {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "all");

  // Filter posts based on selected category
  const filteredPosts = selectedCategory === "all"
    ? posts
    : posts.filter((post: any) => post.tags?.includes(selectedCategory));

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Update URL without navigation
    const newUrl = category === "all" ? "/blog" : `/blog?category=${encodeURIComponent(category)}`;
    window.history.pushState({}, '', newUrl);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-poppins">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Blog - Latest Insights & Tech Trends | GreenAppleX"
        description="Explore the latest insights on AI, Web3, mobile development, and digital transformation from the GreenAppleX team."
        keywords={["Blog", "Tech Insights", "AI", "Web3", "Mobile Development", "Digital Transformation", "GreenAppleX"]}
        canonicalUrl="https://www.greenapplex.com/blog"
      />

      <Navigation />

      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-white pt-24 pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight heading-georgia">
                GreenAppleX Blog
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-poppins">
                Discover insights on AI, Web3, mobile development, and digital transformation from our team of experts.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {BLOG_CATEGORIES.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(category.value)}
                  className="transition-all duration-300"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg text-poppins">
                {selectedCategory === "all"
                  ? "No blog posts available yet."
                  : `No posts found in "${selectedCategory}" category.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post: any) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  onPostClick={() => setLocation(`/blog/${post.slug}`)}
                />
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}