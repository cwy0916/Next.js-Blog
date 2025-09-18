import { getBlogList } from "@/actions/blog/action";
import { Skeleton } from "@/components/ui/skeleton";
import { TransitionItem } from "./transition/blog-item-transition/transition";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
export async function BlogList() {
    const blogList = await getBlogList();
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
                {blogList.map((blog, index) => (
                    <TransitionItem index={index} key={blog.name}>
                        <Card className="overflow-hidden border border-border hover:border-primary/50 dark:hover:border-primary/30 transition-all duration-300 hover:shadow-md dark:hover:shadow-primary/10 group">
                            <CardContent className="p-0">
                                <Link href={`/${blog.name}`} className="block p-5 transition-all duration-300 hover:no-underline">
                                    <div className="flex items-start justify-between">
                                        <h2 className="text-lg font-medium line-clamp-2 group-hover:text-primary transition-colors duration-200">
                                            {blog.name}
                                        </h2>
                                        <span className="ml-2 text-xs font-medium text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">
                                            阅读
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-3 font-mono">
                                        {blog.date}
                                    </p>
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
