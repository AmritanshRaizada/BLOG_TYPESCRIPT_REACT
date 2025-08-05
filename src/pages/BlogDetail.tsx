// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { supabase } from '@/integrations/supabase/client';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import rehypeRaw from 'rehype-raw';
// import { Button } from '@/components/ui/button';
// import Navbar from './Navbar';

// interface Blog {
//   id: string;
//   title: string;
//   description: string;
//   content: string;
//   image_url: string | null;
//   created_at: string;
//   author_id: string;
//   author?: string;
// }

// const BlogDetail = () => {
//   const { id } = useParams<{ id: string }>();
//   const [blog, setBlog] = useState<Blog | null>(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchBlog = async () => {
//       const { data, error } = await supabase
//         .from('blogs')
//         .select('*, content')
//         .eq('id', id)
//         .single();

//       if (error) {
//         console.error('Error loading blog:', error);
//       } else {
//         setBlog(data);
//       }
//       setLoading(false);
//     };

//     fetchBlog();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex justify-center items-center text-white">
//         Loading...
//       </div>
//     );
//   }

//   if (!blog) {
//     return (
//       <div className="min-h-screen flex justify-center items-center text-white">
//         Blog not found.
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black text-white px-4 py-10" style={{ paddingTop: '8.5vh' }}>
//       <Navbar />
//       <div className="max-w-4xl mx-auto mb-6">
//         <Button
//           onClick={() => navigate(-1)}
//           className=" text-blue-600 border bg-gray-900 mt-4 text-white px-3 py-1 rounded hover:bg-blue-600 hover:text-white transition"
//         >
//           ← Back
//         </Button>
//       </div>

//       <Card className="max-w-4xl mx-auto bg-gray-900 border border-gray-700">
//         {blog.image_url && (
//           <img
//             src={blog.image_url}
//             alt={blog.title}
//             className="w-full object-cover max-h-[400px] rounded-t"
//           />
//         )}
//         <CardHeader>
//           <CardTitle className="text-3xl text-white">{blog.title}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ReactMarkdown
//             remarkPlugins={[remarkGfm]}
//             rehypePlugins={[rehypeRaw]}
//             components={{
//               h1: ({ children }) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
//               h2: ({ children }) => <h2 className="text-2xl font-semibold mt-6 mb-2">{children}</h2>,
//               p: ({ children }) => <p className="mb-4 leading-relaxed text-white">{children}</p>,
//               ul: ({ children }) => <ul className="list-disc list-inside mb-4">{children}</ul>,
//               a: ({ href, children }) => (
//                 <a href={href} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
//                   {children}
//                 </a>
//               )
//             }}
//           >
//             {blog.content}
//           </ReactMarkdown>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default BlogDetail;
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Button } from '@/components/ui/button';

interface Blog {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url: string[] | null;
  created_at: string;
}

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error loading blog:', error);
      } else {
        setBlog(data);
      }
      setLoading(false);
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-black bg-[#fffafa]">
        Loading...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex justify-center items-center text-black bg-white">
        Blog not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-black px-4 py-10">
      <div className="max-w-4xl mx-auto mb-6">
        <Button
          onClick={() => navigate(-1)}
          className="bg-gray-100 text-black hover:bg-gray-200 border border-gray-300"
        >
          ← Back
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto bg-white border border-gray-300 shadow-lg rounded-lg">
        {blog.image_url && (
          <img
            src={blog.image_url}
            alt={blog.title}
            className="w-full object-cover max-h-[400px] rounded-t-lg"
          />
        )}
        <CardHeader>
          <CardTitle className="text-3xl text-black font-bold">{blog.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              h1: ({ children }) => <h1 className="text-3xl font-bold mb-4 text-black">{children}</h1>,
              h2: ({ children }) => <h2 className="text-2xl font-semibold mt-6 mb-2 text-black">{children}</h2>,
              p: ({ children }) => <p className="mb-4 leading-relaxed text-gray-800">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-4 text-gray-800">{children}</ul>,
              a: ({ href, children }) => (
                <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              )
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogDetail;
