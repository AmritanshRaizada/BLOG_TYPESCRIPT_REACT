DROP POLICY "Authors can delete their own blogs" ON public.blogs;

CREATE POLICY "Authenticated users can delete blogs" 
ON public.blogs 
FOR DELETE 
USING (auth.role() = 'authenticated');
