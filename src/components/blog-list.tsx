import { getBlogList } from "@/actions/blog/action";
import { getReadCount } from "@/actions/blog/read-stats";
import { getLikeCount } from "@/actions/blog/like-stats";
import { Skeleton } from "@/components/ui/skeleton";
import { TransitionItem } from "./transition/blog-item-transition/transition";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
export async function BlogList() {
    const blogList = await getBlogList();
    
    // 获取每篇文章的阅读量和点赞数
    const blogsWithStats = await Promise.all(
        blogList.map(async (blog) => ({
            ...blog,
            readCount: await getReadCount(blog.name),
            likeCount: await getLikeCount(blog.name)
        }))
    );
    
    return (
        <div className="flex flex-col gap-8 px-4 sm:px-0">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">
                    博客
                    <span className="text-sm text-muted-foreground ml-2">
                        {blogList.length}篇
                    </span>
                </h1>
                <Badge variant="outline" className="bg-accent/50">
                    最新更新
                </Badge>
            </div>
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                {blogsWithStats.map((blog, index) => (
                    <TransitionItem index={index} key={blog.name}>
                        <Card className="overflow-hidden border border-border hover:border-primary/50 dark:hover:border-primary/30 transition-all duration-300 hover:shadow-md dark:hover:shadow-primary/10 group">
                            <CardContent className="p-0">
                                <Link href={`/${blog.name}`} className="block p-5 transition-all duration-300 hover:no-underline">
                                    <div className="flex items-start justify-between">
                                        <h2 className="text-lg font-medium line-clamp-2 group-hover:text-primary transition-colors duration-200">
                                            {blog.name}
                                        </h2>
                                        {blog.name !== 'about' && blog.name !== 'friend-links' && blog.name !== 'todo' && (
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs font-medium text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">
                                                    {blog.readCount || 0} 阅读
                                                </span>
                                                <span className="text-xs font-medium text-pink-500/80 bg-pink-500/10 px-2 py-0.5 rounded-full">
                                                    {blog.likeCount || 0} 点赞
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-3 font-mono">
                                        {blog.date}
                                    </p>
                                    
                                    {/* 分类和标签区域 */}
                                    <div className="mt-3 space-y-2">
                                        {/* 显示分类 */}
                                        {blog.categories && blog.categories.length > 0 && (
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-xs text-muted-foreground">分类:</span>
                                                {blog.categories.slice(0, 2).map((category, idx) => (
                                                    <Badge 
                                                        key={idx} 
                                                        className="bg-primary/10 text-primary px-2 py-0.5 transition-all duration-300 hover:bg-primary/20 hover:shadow-sm hover:-translate-y-0.5"
                                                    >
                                                        {category}
                                                    </Badge>
                                                ))}
                                                {blog.categories.length > 2 && (
                                                    <Badge className="bg-primary/10 text-primary px-2 py-0.5 transition-all duration-300 hover:bg-primary/20">
                                                        +{blog.categories.length - 2}
                                                    </Badge>
                                                )}
                                            </div>
                                        )}
                                        
                                        {/* 显示标签 */}
                                        {blog.tags && blog.tags.length > 0 && (
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-xs text-muted-foreground">标签:</span>
                                                {blog.tags.slice(0, 3).map((tag, idx) => (
                                                    <Badge 
                                                        key={idx} 
                                                        className="bg-primary/10 text-primary px-2 py-0.5 transition-all duration-300 hover:bg-primary/20 hover:shadow-sm hover:-translate-y-0.5"
                                                    >
                                                        {tag}
                                                    </Badge>
                                                ))}
                                                {blog.tags.length > 3 && (
                                                    <Badge className="bg-primary/10 text-primary px-2 py-0.5 transition-all duration-300 hover:bg-primary/20">
                                                        +{blog.tags.length - 3}
                                                    </Badge>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </CardContent>
                        </Card>
                    </TransitionItem>
                ))}
            </div>
        </div>
    )
}

export function BlogListSkeleton() {
    return (
        <div className="flex flex-col gap-8 px-4 sm:px-0">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">博客</h1>
                <Skeleton className="w-24 h-8" />
            </div>
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                {[...Array(4)].map((_, index) => (
                    <Card key={index}>
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                                <Skeleton className="w-3/4 h-6" />
                                <Skeleton className="w-16 h-6" />
                            </div>
                            <Skeleton className="w-24 h-4 mt-4" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
