"use server"

import fs from "fs/promises";
import path from "path";

interface LikeStatsData {
  stats: Record<string, number>;
}

// 读取点赞统计数据
async function readStats(): Promise<LikeStatsData> {
  try {
    const statsPath = path.join(process.cwd(), "src/data/like-stats.json");
    const data = await fs.readFile(statsPath, "utf-8");
    return JSON.parse(data) as LikeStatsData;
  } catch (error) {
    console.error("读取点赞数据失败:", error);
    return { stats: {} };
  }
}

// 保存点赞统计数据
async function saveStats(stats: LikeStatsData): Promise<void> {
  try {
    const statsPath = path.join(process.cwd(), "src/data/like-stats.json");
    await fs.writeFile(statsPath, JSON.stringify(stats, null, 2), "utf-8");
  } catch (error) {
    console.error("保存点赞数据失败:", error);
  }
}

/**
 * 增加指定文章的点赞数
 * @param blogName 文章名称
 * @returns 增加后的点赞数
 */
export async function incrementLikeCount(blogName: string): Promise<number> {
  try {
    const stats = await readStats();
    
    // 检查该文章是否已有点赞记录，如果没有则初始化为0
    if (!stats.stats[blogName]) {
      stats.stats[blogName] = 0;
    }
    
    // 增加点赞数
    stats.stats[blogName]++;
    
    // 保存更新后的点赞数
    await saveStats(stats);
    
    return stats.stats[blogName];
  } catch (error) {
    console.error(`增加文章"${blogName}"点赞数失败:`, error);
    return 0;
  }
}

/**
 * 获取指定文章的点赞数
 * @param blogName 文章名称
 * @returns 点赞数
 */
export async function getLikeCount(blogName: string): Promise<number> {
  try {
    const stats = await readStats();
    return stats.stats[blogName] || 0;
  } catch (error) {
    console.error(`获取文章"${blogName}"点赞数失败:`, error);
    return 0;
  }
}

/**
 * 获取所有文章的点赞统计
 * @returns 所有文章的点赞统计对象
 */
export async function getAllLikeStats(): Promise<Record<string, number>> {
  try {
    const stats = await readStats();
    return stats.stats;
  } catch (error) {
    console.error("获取所有点赞统计失败:", error);
    return {};
  }
}