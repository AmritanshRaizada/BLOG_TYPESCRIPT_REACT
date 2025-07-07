import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500/50 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-xl text-purple-200">Loading your experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black z-0"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent z-0"></div>
        
        <div className="container mx-auto px-6 py-32 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-red-400 to-purple-600">
              Unleash Your Creativity
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-200">
              Craft stunning stories with our immersive blog platform designed for creators
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/blog')} 
                size="lg"
                className="bg-gradient-to-r from-purple-600 via-red-500 to-purple-800 hover:from-purple-700 hover:via-red-600 hover:to-purple-900 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all"
              >
                Explore Articles
              </Button>
              <Button 
                onClick={() => navigate('/auth')} 
                size="lg" 
                variant="outline"
                className="border-purple-500 text-purple-100 hover:bg-purple-900/30 hover:text-white hover:border-purple-300 transition-all"
              >
                Join Our Community
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-20"></div>
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-red-400">
              Elevate Your Content
            </h2>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              A platform designed to bring out the best in your writing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: '✍️',
                title: "Intuitive Editor",
                description: "A distraction-free writing experience with powerful formatting tools"
              },
              {
                icon: '🎨',
                title: "Visual Customization",
                description: "Custom themes and layouts to match your unique style"
              },
              {
                icon: '📈',
                title: "Performance Insights",
                description: "Real-time analytics to understand your audience"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-gray-800 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-900 to-red-900 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-purple-200">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Begin Your Journey?</h2>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Join thousands of creators already sharing their stories with the world
          </p>
          <Button 
            onClick={() => navigate('/auth')} 
            size="lg"
            className="bg-gradient-to-r from-[#4F5BFF] via-[#171a48] to-black hover:from-[#5f6bff] hover:via-[#272a58] hover:to-gray-900 text-white px-8 py-6 text-lg shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all"
          >
            Get Started Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;