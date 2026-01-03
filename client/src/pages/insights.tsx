import { useState, useEffect } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Calendar, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { BLOG_CATEGORIES, BLOG_POSTS, getBlogsByCategory, getBlogsByTag } from "@/lib/blog-data";

export default function Insights() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedPosts, setDisplayedPosts] = useState(BLOG_POSTS);

  // Handle URL parameters for category filtering
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get("category");

    if (categoryParam && BLOG_CATEGORIES.some(cat => cat.value === categoryParam)) {
      setSelectedCategory(categoryParam);
      setDisplayedPosts(getBlogsByCategory(categoryParam));
    }
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    let filteredPosts = category === "all" ? BLOG_POSTS : getBlogsByCategory(category);

    if (searchTerm) {
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setDisplayedPosts(filteredPosts);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    let filteredPosts = selectedCategory === "all" ? BLOG_POSTS : getBlogsByCategory(selectedCategory);

    if (value) {
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(value.toLowerCase()) ||
        post.description.toLowerCase().includes(value.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(value.toLowerCase()))
      );
    }

    setDisplayedPosts(filteredPosts);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight heading-georgia">
                Latest{" "}
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Insights & Trends
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed mb-12 text-poppins">
                Stay ahead of the curve with our expert insights on emerging technologies, industry trends, and best practices in software development.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search articles, topics, or tags..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-full focus:border-purple-400 focus:ring-purple-400"
                  />
                </div>
              </div>

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

            {/* Results Count */}
            <div className="mb-8">
              <p className="text-gray-600 text-center text-poppins">
                {displayedPosts.length === 0 ? "No articles found" : `${displayedPosts.length} ${displayedPosts.length === 1 ? "article" : "articles"} found`}
                {searchTerm && ` for "${searchTerm}"`}
                {selectedCategory !== "all" && ` in ${BLOG_CATEGORIES.find(cat => cat.value === selectedCategory)?.name}`}
              </p>
            </div>

            {/* Blog Posts Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedPosts.map((post) => (
                <Card key={post.id} className="bg-white border border-gray-100 hover:border-purple-300/50 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="flex items-center justify-center h-56 bg-gray-100 text-gray-400">
                              <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          `;
                        }
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={`${post.categoryColor} font-medium text-poppins`}>
                        {BLOG_CATEGORIES.find(cat => cat.value === post.category)?.name || post.category}
                      </Badge>
                    </div>
                    {post.featured && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-medium text-poppins">
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 transition-colors duration-300 heading-georgia">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed text-poppins">{post.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs text-poppins">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500 text-poppins">
                        <Calendar className="mr-1 h-4 w-4" />
                        {post.date}
                      </div>
                      <Link href={`/blog/${post.slug}`} className="inline-flex items-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-semibold hover:opacity-80 transition-opacity text-sm text-poppins">
                        Read More
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results Message */}
            {displayedPosts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 heading-georgia">No articles found</h3>
                <p className="text-gray-600 mb-6 text-poppins">
                  Try adjusting your search terms or browse different categories.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setDisplayedPosts(BLOG_POSTS);
                  }}
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-poppins"
                >
                  Show All Articles
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
