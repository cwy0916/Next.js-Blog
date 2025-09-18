"use server"

import { whiteList } from "@/app/white-list";
import fs from "fs/promises";
import path from "path";

export interface Blog {
    name: string;
    date: string;
    content: string;
    categories?: string[];
    tags?: string[];
}


// 从文章内容中提取分类信息
function extractCategoriesFromContent(content: string): string[] {
    const categoriesMatch = content.match(/categories:\s*\[([^\]]+)\]/i);
    if (categoriesMatch && categoriesMatch[1]) {
        return categoriesMatch[1]
            .split(',')
            .map(cat => cat.trim())
            .filter(cat => cat.length > 0);
    }
    return [];
}

// 从文章内容中提取标签信息
function extractTagsFromContent(content: string): string[] {
    const tagsMatch = content.match(/tags:\s*\[([^\]]+)\]/i);
    if (tagsMatch && tagsMatch[1]) {
        return tagsMatch[1]
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
    }
    return [];
}

export async function getBlogList(): Promise<Blog[]> {
    try {
        // 获取mds文件夹下的所有文件
        const mds = await fs.readdir(path.join(process.cwd(), "/content/mds"));
        // 读取每个md文件的内容 
        const blogList = await Promise.all(mds.map(async (md) => {
            // 文件名以 [name]-[yyyy-mm-dd].md 命名， 解析出name和date
            // 解析两个[]的内容
            const matches = md.match(/\[(.*?)\]-\[(.*?)\]/)!;
            const name = matches[1]!;
            const date = matches[2]!;
            // 把date转换为yyyy-mm-dd
            const dateTime = new Date(date).toISOString().split("T")[0];
            
            // 读取文件内容以提取分类和标签
            const content = await fs.readFile(path.join(process.cwd(), "/content/mds", md), "utf-8");
            const categories = extractCategoriesFromContent(content);
            const tags = extractTagsFromContent(content);
            
            return {
                name,
                date: dateTime,
                content: "",
                categories,
                tags
            }
        }));
        // 按日期降序排序，去除whiteList中为前缀的内容
        blogList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return blogList.filter((blog) => !whiteList.some((white) => white.name != '' && blog.name.startsWith(white.name)));
    } catch (error) {
        console.error(error);
        return [];
    }
}

// 搜索博客文章（仅搜索文章名）
export async function searchBlogs(query: string): Promise<Blog[]> {
    try {
        const allBlogs = await getBlogList();
        
        // 如果查询为空，返回空数组
        if (!query || query.trim() === '') {
            return [];
        }
        
        const lowerCaseQuery = query.toLowerCase();
        
        // 只搜索标题匹配的文章
        const titleMatches: Blog[] = [];
        
        // 遍历所有文章进行搜索
        for (const blog of allBlogs) {
            // 检查标题是否匹配（不区分大小写）
            if (blog.name.toLowerCase().includes(lowerCaseQuery)) {
                titleMatches.push(blog);
            }
        }
        
        return titleMatches;
    } catch (error) {
        console.error("搜索文章失败:", error);
        return [];
    }
}

export async function getBlog(name: string): Promise<Blog | null> {
    try {
        const mds = await fs.readdir(path.join(process.cwd(), "/content/mds"));
        const blog = mds.find((md) => md.startsWith(`[${name}]`));
        if (!blog) {
            return null;
        }
        const content = await fs.readFile(path.join(process.cwd(), "/content/mds", blog!), "utf-8");
        // 文件名以 [name]-[yyyy-mm-dd].md 命名， 解析出name和date
        // 解析两个[]的内容
        const matches = blog!.match(/\[(.*?)\]-\[(.*?)\]/)!;
        const title = matches[1]!;
        const date = matches[2]!;
        // 把date转换为yyyy-mm-dd
        const dateTime = new Date(date).toISOString().split("T")[0];
        
        // 解析Front Matter中的分类和标签
        const categories = extractCategoriesFromContent(content);
        const tags = extractTagsFromContent(content);
        
        // 从内容中移除分类和标签的文本行
        let cleanedContent = content;
        cleanedContent = cleanedContent.replace(/categories:\s*\[[^\]]+\]/i, '');
        cleanedContent = cleanedContent.replace(/tags:\s*\[[^\]]+\]/i, '');
        
        return {
            name: title,
            date: dateTime,
            content: cleanedContent,
            categories,
            tags
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

// 获取所有分类及其文章
interface CategoryWithBlogs {
    category: string;
    blogs: Blog[];
}

export async function getCategoriesWithBlogs(): Promise<CategoryWithBlogs[]> {
    try {
        const blogList = await getBlogList();
        
        // 按分类对文章进行分组
        const categoryMap = new Map<string, Blog[]>();
        
        blogList.forEach(blog => {
            if (blog.categories && blog.categories.length > 0) {
                blog.categories.forEach(category => {
                    if (!categoryMap.has(category)) {
                        categoryMap.set(category, []);
                    }
                    categoryMap.get(category)!.push(blog);
                });
            }
        });
        
        // 转换为数组并按文章数量排序（从多到少）
        const categoriesWithBlogs: CategoryWithBlogs[] = Array.from(categoryMap.entries())
            .map(([category, blogs]) => ({ category, blogs }))
            .sort((a, b) => b.blogs.length - a.blogs.length);
        
        return categoriesWithBlogs;
    } catch (error) {
        console.error(error);
        return [];
    }
}
