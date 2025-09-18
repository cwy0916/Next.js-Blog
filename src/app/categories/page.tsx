import { getCategoriesWithBlogs } from "@/actions/blog/action";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "分类 - 博客",
  description: "博客文章分类页面",
};

interface CategoryPageProps {
  searchParams?: {
    category?: string;
  };
}

export default async function CategoriesPage({ searchParams }: CategoryPageProps) {
  // 在Next.js 15中，需要先await searchParams
  const params = await searchParams;
  const selectedCategory = params?.category;
  const categoriesWithBlogs = await getCategoriesWithBlogs();

  // 如果选择了某个分类，则只显示该分类下的文章
  if (selectedCategory) {
    const categoryData = categoriesWithBlogs.find(item => item.category === selectedCategory);
    
    return (
      <div className="flex flex-col gap-8 px-4 sm:px-0 max-w-screen-lg md:w-4/6 w-full sm:w-6/7 mx-auto py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            {selectedCategory}分类
            <span className="text-sm text-muted-foreground ml-2">
              {categoryData?.blogs.length || 0}篇
            </span>
          </h1>
          <Link href="/categories" className="text-sm text-primary hover:underline">
            返回分类列表
          </Link>
        </div>
        
        {categoryData?.blogs.length ? (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {categoryData.blogs.map((blog, index) => (
              <Card 
                key={blog.name} 
                className="overflow-hidden border border-border hover:border-primary/50 dark:hover:border-primary/30 transition-all duration-300 hover:shadow-md dark:hover:shadow-primary/10 group"
              >
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
                    
                    {/* 分类和标签区域 */}
                    <div className="mt-3 space-y-2">
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
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">该分类下暂无文章</p>
          </div>
        )}
      </div>
    );
  }

  // 默认显示所有分类列表
  return (
    <div className="flex flex-col gap-8 px-4 sm:px-0 max-w-screen-lg md:w-4/6 w-full sm:w-6/7 mx-auto py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          分类
          <span className="text-sm text-muted-foreground ml-2">
            {categoriesWithBlogs.length}个分类
          </span>
        </h1>
        <Badge variant="outline" className="bg-accent/50">
          共{categoriesWithBlogs.reduce((sum, item) => sum + item.blogs.length, 0)}篇文章
        </Badge>
      </div>
      
      {categoriesWithBlogs.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoriesWithBlogs.map((categoryData, index) => (
            <Card 
              key={categoryData.category} 
              className="overflow-hidden border border-border hover:border-primary/50 dark:hover:border-primary/30 transition-all duration-300 hover:shadow-md dark:hover:shadow-primary/10 group"
            >
              <CardContent className="p-6">
                <Link 
                  href={`/categories?category=${encodeURIComponent(categoryData.category)}`} 
                  className="block w-full transition-all duration-300 hover:no-underline"
                >
                  <h2 className="text-xl font-bold text-primary mb-3 group-hover:text-primary/80 transition-colors duration-200">
                    {categoryData.category}
                  </h2>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {categoryData.blogs.length} 篇文章
                    </span>
                    <Badge className="bg-primary/10 text-primary px-2 py-0.5">
                      查看
                    </Badge>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">暂无分类数据</p>
        </div>
      )}
    </div>
  );
}