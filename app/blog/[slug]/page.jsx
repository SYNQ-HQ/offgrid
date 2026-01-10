import prisma from "@/lib/prisma";
import BlogContent from "./BlogContent";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug, status: "published" },
  });

  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | OffGrid Blog`,
    description: post.excerpt || "Disconnect to Reconnect",
    openGraph: {
      images: post.featured_image ? [post.featured_image] : [],
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug, status: "published" },
  });

  if (!post) {
    notFound();
  }

  // Convert dates to strings for client component
  const serializedPost = {
    ...post,
    published_date: post.published_date?.toISOString(),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };

  return <BlogContent post={serializedPost} />;
}
