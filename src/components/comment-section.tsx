"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogTitle } from '@/components/ui/dialog';
import { addComment, getCommentsByBlogName } from '@/actions/blog/comments';

interface Comment {
  id: string;
  blogName: string;
  nickname: string;
  content: string;
  createdAt: string;
  parentId?: string;
}

interface CommentSectionProps {
  blogName: string;
}

// EmojiPicker组件
const EmojiPicker: React.FC<{
  onSelect: (emoji: string) => void;
}> = ({ onSelect }) => {
  // 根据emoji8.com/zh-hans/网站整理的常用emoji表情分类
  const emojiCategories = [
    {
      category: '笑脸和情感',
      icon: '😊',
      emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚']
    },
    {
      category: '手势和身体',
      icon: '👍',
      emojis: ['👍', '👎', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐️', '✊', '👊', '🤛']
    },
    {
      category: '爱心和情感',
      icon: '❤️',
      emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '❣️', '❤️‍🔥']
    },
    {
      category: '动物和自然',
      icon: '🐶',
      emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦄']
    },
    {
      category: '食物和饮料',
      icon: '🍎',
      emojis: ['🍎', '🍌', '🍊', '🍋', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒']
    },
    {
      category: '活动和物体',
      icon: '⚽',
      emojis: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳']
    }
  ];

  return (
    <div className="p-4">
      {emojiCategories.map((category) => (
        <div key={category.category} className="mb-5">
          <div className="flex items-center mb-3">
            <span className="text-lg mr-2">{category.icon}</span>
            <h4 className="text-sm font-medium text-muted-foreground capitalize">
              {category.category}
            </h4>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {category.emojis.map((emoji, index) => (
              <DialogClose key={`${category.category}-${index}`} asChild>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(emoji);
                  }}
                  className="text-2xl p-2 rounded-lg hover:bg-primary/10 transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label={`插入表情 ${emoji}`}
                >
                  {emoji}
                </button>
              </DialogClose>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

interface CommentItemProps {
  comment: Comment;
  onReply: (commentId: string, nickname: string) => void;
  formatCommentContent: (content: string) => string;
  formatCommentTime: (timeString: string) => string;
  isReply?: boolean;
}

interface ReplyListProps {
  parentComment: Comment;
  allComments: Comment[];
  onReply: (commentId: string, nickname: string) => void;
  formatCommentContent: (content: string) => string;
  formatCommentTime: (timeString: string) => string;
}

// 单个评论项组件
const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  onReply, 
  formatCommentContent, 
  formatCommentTime,
  isReply = false
}) => {
  return (
    <div className={`flex gap-3 ${isReply ? 'mt-4' : ''}`}>
      <div className={`h-${isReply ? '8' : '10'} w-${isReply ? '8' : '10'} rounded-full bg-muted flex items-center justify-center text-${isReply ? 'xs' : 'sm'} font-medium`}>
        {comment.nickname.charAt(0).toUpperCase()}
      </div>
      <div className="space-y-1 flex-1">
        <div className="flex items-center justify-between">
          <div className={`font-medium ${isReply ? 'text-sm' : ''}`}>{comment.nickname}</div>
          <span className="text-xs text-muted-foreground">
            {formatCommentTime(comment.createdAt)}
          </span>
        </div>
        <div 
          className={`prose max-w-none ${isReply ? 'prose-xs' : 'prose-sm'}`} 
          dangerouslySetInnerHTML={{
            __html: formatCommentContent(comment.content) 
          }}
        />
        <div className="flex items-center gap-3 mt-1">
          <button
            onClick={() => onReply(comment.id, comment.nickname)}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            回复
          </button>
        </div>
      </div>
    </div>
  );
};

// 回复列表组件 - 两层级结构：第二层包含所有相关回复
const ReplyList: React.FC<ReplyListProps> = ({ 
  parentComment,
  allComments,
  onReply,
  formatCommentContent,
  formatCommentTime 
}) => {
  const [expanded, setExpanded] = useState(false);
  const [visibleReplies, setVisibleReplies] = useState(0);
  const repliesPerPage = 5;
  
  // 获取所有与该父评论相关的回复（包括回复的回复，形成完整的对话树）
  const replies = useMemo(() => {
    // 第一层：直接回复
    const directReplies = allComments.filter(c => c.parentId === parentComment.id);
    
    // 第二层：所有回复的回复
    const allReplies = [...directReplies];
    
    // 递归收集所有嵌套回复，但将它们都放在第二层显示
    const collectAllReplies = (commentIds: string[]) => {
      commentIds.forEach(id => {
        const nestedReplies = allComments.filter(c => c.parentId === id);
        if (nestedReplies.length > 0) {
          allReplies.push(...nestedReplies);
          collectAllReplies(nestedReplies.map(r => r.id));
        }
      });
    };
    
    // 收集所有嵌套回复
    collectAllReplies(directReplies.map(r => r.id));
    
    // 按创建时间排序
    return allReplies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [allComments, parentComment.id]);
  
  // 计算可显示的回复数量
  const displayReplies = replies.slice(0, expanded ? visibleReplies + repliesPerPage : 0);
  const hasMoreReplies = displayReplies.length < replies.length;
  
  // 处理展开/收起回复
  const handleToggleReplies = () => {
    if (!expanded) {
      setVisibleReplies(repliesPerPage);
    } else if (hasMoreReplies) {
      setVisibleReplies(prev => prev + repliesPerPage);
    } else {
      setVisibleReplies(0);
    }
    setExpanded(!expanded || hasMoreReplies);
  };
  
  if (replies.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-4 ml-12">
      {/* 回复按钮/提示 */}
      {!expanded && (
        <button
          onClick={handleToggleReplies}
          className="text-xs text-primary hover:underline mb-2 inline-block"
        >
          查看 {replies.length} 条回复
        </button>
      )}
      
      {/* 显示回复列表 - 所有回复都显示在同一层级 */}
      {expanded && (
        <div className="border-l-2 border-border pl-4 pt-2">
          {displayReplies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              formatCommentContent={formatCommentContent}
              formatCommentTime={formatCommentTime}
              isReply={true}
            />
          ))}
          
          {/* 显示更多回复按钮 */}
          {hasMoreReplies && (
            <button
              onClick={handleToggleReplies}
              className="text-xs text-primary hover:underline mt-2 inline-block"
            >
              查看更多回复 ({replies.length - visibleReplies})
            </button>
          )}
          
          {/* 收起按钮 */}
          {!hasMoreReplies && (
            <button
              onClick={() => {
                setExpanded(false);
                setVisibleReplies(0);
              }}
              className="text-xs text-muted-foreground hover:text-primary transition-colors mt-2 inline-block"
            >
              收起回复
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const CommentSection: React.FC<CommentSectionProps> = ({ blogName }) => {
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 插入emoji到评论内容
  const handleInsertEmoji = (emoji: string) => {
    setContent(prev => prev + emoji);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const parentCommentsPerPage = 8;
  
  // 加载评论
  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      const commentsData = await getCommentsByBlogName(blogName);
      setComments(commentsData);
      setCurrentPage(1); // 重置到第一页
    } catch (err) {
      console.error('加载评论失败:', err);
      setError('加载评论失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [blogName]);

  // 提交评论
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nickname.trim() || !content.trim()) {
      setError('昵称和评论内容不能为空');
      return;
    }

    if (nickname.length > 20) {
      setError('昵称不能超过20个字符');
      return;
    }

    if (content.length > 500) {
      setError('评论内容不能超过500个字符');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      await addComment(blogName, nickname.trim(), content.trim(), replyTo || undefined);
      
      // 重置表单
      setContent('');
      setReplyTo(null);
      setSuccess('评论发布成功！');
      
      // 重新加载评论
      await loadComments();
      
      // 3秒后清除成功提示
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('发布评论失败:', err);
      setError('发布评论失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 取消回复
  const handleCancelReply = () => {
    setReplyTo(null);
    setContent('');
  };

  // 回复评论
  const handleReply = (commentId: string, nickname: string) => {
    setReplyTo(commentId);
    setContent(`@${nickname} `);
    // 聚焦到评论框
    setTimeout(() => {
      const textarea = document.getElementById('comment-content');
      if (textarea) textarea.focus();
    }, 100);
  };

  // 获取主评论（非楼中楼评论）并分页
  const getPagedMainComments = useMemo(() => {
    const mainComments = comments.filter(comment => !comment.parentId);
    const startIndex = (currentPage - 1) * parentCommentsPerPage;
    const endIndex = startIndex + parentCommentsPerPage;
    return mainComments.slice(startIndex, endIndex);
  }, [comments, currentPage]);

  // 计算总页数
  const totalPages = useMemo(() => {
    const mainCommentsCount = comments.filter(comment => !comment.parentId).length;
    return Math.ceil(mainCommentsCount / parentCommentsPerPage);
  }, [comments]);

  // 格式化评论内容，处理@回复
  const formatCommentContent = (content: string) => {
    // 处理@回复的高亮显示
    return content.replace(/@(\S+)/g, '<span class="text-primary font-medium">@$1</span>');
  };
  
  // 格式化日期显示（默认使用当前时区，中国时间）
  const formatCommentTime = (timeString: string): string => {
    const date = new Date(timeString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // 计算差值
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    // 根据差值返回不同的显示格式
    if (minutes < 60) {
      return `${minutes}分钟前`;
    } else if (hours < 24) {
      return `${hours}小时前`;
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      // 超过7天显示具体日期
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // 首次加载和blogName变化时重新加载评论
  useEffect(() => {
    loadComments();
  }, [blogName, loadComments]);

  // 从localStorage读取保存的昵称
  useEffect(() => {
    const savedNickname = localStorage.getItem('comment_nickname');
    if (savedNickname) {
      setNickname(savedNickname);
    }
  }, []);

  // 保存昵称到localStorage
  useEffect(() => {
    if (nickname.trim()) {
      localStorage.setItem('comment_nickname', nickname.trim());
    }
  }, [nickname]);

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h2 className="text-xl font-bold mb-6">评论 ({comments.length})</h2>
      
      {/* 评论表单 */}
      <Card className="mb-8">
        <CardContent className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-md dark:bg-red-900/30 dark:text-red-400">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-4 bg-green-50 text-green-800 rounded-md dark:bg-green-900/30 dark:text-green-400">
              {success}
            </div>
          )}
          
          {replyTo ? (
            <div className="mb-4 p-3 bg-muted rounded-md text-sm">
              正在回复评论，
              <button 
                onClick={handleCancelReply} 
                className="text-primary hover:underline ml-1"
              >
                取消回复
              </button>
            </div>
          ) : null}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="nickname" className="block text-sm font-medium">
                昵称
              </label>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="请输入您的昵称（20字符以内）"
                maxLength={20}
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="comment-content" className="block text-sm font-medium">
                评论内容
              </label>
              <div className="relative">
                  <textarea
                    id="comment-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={replyTo ? "写下您的回复..." : "写下您的评论..."}
                    maxLength={500}
                    required
                    rows={4}
                    className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="absolute right-2 bottom-2 p-2 text-muted-foreground hover:text-primary transition-all duration-200 rounded-full hover:bg-primary/10 hover:scale-110"
                        aria-label="选择表情"
                      >
                        😊
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md max-h-[70vh] bg-background/95 backdrop-blur-sm border border-border rounded-xl shadow-xl transition-all overflow-hidden">
                      {/* 自定义滚动条样式和布局 */}
                      <style jsx>{`
                        .dialog-header {
                          position: sticky;
                          top: 0;
                          z-index: 10;
                          background: inherit;
                          backdrop-filter: blur(8px);
                          border-bottom: 1px solid var(--border);
                        }
                        .dialog-content {
                          max-height: calc(70vh - 80px);
                          overflow-y: auto;
                        }
                        .dialog-content::-webkit-scrollbar {
                          width: 6px;
                        }
                        .dialog-content::-webkit-scrollbar-track {
                          background: transparent;
                          border-radius: 3px;
                        }
                        .dialog-content::-webkit-scrollbar-thumb {
                          background: rgba(156, 163, 175, 0.3);
                          border-radius: 3px;
                        }
                        .dialog-content::-webkit-scrollbar-thumb:hover {
                          background: rgba(156, 163, 175, 0.5);
                        }
                        /* 隐藏默认的关闭按钮 */
                        [data-slot="dialog-content"] > [data-slot="dialog-close"] {
                          display: none;
                        }
                        /* 自定义关闭按钮样式 */
                        .custom-close-button {
                          position: absolute;
                          top: 12px;
                          right: 12px;
                          z-index: 20;
                          width: 32px;
                          height: 32px;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          background: rgba(255, 255, 255, 0.1);
                          backdrop-filter: blur(4px);
                          border-radius: 50%;
                          transition: all 0.2s ease;
                          border: none;
                          color: currentColor;
                        }
                        .custom-close-button:hover {
                          background: rgba(255, 255, 255, 0.2);
                          transform: scale(1.1);
                        }
                        .custom-close-button:focus {
                          outline: none;
                          box-shadow: 0 0 0 2px currentColor;
                        }
                      `}</style>
                      <div className="dialog-header relative">
                        <DialogTitle className="text-center py-3 text-xl font-bold text-foreground">
                          <span className="inline-block mr-2">😊</span> 选择表情
                        </DialogTitle>
                        <DialogClose className="custom-close-button">
                          <span className="sr-only">关闭</span>
                        </DialogClose>
                      </div>
                      <div className="py-4 px-2 dialog-content">
                        <EmojiPicker onSelect={handleInsertEmoji} />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              <div className="text-right text-xs text-muted-foreground">
                {content.length}/500
              </div>
            </div>
            
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? '发布中...' : '发布评论'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* 评论列表 */}
      {loading ? (
        <div className="space-y-4">
          {Array(2).fill(0).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">??</div>
                  <div className="space-y-2 w-full">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-3 bg-muted rounded w-1/3"></div>
                    <div className="space-y-2 mt-2">
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-full"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          暂无评论，快来发表第一条评论吧！
        </div>
      ) : (
        <div className="space-y-8">
          {getPagedMainComments.map((comment) => (
            <div key={comment.id} className="comment-thread">
              <Card>
                <CardContent className="p-6">
                  <CommentItem
                    comment={comment}
                    onReply={handleReply}
                    formatCommentContent={formatCommentContent}
                    formatCommentTime={formatCommentTime}
                    isReply={false}
                  />
                  
                  {/* 回复列表 - 所有回复都是同一层级 */}
                  <ReplyList
                    parentComment={comment}
                    allComments={comments}
                    onReply={handleReply}
                    formatCommentContent={formatCommentContent}
                    formatCommentTime={formatCommentTime}
                  />
                </CardContent>
              </Card>
            </div>
          ))}
          
          {/* 分页控件 */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                上一页
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={page === currentPage ? "font-medium" : ""}
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                下一页
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;