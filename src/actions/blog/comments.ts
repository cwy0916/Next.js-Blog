"use server"

import fs from "fs/promises";
import path from "path";

// 定义评论数据结构
interface Comment {
  id: string;
  blogName: string;
  nickname: string;
  content: string;
  createdAt: string; // 北京时间
  parentId?: string; // 楼中楼评论的父评论ID
}

// 定义评论存储的数据结构
interface CommentsData {
  comments: Comment[];
}

// 获取评论数据文件的路径
const getCommentsFilePath = (): string => {
  return path.join(process.cwd(), '/src/data/comments.json');
};

// 读取评论数据
const readComments = async (): Promise<CommentsData> => {
  try {
    const filePath = getCommentsFilePath();
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    // 如果文件不存在或读取失败，返回空的评论列表
    return { comments: [] };
  }
};

// 保存评论数据
const saveComments = async (data: CommentsData): Promise<void> => {
  try {
    const filePath = getCommentsFilePath();
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('保存评论数据失败:', error);
    throw new Error('保存评论失败');
  }
};

// 生成唯一ID
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// 获取北京时间
const getBeijingTime = (): string => {
  const now = new Date();
  // 北京时间比UTC时间早8小时
  const beijingTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  return beijingTime.toISOString().replace('Z', '+08:00');
};

// 添加新评论
export const addComment = async (
  blogName: string,
  nickname: string,
  content: string,
  parentId?: string
): Promise<Comment> => {
  // 验证输入
  if (!blogName || !nickname || !content) {
    throw new Error('请填写完整的评论信息');
  }
  
  if (nickname.length > 20) {
    throw new Error('昵称不能超过20个字符');
  }
  
  if (content.length > 100) {
    throw new Error('评论内容不能超过100个字符');
  }

  // 创建新评论
  const newComment: Comment = {
    id: generateId(),
    blogName,
    nickname,
    content,
    createdAt: getBeijingTime(),
    parentId
  };

  // 读取现有评论
  const commentsData = await readComments();
  
  // 添加新评论
  commentsData.comments.push(newComment);
  
  // 保存更新后的评论数据
  await saveComments(commentsData);
  
  return newComment;
};

// 获取指定博客的所有评论
export const getCommentsByBlogName = async (blogName: string): Promise<Comment[]> => {
  const commentsData = await readComments();
  
  // 过滤出指定博客的评论
  const blogComments = commentsData.comments.filter(
    comment => comment.blogName === blogName
  );
  
  // 按时间排序（最新的在前）
  return blogComments.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};