import { getBlogList } from "@/actions/blog/action";
import { Skeleton } from "@/components/ui/skeleton";
import { TransitionItem } from "./transition/blog-item-transition/transition";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
export async function BlogList() {
    const blogList = await getBlogList();
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">
                    博客
                    <span className="text-sm font-normal text-gray-500 ml-2">
                        {blogList.length}篇
                    </span>
                </h1>
            </div>
            
            {/* 网格布局的博客列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogList.map((blog, index) => (
                    <TransitionItem index={index} key={blog.name}>
                        <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100 dark:border-gray-800">
                            <CardHeader className="pb-2">
                                <Link href={`/${blog.name}`} className="group">
                                    <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary group-hover:underline decoration-2 decoration-primary/50 underline-offset-4 transition-all">
                                        {blog.name}
                                    </CardTitle>
                                </Link>
                                <CardDescription className="mt-1 text-gray-500 dark:text-gray-400">
                                    {blog.date}
                                </CardDescription>
                            </CardHeader>
                            
                            <CardContent className="flex-grow pt-2">
                                {blog.excerpt && (
                                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                                        {blog.excerpt}
                                    </p>
                                )}
                            </CardContent>
                            
                            <CardFooter className="pt-2 pb-4">
                                <Link 
                                    href={`/${blog.name}`}
                                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                >
                                    阅读更多 →
                                </Link>
                            </CardFooter>
                        </Card>
                    </TransitionItem>
                ))}
            </div>
            
            {/* 无博客时的提示 */}
            {blogList.length === 0 && (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">暂无博客内容</p>
                </div>
            )}
        </div>
    )
}

export function BlogListSkeleton() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">博客</h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((_, index) => (
                    <Card key={index} className="h-full border border-gray-100 dark:border-gray-800">
                        <CardHeader className="pb-2">
                            <Skeleton className="h-8 w-4/5" />
                            <Skeleton className="h-4 w-1/3 mt-2" />
                        </CardHeader>
                        <CardContent className="pt-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6 mt-2" />
                            <Skeleton className="h-4 w-4/6 mt-2" />
                        </CardContent>
                        <CardFooter className="pt-2">
                            <Skeleton className="h-4 w-1/4" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
