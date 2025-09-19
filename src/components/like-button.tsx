"use client"

import { useState, useEffect } from "react";
import { Heart, HeartOff } from "lucide-react";
import { incrementLikeCount } from "@/actions/blog/like-stats";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface LikeButtonProps {
  blogName: string;
  initialCount: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({ blogName, initialCount }) => {
  const [likeCount, setLikeCount] = useState(initialCount);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hasInteractedRef = useRef(false);

  // 检查用户是否已经点赞（从localStorage读取）
  useEffect(() => {
    const likedPosts = localStorage.getItem('likedPosts');
    if (likedPosts) {
      const likedPostsObj = JSON.parse(likedPosts);
      setIsLiked(likedPostsObj[blogName] || false);
    }
  }, [blogName]);

  const handleLike = async () => {
    if (isLoading || hasInteractedRef.current) return;
    
    setIsLoading(true);
    
    try {
      // 增加点赞数
      const newCount = await incrementLikeCount(blogName);
      setLikeCount(newCount);
      setIsLiked(true);
      
      // 记录用户点赞状态到localStorage
      const likedPosts = localStorage.getItem('likedPosts');
      const likedPostsObj = likedPosts ? JSON.parse(likedPosts) : {};
      likedPostsObj[blogName] = true;
      localStorage.setItem('likedPosts', JSON.stringify(likedPostsObj));
      
      // 防止重复点赞
      hasInteractedRef.current = true;
      
      // 添加点赞动画
      if (buttonRef.current) {
        buttonRef.current.classList.add('scale-110');
        setTimeout(() => {
          buttonRef.current?.classList.remove('scale-110');
        }, 300);
      }
    } catch (error) {
      console.error('点赞失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      ref={buttonRef}
      variant="ghost"
      size="sm"
      className={`flex items-center gap-1.5 px-2 py-1 h-8 transition-all duration-300 ${isLiked ? 'text-pink-500' : 'text-muted-foreground'}`}
      onClick={handleLike}
      disabled={isLoading || isLiked || hasInteractedRef.current}
    >
      {isLoading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : isLiked ? (
        <Heart className="h-4 w-4 fill-current" />
      ) : (
        <HeartOff className="h-4 w-4" />
      )}
      <span>{likeCount}</span>
    </Button>
  );
};

export default LikeButton;