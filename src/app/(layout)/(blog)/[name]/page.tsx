import { getBlog, getBlogList } from "@/actions/blog/action";
import { notFound } from "next/navigation";
import { whiteList } from "@/app/white-list";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

// 动态导入MD组件
const MDComponents = (await import("@/components/md-components")).default;

type Params = Promise<{
	name: string
}>

// meta
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
	const { name } = await params;
	const decodedName = decodeURIComponent(name);
	const blog = await getBlog(decodedName);
	if (!blog) {
		throw notFound();
	}
	return {
		title: `Blogs-${blog.name}`,
		description: `${blog.name} ${blog.content}`,
		keywords: [blog.name],
		authors: [
			{ name: "Zwanan", url: "https://cyyvps.top/about" },
			{ name: "Zwanan-github", url: "https://github.com/cwy0916" }
		],
		openGraph: {
			title: `Blogs-${blog.name}`,
			description: `${blog.name} ${blog.content}`,
			images: ["https://blog.zwanan.top/favicon.ico"],
		}
	};
}

// isr
export const dynamicParams = true;

// revalidate
export const revalidate = 60;

// ssg
export async function generateStaticParams() {
	return (await getBlogList()).map((blog) => ({
		name: blog.name,
	}));
}

export default async function Page({ params }: { params: Params }) {
	const { name } = await params;
	// 解码URL编码的name
	const decodedName = decodeURIComponent(name);
	// 获取博客内容
	// dev环境的时候不缓存
	const blog = await getBlog(decodedName);

	if (!blog) {
		throw notFound();
	}

	// 获取所有文章并过滤掉当前文章
	const allBlogs = await getBlogList();
	const otherBlogs = allBlogs.filter(item => item.name !== decodedName);
	
	// 随机选择2篇文章
	const randomBlogs = getRandomBlogs(otherBlogs, 2);

	const matchingWhiteListItem = whiteList.find(item => item.name === blog.name);

	const displayTitle = matchingWhiteListItem ? matchingWhiteListItem.title : blog.name;

	return (
		<div className="flex flex-col gap-4">
			<h1 className="text-3xl font-bold">
				{displayTitle}
			</h1>
			<p className="text-sm text-gray-500">{`更新时间：${blog.date}`}</p>
			
			{/* 分类和标签区域 */}
			<div className="flex flex-col gap-3 pt-2">
				{/* 显示分类 */}
				{blog.categories && blog.categories.length > 0 && (
					<div className="flex flex-wrap items-center gap-2">
						<span className="text-sm font-medium text-muted-foreground">分类:</span>
						{blog.categories.map((category, index) => (
							<Badge 
								key={index} 
								className="bg-primary/10 text-primary px-3 py-1 rounded-full transition-all duration-300 hover:bg-primary/20 hover:shadow-sm hover:-translate-y-0.5"
							>
								{category}
							</Badge>
						))}
					</div>
				)}
				
				{/* 显示标签 */}
				{blog.tags && blog.tags.length > 0 && (
					<div className="flex flex-wrap items-center gap-2">
						<span className="text-sm font-medium text-muted-foreground">标签:</span>
						{blog.tags.map((tag, index) => (
							<Badge 
								key={index} 
								className="bg-primary/10 text-primary px-3 py-1 rounded-full transition-all duration-300 hover:bg-primary/20 hover:shadow-sm hover:-translate-y-0.5"
							>
								{tag}
							</Badge>
						))}
					</div>
				)}
			</div>
			
			<MDComponents transparent={true} content={blog.content} />
		
		{/* 相关文章推荐模块 */}
		{randomBlogs.length > 0 && (
			<div className="mt-12 pt-8 border-t border-border">
				<h2 className="text-xl font-bold mb-6">相关文章推荐</h2>
				<div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
					{randomBlogs.map((relatedBlog, index) => (
						<Card 
							key={relatedBlog.name} 
							className="overflow-hidden border border-border hover:border-primary/50 dark:hover:border-primary/30 transition-all duration-300 hover:shadow-md dark:hover:shadow-primary/10 group"
						>
							<CardContent className="p-0">
								<Link href={`/${relatedBlog.name}`} className="block p-5 transition-all duration-300 hover:no-underline">
									<div className="flex items-start justify-between">
										<h3 className="text-lg font-medium line-clamp-2 group-hover:text-primary transition-colors duration-200">
											{relatedBlog.name}
										</h3>
										<span className="ml-2 text-xs font-medium text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">
											阅读
										</span>
									</div>
									<p className="text-xs text-muted-foreground mt-3 font-mono">
										{relatedBlog.date}
									</p>
									
									{/* 分类和标签区域 */}
									<div className="mt-3 space-y-2">
										{relatedBlog.categories && relatedBlog.categories.length > 0 && (
											<div className="flex flex-wrap items-center gap-2">
												<span className="text-xs text-muted-foreground">分类:</span>
												{relatedBlog.categories.slice(0, 2).map((category, idx) => (
												<Badge 
													key={`${relatedBlog.name}-category-${idx}`} 
													className="bg-primary/10 text-primary px-2 py-0.5 transition-all duration-300 hover:bg-primary/20 hover:shadow-sm hover:-translate-y-0.5"
												>
													{category}
												</Badge>
											))}
												{relatedBlog.categories.length > 2 && (
													<Badge 
													key={`${relatedBlog.name}-category-more`} 
													className="bg-primary/10 text-primary px-2 py-0.5 transition-all duration-300 hover:bg-primary/20"
												>
													+{relatedBlog.categories.length - 2}
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
			</div>
		)}
	</div>
);
}

// 从博客列表中随机选择指定数量的博客
function getRandomBlogs(blogs: any[], count: number): any[] {
	if (blogs.length <= count) {
		return blogs;
	}
	
	// 创建数组的副本以避免修改原始数组
	const shuffled = [...blogs];
	// 洗牌算法
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	// 返回前count个元素
	return shuffled.slice(0, count);
}