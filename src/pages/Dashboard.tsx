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
import { useNavigate } from "react-router-dom";
import { Switch } from '@/components/ui/switch';

interface Blog {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
  author_id: string;
  author: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingBlog, setIsAddingBlog] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate("/auth");
    }
  }, [user, loading]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    image: null as File | null,
    published: true,
    author: user?.user_metadata?.full_name || ''
  });

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  // Pastel color scheme
  const buttonGradient = {
    background: 'linear-gradient(135deg, #A5D8FF 0%, #C4C1E0 50%, #FEE9E1 100%)',
    backgroundSize: '200% 200%',
    transition: 'all 0.3s ease',
    color: '#5A5A72',
  };

  const buttonHover = {
    background: 'linear-gradient(135deg, #B5E8FF 0%, #D4D1F0 50%, #FFF9F1 100%)',
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
            content: formData.content,
            image_url: imageUrl,
            author: formData.author,
            published: formData.published,
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
            content: formData.content,
            image_url: imageUrl, 
            author_id: user.id,
            author: formData.author,
            published: formData.published
          }]);

        if (error) throw error;
        toast({ title: 'Success', description: 'Blog post created!' });
      }

      setFormData({ 
        title: '', 
        description: '', 
        content: '', 
        image: null,
        published: true,
        author: user?.user_metadata?.full_name || ''
      });
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
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#A5D8FF]/50 border-t-[#A5D8FF] rounded-full animate-spin mx-auto"></div>
          <p className="text-xl text-[#5A5A72]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#5A5A72] p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 p-6 bg-white rounded-xl border border-[#E9ECEF] shadow-sm">
        <div>
          <h1 
            className="text-3xl font-bold bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(135deg, #A5D8FF 0%, #C4C1E0 50%, #FEE9E1 100%)' }}
          >
            Admin Dashboard
          </h1>
          <p className="text-[#868E96] mt-2">
            Welcome back, {user?.email} • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog open={dialogOpen} onOpenChange={(open) => { 
            setDialogOpen(open); 
            if (!open) { 
              setEditingBlog(null); 
              setFormData({ 
                title: '', 
                description: '', 
                content: '', 
                image: null,
                published: true,
                author: user?.user_metadata?.full_name || ''
              }); 
            } 
          }}>
            <DialogTrigger asChild>
              <Button 
                style={buttonGradient}
                className="hover:shadow-lg hover:shadow-[#A5D8FF]/20"
              >
                {editingBlog ? 'Edit Post' : '+ New Post'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white border-[#E9ECEF] rounded-xl">
              <DialogHeader className="sticky top-0 bg-white z-10 pb-4 border-b border-[#E9ECEF]">
                <DialogTitle className="text-[#495057]">
                  {editingBlog ? 'Edit Post' : 'Create New Post'}
                </DialogTitle>
                <DialogDescription className="text-[#868E96]">
                  {editingBlog ? 'Update your blog post details' : 'Fill in the details for your new blog post'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4 px-1">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-[#495057]">Title*</Label>
                  <Input 
                    id="title" 
                    value={formData.title} 
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                    required 
                    className="bg-[#F1F3F5] border-[#E9ECEF] text-[#495057] focus:ring-2 focus:ring-[#A5D8FF]" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author" className="text-[#495057]">Author*</Label>
                  <Input 
                    id="author" 
                    value={formData.author} 
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })} 
                    required 
                    className="bg-[#F1F3F5] border-[#E9ECEF] text-[#495057] focus:ring-2 focus:ring-[#A5D8FF]" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-[#495057]">Description*</Label>
                  <Textarea 
                    id="description" 
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                    rows={4} 
                    required 
                    className="bg-[#F1F3F5] border-[#E9ECEF] text-[#495057] focus:ring-2 focus:ring-[#A5D8FF] min-h-[120px]" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-[#495057]">Content*</Label>
                  <Textarea 
                    id="content" 
                    value={formData.content} 
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })} 
                    rows={12} 
                    required 
                    className="bg-[#F1F3F5] border-[#E9ECEF] text-[#495057] focus:ring-2 focus:ring-[#A5D8FF] min-h-[300px]" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-[#495057]">Featured Image</Label>
                  <Input 
                    id="image" 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })} 
                    className="bg-[#F1F3F5] border-[#E9ECEF] file:text-[#495057] file:bg-[#E9ECEF] file:border-0 file:mr-4 file:px-4 file:py-2 file:rounded-md" 
                  />
                </div>
                <div className="flex items-center justify-between pt-2 pb-4">
                  <Label htmlFor="published" className="text-[#495057]">Published</Label>
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                    className="data-[state=checked]:bg-[#A5D8FF] data-[state=unchecked]:bg-[#E9ECEF]"
                  />
                </div>
                <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-[#E9ECEF]">
                  <div className="flex justify-end gap-3">
                    <Button 
                      type="button" 
                      onClick={() => setDialogOpen(false)} 
                      className="bg-[#FFC9C9] text-white hover:bg-[#FF8787]"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isAddingBlog} 
                      style={buttonGradient}
                      className="hover:shadow-lg hover:shadow-[#A5D8FF]/20"
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
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Button 
            onClick={handleSignOut}
            className="bg-[#FFC9C9] text-white hover:bg-[#FF8787]"
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
          className="bg-white text-[#495057] placeholder-[#868E96] border-[#E9ECEF] focus:ring-2 focus:ring-[#A5D8FF]" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-[#E9ECEF] shadow-sm hover:shadow-[#A5D8FF]/10 transition-shadow">
          <p className="text-[#A5D8FF] mb-1">Total Posts</p>
          <p className="text-3xl font-bold text-[#495057]">{blogs.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E9ECEF] shadow-sm hover:shadow-[#A5D8FF]/10 transition-shadow">
          <p className="text-[#A5D8FF] mb-1">Published</p>
          <p className="text-3xl font-bold text-[#B2F2BB]">{blogs.filter(b => b.published).length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E9ECEF] shadow-sm hover:shadow-[#A5D8FF]/10 transition-shadow">
          <p className="text-[#A5D8FF] mb-1">Drafts</p>
          <p className="text-3xl font-bold text-[#FFEC99]">{blogs.filter(b => !b.published).length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs
          .filter(blog => blog.title.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((blog) => (
            <Card 
              key={blog.id} 
              className="bg-white border border-[#E9ECEF] hover:border-[#A5D8FF]/50 transition-all overflow-hidden group hover:shadow-lg hover:shadow-[#A5D8FF]/10"
            >
              {blog.image_url && (
                <div className="aspect-video overflow-hidden relative">
                  <img 
                    src={blog.image_url} 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg text-[#495057] group-hover:text-[#A5D8FF] transition-colors">
                    {blog.title}
                  </CardTitle>
                  <Badge 
                    variant={blog.published ? 'default' : 'secondary'} 
                    className={`${blog.published ? 
                      'bg-[#B2F2BB]/20 text-[#2B8A3E] border-[#B2F2BB]/30' : 
                      'bg-[#FFEC99]/20 text-[#E67700] border-[#FFEC99]/30'}`}
                  >
                    {blog.published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <CardDescription className="text-[#868E96] line-clamp-2">
                  {blog.description}
                </CardDescription>
                <p className="text-sm text-[#A5D8FF] mt-2">
                  By: {blog.author || 'Admin'}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-[#A5D8FF]">
                      {new Date(blog.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <Button 
                      onClick={() => navigate(`/blog/${blog.id}`)} 
                      size="sm" 
                      variant="ghost"
                      className="text-xs text-[#A5D8FF] hover:bg-[#A5D8FF]/10"
                    >
                      Read More
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => togglePublish(blog.id, blog.published)} 
                      size="sm" 
                      style={buttonGradient}
                      className="text-xs hover:shadow-[#A5D8FF]/10"
                    >
                      {blog.published ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button 
                      onClick={() => { 
                        setEditingBlog(blog); 
                        setFormData({ 
                          title: blog.title, 
                          description: blog.description, 
                          content: blog.content,
                          image: null,
                          published: blog.published,
                          author: blog.author
                        }); 
                        setDialogOpen(true); 
                      }} 
                      size="sm" 
                      style={buttonGradient}
                      className="text-xs hover:shadow-[#A5D8FF]/10"
                    >
                      Edit
                    </Button>
                    <Button 
                      onClick={() => deleteBlog(blog.id)} 
                      size="sm" 
                      variant="destructive"
                      className="text-xs bg-[#FFC9C9] hover:bg-[#FF8787]"
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
        <div className="text-center py-16 border-2 border-dashed border-[#E9ECEF] rounded-xl bg-white hover:border-[#A5D8FF]/50 transition-colors">
          <div className="max-w-md mx-auto">
            <Icons.post className="w-12 h-12 mx-auto text-[#A5D8FF] mb-4" />
            <h3 className="text-xl font-medium text-[#495057] mb-2">No posts created yet</h3>
            <p className="text-[#868E96] mb-6">Get started by creating your first blog post</p>
            <Button 
              onClick={() => setDialogOpen(true)} 
              style={buttonGradient}
              className="hover:shadow-lg hover:shadow-[#A5D8FF]/20"
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