import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import HeroBackground from './HeroBackground';

interface Blog {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
  author_id: string;
  author?: string; // Make author optional
}

const Blog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Type assertion with proper error handling
      const blogData = data as Blog[];
      setBlogs(blogData || []);
      
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]); // Ensure empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blogs'
        },
        () => {
          fetchBlogs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel).catch(console.error);
    };
  }, []);

  // Pagination calculations
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-950 to-black">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-400 rounded-full animate-spin mx-auto" />
            <div className="absolute inset-0 w-12 h-12 border-4 border-green-500/30 border-b-green-400 rounded-full animate-spin mx-auto mt-2 ml-2" 
                 style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <p className="text-xl text-purple-200 font-medium">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white">
      {/* Header with HeroBackground */}
      <div className="relative overflow-hidden hero-section">
        <HeroBackground />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-black/60" />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="w-full text-center">
              <h1 className="text-5xl font-bold md:text-6xl mb-6 bg-gradient-to-r from-purple-400 via-green-400 to-purple-400 bg-clip-text text-transparent">
                BLOGS
              </h1>
              <p className="text-xl text-purple-200 max-w-2xl mx-auto">
                We keep you posted on our development   
              </p>
            </div>

            {user && (
              <Button
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-105"
              >
                Go to Dashboard
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="container mx-auto px-6 py-16">
        {blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentBlogs.map((blog) => (
                <Card 
                  key={blog.id} 
                  className="bg-gradient-to-b from-purple-900/30 to-black/60 border border-purple-800/50 hover:border-green-500/60 transition-all duration-500 hover:shadow-xl hover:shadow-green-500/20 overflow-hidden group backdrop-blur-sm"
                >
                  {blog.image_url && (
                    <div className="aspect-video overflow-hidden relative">
                      <img
                        src={blog.image_url}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-center text-sm text-green-400">
                      <span className="bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
                        Published By: {blog.author || 'Admin'}
                      </span>
                    </div>
                    <CardTitle className="text-xl text-white transition-colors mt-2 group-hover:text-green-300">
                      {blog.title}
                    </CardTitle>
                    <CardDescription className="text-purple-200">
                      {blog.description}
                    </CardDescription>
                    
                    <div className="flex justify-between items-center mt-4">
                      <Link
                        to={`/blog/${blog.id}`}
                        className="text-sm text-green-400 border border-green-400/50 px-3 py-1 rounded-full hover:bg-green-400 hover:text-black transition-all duration-300"
                      >
                        Read More
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent />
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                      page === currentPage 
                        ? 'bg-gradient-to-r from-purple-600 to-green-600 text-white shadow-lg shadow-purple-500/30' 
                        : 'bg-purple-900/30 text-purple-200 border border-purple-700/50 hover:bg-purple-700/50 hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 border border-dashed border-purple-800/50 rounded-xl bg-gradient-to-b from-purple-900/20 to-black/40 backdrop-blur-sm">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-medium text-purple-200 mb-2">No articles yet</h3>
              <p className="text-purple-300/70 mb-6">We're working on some great content for you</p>
              {!user && (
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 transition-all duration-300"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;