import React, { useState } from 'react';
import { MOCK_FORUM_POSTS } from '../constants';
import { MessageSquare, ThumbsUp, Plus, Search } from 'lucide-react';
import { Language, ForumPost } from '../types';

interface CommunityViewProps {
  language: Language['code'];
}

export const CommunityView: React.FC<CommunityViewProps> = ({ language }) => {
  const [posts, setPosts] = useState<ForumPost[]>(MOCK_FORUM_POSTS);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNewPost = () => {
      const title = prompt("Post Title:");
      if (!title) return;
      const content = prompt("Post Content:");
      if (!content) return;

      const newPost: ForumPost = {
          id: Date.now().toString(),
          author: 'You',
          avatar: 'ME',
          title: title,
          preview: content,
          replies: 0,
          likes: 0,
          tag: 'General',
          time: 'Just now'
      };
      setPosts([newPost, ...posts]);
  };

  const handleLike = (id: string) => {
      setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleLoadMore = () => {
      // Simulate loading older posts
      const olderPosts = posts.map(p => ({...p, id: p.id + '_old', time: '3 days ago'}));
      setPosts([...posts, ...olderPosts]);
  };

  const filteredPosts = posts.filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-900">Community Forum</h2>
           <p className="text-gray-500 text-sm mt-1">Connect with {1250} farmers in your region</p>
        </div>
        <button
            onClick={handleNewPost}
            className="flex items-center px-4 py-2 bg-[#10b981] text-white rounded-lg font-medium shadow-md hover:bg-emerald-600 transition-colors"
        >
            <Plus size={18} className="mr-2" /> New Post
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
            <Search size={20} className="text-gray-400" />
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics..."
                className="bg-transparent border-none outline-none text-sm w-full text-gray-600 placeholder-gray-400"
            />
        </div>
        <div className="divide-y divide-gray-100">
            {filteredPosts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="bg-emerald-100 text-[#10b981] text-xs font-bold px-2 py-1 rounded-full">{post.tag}</span>
                            <span className="text-xs text-gray-400">• {post.time}</span>
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#10b981] transition-colors">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.preview}</p>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                {post.avatar}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-400">
                            <div className="flex items-center gap-1 hover:text-gray-600">
                                <MessageSquare size={16} />
                                <span className="text-sm font-medium">{post.replies}</span>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                                className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
                            >
                                <ThumbsUp size={16} />
                                <span className="text-sm font-medium">{post.likes}</span>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <div className="p-4 text-center border-t border-gray-100">
            <button onClick={handleLoadMore} className="text-sm font-medium text-[#10b981] hover:underline">Load More Discussions</button>
        </div>
      </div>
    </div>
  );
};