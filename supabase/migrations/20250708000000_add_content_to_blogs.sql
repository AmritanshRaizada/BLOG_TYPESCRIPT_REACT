-- Add content column to blogs table
ALTER TABLE blogs
ADD COLUMN content TEXT NOT NULL DEFAULT '';