import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { format } from "date-fns";
import { SafeImage } from "@/components/ui/safe-image";

const BLOG_CATEGORIES = [
  { value: "all", name: "All Articles" },
  { value: "Web3", name: "Web3" },
  { value: "AI and Machine Learning", name: "AI and Machine Learning" },
  { value: "Mobile Development", name: "Mobile Development" },
  { value: "Software Engineering", name: "Software Engineering" },
  { value: "Digital Transformation", name: "Digital Transformation" },
];

type Author = {
  id: number | string;
  name: string;
  image?: string;
};

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  imageUrl?: string;
  imageAlt?: string;
  authorId?: number | string;
  publishedAt?: string;
  createdAt: string;
};

export function InsightsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Fetch published blog posts
  const { data: allPosts = [], isLoading: postsLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/public"],
    queryFn: async () => {
      const res = await fetch("/api/blog/public");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });

  // Fetch authors
  const { data: authorsData = [], isLoading: authorsLoading } = useQuery<Author[]>({
    queryKey: ["/api/authors"],
    queryFn: async () => {
      const res = await fetch("/api/authors");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });

  const authors: Author[] = authorsData || [];

  // Get author info safely
  const getAuthorById = (authorId?: number | string) => {
    if (!authorId || !Array.isArray(authors)) return null;
    return authors.find((author) => author.id === authorId) || null;
  };

  // Filter posts based on category
  const displayedPosts = selectedCategory === "all"
    ? allPosts.slice(0, 6)
    : allPosts.filter((post) => post.tags?.includes(selectedCategory)).slice(0, 6);

  const handleCategoryChange = (category: string) => setSelectedCategory(category);

  if (postsLoading || authorsLoading) {
    return (
      <section id="insights" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-poppins">Loading insights...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="insights" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight heading-georgia">
            Latest{" "}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Insights & Trends
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed mb-12 text-poppins">
            Stay ahead of the curve with our expert insights on emerging technologies, industry trends, and best practices in software development.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {BLOG_CATEGORIES.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                onClick={() => handleCategoryChange(category.value)}
                className={`${selectedCategory === category.value
                    ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  } px-6 py-2 rounded-full font-medium transition-all duration-300 text-poppins`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {displayedPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500">
              <h3 className="text-xl font-semibold mb-2 heading-georgia">No blog posts yet</h3>
              <p className="text-poppins">Check back soon for the latest insights and updates from our team.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedPosts.map((post) => {
                const author = getAuthorById(post.authorId);
                return (
                  <Card key={post.id} className="bg-white border border-gray-100 hover:border-purple-300/50 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden">
                    <div className="relative overflow-hidden">
                      <img
                        src={post.imageUrl || "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop"}
                        alt={post.imageAlt || post.title}
                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-blue-100 text-blue-800 font-medium text-poppins">
                          {post.tags?.[0] || "Technology"}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 transition-colors duration-300 heading-georgia">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed text-poppins">
                        {post.excerpt || post.content?.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                      </p>

                      {/* Author Info */}
                      <div className="flex items-center mb-4 pb-4 border-b border-gray-100">
                        <div className="flex-shrink-0 mr-3">
                          {author?.image ? (
                            <SafeImage
                              src={author.image}
                              alt={author.name}
                              className="w-10 h-10 rounded-full object-cover"
                              fallback={
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                  <User className="h-5 w-5 text-white" />
                                </div>
                              }
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 text-poppins">
                            {author?.name || 'Unknown Author'}
                          </p>
                          <p className="text-xs text-gray-500 text-poppins">Author</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500 text-poppins">
                          <Calendar className="mr-1 h-4 w-4" />
                          {format(new Date(post.publishedAt || post.createdAt), 'MMM d, yyyy')}
                        </div>
                        <Link href={`/blog/${post.slug}`} className="inline-flex items-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-semibold hover:opacity-80 transition-opacity text-sm text-poppins">
                          Read More <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* View More Button */}
            <div className="text-center mt-12">
              <Link href="/blog">
                <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  View More Insights
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
