import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface Blog {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
  author_id: string;
}

const Blog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
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
        (payload) => {
          console.log('Blog change detected:', payload);
          fetchBlogs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500/50 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-xl text-purple-200">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#4F5BFF]/20 via-[#171a48]/50 to-black">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#4F5BFF] via-[#8B5CF6] to-[#EC4899]">
                Our Blog
              </h1>
              <p className="text-xl text-purple-200 max-w-2xl">
                Discover our latest stories and insights from the community
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Card 
                key={blog.id} 
                className="bg-gray-900/50 border border-gray-800 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10 overflow-hidden group"
              >
                {blog.image_url && (
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={blog.image_url}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl text-white group-hover:text-purple-300 transition-colors">
                    {blog.title}
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    {blog.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-purple-400">
                    {new Date(blog.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-gray-800 rounded-xl bg-gray-900/20">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-medium text-purple-200 mb-2">No articles yet</h3>
              <p className="text-purple-300/70 mb-6">We're working on some great content for you</p>
              {!user && (
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-[#4F5BFF] to-[#171a48] hover:from-[#5F6BFF] hover:to-[#272a58]"
                >
                  Become a contributor
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900/50 border-t border-gray-800 py-8 mt-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-purple-300/70">
              © {new Date().getFullYear()} Your Blog. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" className="text-purple-300 hover:text-white">
                Terms
              </Button>
              <Button variant="ghost" className="text-purple-300 hover:text-white">
                Privacy
              </Button>
              <Button variant="ghost" className="text-purple-300 hover:text-white">
                Contact
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Blog;