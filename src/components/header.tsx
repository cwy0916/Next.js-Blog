"use client"

import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import Link from "next/link";
import { ThemeModeToggle } from "./theme-mode-toggle";
import { whiteList } from "@/app/white-list";
import { SearchDialog } from "./search";
import { searchBlogs } from "@/actions/blog/action";

export function Header() {
    // 处理搜索逻辑
    const handleSearch = async (query: string) => {
        try {
            return await searchBlogs(query);
        } catch (error) {
            console.error("搜索失败:", error);
            return [];
        }
    };

    return (
        <div className="p-4 max-w-screen-lg md:w-4/6 w-full sm:w-6/7 mx-auto flex justify-between">
            <NavigationMenu>
                <NavigationMenuList className="gap-4 flex items-center">
                    {whiteList.map(item =>
                        <NavigationMenuItem key={item.name}>
                            <NavigationMenuLink asChild>
                                <Link href={`/${item.name}`} passHref className="flex justify-center items-center gap-2">
                                    <span>{item.title}</span>
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    )}
                </NavigationMenuList>
            </NavigationMenu>
            <div className="flex items-center gap-2">
                <SearchDialog onSearch={handleSearch} />
                <ThemeModeToggle />
            </div>
        </div>
    );
}
