"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { SearchIcon } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Blog {
  name: string
  date: string
  content: string
  categories?: string[]
  tags?: string[]
}

interface SearchDialogProps {
  onSearch: (query: string) => Promise<Blog[]>
}

export function SearchDialog({ onSearch }: SearchDialogProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Blog[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return

    setIsSearching(true)
    try {
      const searchResults = await onSearch(query)
      setResults(searchResults)
    } catch (error) {
      console.error("搜索失败:", error)
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }, [query, onSearch])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // 输入内容改变时自动搜索，使用防抖避免频繁调用
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    
    // 清除之前的计时器
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    
    // 设置新的计时器，300毫秒后执行搜索
    debounceTimer.current = setTimeout(() => {
      handleSearch()
    }, 300)
    
    // 组件卸载时清除计时器
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [query, handleSearch])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="transition-transform hover:scale-110">
          <SearchIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">搜索文章</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogTitle className="text-xl mb-4">搜索文章</DialogTitle>
        <div className="relative">
          <Input
            placeholder="搜索文章标题或内容..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pr-10"
            autoFocus
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2"
            onClick={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            ) : (
              <SearchIcon className="h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>
        </div>

        {isSearching ? (
          <div className="mt-6 text-center py-8">
            <p className="text-muted-foreground">正在搜索中...</p>
          </div>
        ) : results.length > 0 ? (
          <ScrollArea className="mt-6 max-h-[70vh]">
            <div className="space-y-4">
              {results.map((blog) => {
                // 高亮显示搜索词的函数
                const highlightText = (text: string, searchQuery: string) => {
                  if (!searchQuery) return text;
                  
                  const lowerCaseQuery = searchQuery.toLowerCase();
                  const lowerCaseText = text.toLowerCase();
                  const queryIndex = lowerCaseText.indexOf(lowerCaseQuery);
                  
                  if (queryIndex === -1) return text;
                  
                  const beforeMatch = text.substring(0, queryIndex);
                  const match = text.substring(queryIndex, queryIndex + searchQuery.length);
                  const afterMatch = text.substring(queryIndex + searchQuery.length);
                  
                  return (
                    <>
                      {beforeMatch}
                      <span className="bg-yellow-200 font-medium">{match}</span>
                      {afterMatch}
                    </>
                  );
                };

                return (
                  <Card key={blog.name} className="overflow-hidden transition-all hover:shadow-lg">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-1">
                        {highlightText(blog.name, query)}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">{blog.date}</p>
                      {blog.categories && (
                        <div className="flex flex-wrap gap-1">
                          {blog.categories.map((category, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="mt-3">
                        <Button
                          variant="link"
                          className="text-sm p-0"
                          asChild
                        >
                          <Link href={`/blog/${blog.name}`}>
                            阅读全文
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        ) : query.trim() ? (
          <div className="mt-6 text-center py-8">
            <p className="text-muted-foreground">未找到与 &quot;{query}&quot; 相关的文章</p>
          </div>
        ) : (
          <div className="mt-6 text-center py-8">
            <p className="text-muted-foreground">请输入关键词搜索文章</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}