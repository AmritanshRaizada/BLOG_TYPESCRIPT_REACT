import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { useNavigate } from "react-router-dom"; // Add at top



interface Blog {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
  author_id: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingBlog, setIsAddingBlog] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); // Inside component
useEffect(() => {
  if (!user && !loading) {
    navigate("/auth");
  }
}, [user, loading]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null as File | null,
  });
  const handleSignOut = async () => {
  await signOut();         // calls Supabase logout
  navigate("/auth");       // redirects to /auth
};

  const buttonGradient = {
    background: 'linear-gradient(135deg, #4F5BFF 0%, #171a48 50%, #000000 100%)',
    backgroundSize: '200% 200%',
    transition: 'all 0.3s ease',
  };

  const buttonHover = {
    background: 'linear-gradient(135deg, #5F6BFF 0%, #272a58 50%, #111111 100%)',
    backgroundPosition: '100% 100%',
  };

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast({ title: 'Error', description: 'Failed to fetch blogs', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('blog-images').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsAddingBlog(true);

    try {
      let imageUrl = editingBlog?.image_url || null;

      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
        if (!imageUrl) throw new Error('Failed to upload image');
      }

      if (editingBlog) {
        const { error } = await supabase
          .from('blogs')
          .update({ 
            title: formData.title, 
            description: formData.description, 
            image_url: imageUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingBlog.id);

        if (error) throw error;
        toast({ title: 'Success', description: 'Blog post updated!' });
      } else {
        const { error } = await supabase
          .from('blogs')
          .insert([{ 
            title: formData.title, 
            description: formData.description, 
            image_url: imageUrl, 
            author_id: user.id, 
            published: true 
          }]);

        if (error) throw error;
        toast({ title: 'Success', description: 'Blog post created!' });
      }

      setFormData({ title: '', description: '', image: null });
      setDialogOpen(false);
      setEditingBlog(null);
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to save blog post', 
        variant: 'destructive' 
      });
    } finally {
      setIsAddingBlog(false);
    }
  };

  const togglePublish = async (blogId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ 
          published: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', blogId);
      
      if (error) throw error;
      toast({ 
        title: 'Success', 
        description: `Blog ${!currentStatus ? 'published' : 'unpublished'} successfully!` 
      });
      fetchBlogs();
    } catch (error) {
      console.error('Error updating blog:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to update blog status', 
        variant: 'destructive' 
      });
    }
  };

  const deleteBlog = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog? This action cannot be undone.')) return;

    try {
      const { error } = await supabase.from('blogs').delete().eq('id', blogId);
      if (error) throw error;
      toast({ 
        title: 'Success', 
        description: 'Blog deleted successfully!' 
      });
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to delete blog', 
        variant: 'destructive' 
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500/50 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-xl text-purple-200">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 p-6 bg-gray-800/50 rounded-xl border border-gray-700 shadow-lg">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#4F5BFF] via-[#8B5CF6] to-[#E879F9]">
            Admin Dashboard
          </h1>
          <p className="text-purple-200 mt-2">
            Welcome back, {user?.email} • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog open={dialogOpen} onOpenChange={(open) => { 
            setDialogOpen(open); 
            if (!open) { 
              setEditingBlog(null); 
              setFormData({ title: '', description: '', image: null }); 
            } 
          }}>
            <DialogTrigger asChild>
              <Button 
                style={buttonGradient}
                className="hover:shadow-lg hover:shadow-purple-500/20 text-white"
              >
                {editingBlog ? 'Edit Post' : '+ New Post'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-gray-800 border-gray-700 rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingBlog ? 'Edit Post' : 'Create New Post'}
                </DialogTitle>
                <DialogDescription className="text-purple-200">
                  {editingBlog ? 'Update your blog post details' : 'Fill in the details for your new blog post'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">Title*</Label>
                  <Input 
                    id="title" 
                    value={formData.title} 
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                    required 
                    className="bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-purple-500" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">Description*</Label>
                  <Textarea 
                    id="description" 
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                    rows={4} 
                    required 
                    className="bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-purple-500" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-white">Featured Image</Label>
                  <Input 
                    id="image" 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })} 
                    className="bg-gray-700 border-gray-600 file:text-white file:bg-gray-800 file:border-0 file:mr-4 file:px-4 file:py-2 file:rounded-md" 
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    type="button" 
                    // variant="outline" 
                    onClick={() => setDialogOpen(false)} 
                    className="bg-[rgb(220,38,38,0.9)] text-white hover:bg-[rgb(220,38,38,1)]"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isAddingBlog} 
                    style={buttonGradient}
                    className="hover:shadow-lg hover:shadow-purple-500/20 text-white"
                  >
                    {isAddingBlog ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        {editingBlog ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingBlog ? 'Update Post' : 'Create Post'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
         <Button 
  onClick={handleSignOut}
  className="bg-[rgb(220,38,38,0.9)] text-white hover:bg-[rgb(220,38,38,1)]"
>
  Sign Out
</Button>
        </div>
      </div>

      <div className="mb-6 max-w-md mx-auto md:mx-0">
        <Input 
          type="text" 
          placeholder="Search posts by title..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="bg-gray-700 text-white placeholder-purple-300 border-gray-600 focus:ring-2 focus:ring-purple-500" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 shadow-sm hover:shadow-purple-500/10 transition-shadow">
          <p className="text-purple-300 mb-1">Total Posts</p>
          <p className="text-3xl font-bold">{blogs.length}</p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 shadow-sm hover:shadow-purple-500/10 transition-shadow">
          <p className="text-purple-300 mb-1">Published</p>
          <p className="text-3xl font-bold text-green-400">{blogs.filter(b => b.published).length}</p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 shadow-sm hover:shadow-purple-500/10 transition-shadow">
          <p className="text-purple-300 mb-1">Drafts</p>
          <p className="text-3xl font-bold text-yellow-400">{blogs.filter(b => !b.published).length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs
          .filter(blog => blog.title.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((blog) => (
            <Card 
              key={blog.id} 
              className="bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 transition-all overflow-hidden group hover:shadow-lg hover:shadow-purple-500/10"
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
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg text-white group-hover:text-purple-300 transition-colors">
                    {blog.title}
                  </CardTitle>
                  <Badge 
                    variant={blog.published ? 'default' : 'secondary'} 
                    className={`${blog.published ? 
                      'bg-green-600/20 text-green-400 border-green-500/30' : 
                      'bg-yellow-600/20 text-yellow-400 border-yellow-500/30'}`}
                  >
                    {blog.published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <CardDescription className="text-purple-200 line-clamp-2">
                  {blog.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-purple-400">
                    {new Date(blog.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => togglePublish(blog.id, blog.published)} 
                      size="sm" 
                      style={buttonGradient}
                      className="text-xs hover:shadow-purple-500/10 text-white"
                    >
                      {blog.published ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button 
                      onClick={() => { 
                        setEditingBlog(blog); 
                        setFormData({ 
                          title: blog.title, 
                          description: blog.description, 
                          image: null 
                        }); 
                        setDialogOpen(true); 
                      }} 
                      size="sm" 
                      style={buttonGradient}
                      className="text-xs hover:shadow-purple-500/10 text-white"
                    >
                      Edit
                    </Button>
                    <Button 
                      onClick={() => deleteBlog(blog.id)} 
                      size="sm" 
                      variant="destructive"
                      className="text-xs bg-red-600/90 hover:bg-red-700/90"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {blogs.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed border-gray-700 rounded-xl bg-gray-800/20 hover:border-purple-500/50 transition-colors">
          <div className="max-w-md mx-auto">
            <Icons.post className="w-12 h-12 mx-auto text-purple-500 mb-4" />
            <h3 className="text-xl font-medium text-purple-200 mb-2">No posts created yet</h3>
            <p className="text-purple-300/70 mb-6">Get started by creating your first blog post</p>
            <Button 
              onClick={() => setDialogOpen(true)} 
              style={buttonGradient}
              className="hover:shadow-lg hover:shadow-purple-500/20 text-white"
            >
              Create First Post
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;