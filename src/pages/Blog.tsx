'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ShareCard from '../components/ui/sharedcard';
import Navbar from './Navbar';
import Footer from './Footer';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import HeroBackground from './HeroBackground';
import { Share2 } from 'lucide-react';

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
  const [shareBlogId, setShareBlogId] = useState<string | null>(null);
  const blogsPerPage = 6;

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data as Blog[]);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
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
          table: 'blogs',
        },
        () => fetchBlogs()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel).catch(console.error);
    };
  }, []);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const getShareUrl = (blogId: string) =>
    `${window.location.origin}/blog/${blogId}`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e8e8e8]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500/50 border-t-purple-500 rounded-full animate-spin mx-auto" />
          <p className="text-xl text-purple-500">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#e8e8e8] text-black relative">
      <Navbar className="z-50 fixed top-0 left-0 w-full bg-white shadow" />

      <div className="pt-12 flex-grow">
        {/* Hero Section */}
        <div className="relative overflow-hidden hero-section">
          <HeroBackground />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
          <div className="container mx-auto px-4 py-16 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="w-full text-center">
                <h1 className="text-4xl font-bold md:text-5xl ml-60 text-white">
                  BLOGS
                </h1>
                <p className="text-xl text-purple-200 ml-60 mt-2">
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
        <div className="container py-16 bg-[#e8e8e8] text-black">
          {blogs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                {currentBlogs.map((blog) => (
                  <div key={blog.id} className="relative h-full">
                    <Link to={`/blog/${blog.id}`} className="group h-full">
                      <Card className="flex flex-col justify-between h-full bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden">
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
                          <div className="flex justify-between items-center text-sm text-gray-600">
                            <span>Published By: {blog.author || 'Admin'}</span>
                          </div>
                          <CardTitle className="text-xl text-black mt-2">{blog.title}</CardTitle>
                          <CardDescription className="text-gray-700">
                            {blog.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent>
                          <div className="flex justify-between items-center mt-4 space-x-2">
                            <span className="text-sm text-blue-600 border border-blue-600 px-3 py-1 rounded cursor-pointer group-hover:bg-blue-600 group-hover:text-white transition">
                              Read More
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={(e) => {
                                e.preventDefault();
                                setShareBlogId(blog.id === shareBlogId ? null : blog.id);
                              }}
                              className="border-gray-300 text-gray-600 hover:text-white hover:bg-gray-800"
                            >
                              <Share2 size={18} />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>

                    {shareBlogId === blog.id && (
                      <div className="absolute top-4 right-4 z-50">
                        <ShareCard url={getShareUrl(blog.id)} onClose={() => setShareBlogId(null)} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

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
            <div className="text-center py-16 border border-dashed border-gray-400 rounded-xl bg-gray-100">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-medium text-gray-700 mb-2">No articles yet</h3>
                <p className="text-gray-600 mb-6">We're working on some great content for you</p>
                {!user && (
                  <Button
                    onClick={() => navigate('/auth')}
                    className="bg-gradient-to-r from-[#4F5BFF] to-[#171a48] hover:from-[#5F6BFF] hover:to-[#272a58] text-white"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
