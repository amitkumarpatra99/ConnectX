'use client';

import { useEffect, useState } from 'react';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch following feed if logged in, otherwise global (or empty/prompt to login)
        // Actually, if not logged in, maybe show global? Or just login prompt.
        // Let's assume if session exists, show following. Else show global.
        const endpoint = session ? '/api/posts?type=following' : '/api/posts';
        const res = await fetch(endpoint);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setPosts(data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [session]);

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center px-2 mb-4">
        <h1 className="text-2xl font-bold text-metal-100">Home</h1>
        <Link href="/explore" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
          Explore Global Feed &rarr;
        </Link>
      </div>

      {posts.length > 0 ? (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      ) : (
        <div className="glass-panel rounded-xl p-10 text-center">
          <p className="text-metal-400 mb-4">No posts from people you follow.</p>
          <Link href="/explore" className="px-6 py-2 bg-metal-800 hover:bg-metal-700 border border-metal-600 text-metal-200 rounded-full text-sm font-medium transition-all inline-block">
            Find people to follow
          </Link>
        </div>
      )}
    </div>
  );
}
