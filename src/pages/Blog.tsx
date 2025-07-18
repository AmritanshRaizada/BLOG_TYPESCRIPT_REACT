import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import HeroBackground from './HeroBackground';
import Navbar from './Navbar';

interface Blog {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
  author_id: string;
  author: string;
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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500/50 border-t-purple-500 rounded-full animate-spin mx-auto" />
          <p className="text-xl text-purple-200">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      {/* Header with HeroBackground */}
      <div className="relative overflow-hidden hero-section" style={{ marginTop: '8.5vh' }}>
        <HeroBackground />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="w-full text-center">
              <h1 className="text-4xl font-bold md:text-5xl mb-4 text-white">
                BLOGS
              </h1>
              <p className="text-xl text-purple-200 max-w-2xl mx-auto">
                We keep you posted on our development   
              </p>
            </div>

            {user && (
              <Button
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-[#4F5BFF] to-[#171a48] hover:from-[#5F6BFF] hover:to-[#272a58] text-white shadow-lg shadow-[#4F5BFF]/20"
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
                  className="bg-gray-900/50 border border-gray-800 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10 overflow-hidden group"
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
                    <div className="flex justify-between items-center text-sm text-blue-400">
                      <span>Published By: {blog.author || 'Admin'}</span>

                    </div>
                    <CardTitle className="text-xl text-white transition-colors mt-2">
                      {blog.title}
                    </CardTitle>
                    <CardDescription className="text-white">
                      {blog.description}
                    </CardDescription>

                    <div className="flex justify-between items-center mt-4">
                      <Link
                        to={`/blog/${blog.id}`}
                        className="text-sm text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-600 hover:text-white transition"
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
                    className={`border px-3 py-1 rounded ${
                      page === currentPage 
                        ? 'bg-blue-900 text-white' 
                        : 'bg-white text-black'
                    } hover:bg-blue-700 hover:text-white transition`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 border border-dashed border-gray-800 rounded-xl bg-gray-900/20">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-medium text-blue-200 mb-2">No articles yet</h3>
              <p className="text-blue-300/70 mb-6">We're working on some great content for you</p>
              {!user && (
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-[#4F5BFF] to-[#171a48] hover:from-[#5F6BFF] hover:to-[#272a58]"
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
