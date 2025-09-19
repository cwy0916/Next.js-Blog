"use server"

import fs from "fs/promises";
import path from "path";
import { readFromBlob, writeToBlob } from '@/lib/vercel-blob';

interface ReadStatsData {
  stats: Record<string, number>;
}

// 是否在 Vercel 环境中
const isVercel = process.env.NEXT_DEPLOY_VERCEL === 'true';

// 读取阅读量统计数据
async function readStats(): Promise<ReadStatsData> {
  if (isVercel) {
    // 在 Vercel 环境中使用 Blob 存储
    return await readFromBlob<ReadStatsData>('read-stats.json', { stats: {} });
  } else {
    // 在本地环境中使用文件系统
    try {
      const statsPath = path.join(process.cwd(), "src/data/read-stats.json");
      const data = await fs.readFile(statsPath, "utf-8");
      return JSON.parse(data) as ReadStatsData;
    } catch (error) {
      console.error("读取阅读量数据失败:", error);
      return { stats: {} };
    }
  }
}

// 保存阅读量统计数据
async function saveStats(stats: ReadStatsData): Promise<void> {
  if (isVercel) {
    // 在 Vercel 环境中使用 Blob 存储
    await writeToBlob('read-stats.json', stats);
  } else {
    // 在本地环境中使用文件系统
    try {
      const statsPath = path.join(process.cwd(), "src/data/read-stats.json");
      await fs.writeFile(statsPath, JSON.stringify(stats, null, 2), "utf-8");
    } catch (error) {
      console.error("保存阅读量数据失败:", error);
    }
  }
}

/**
 * 增加指定文章的阅读量
 * @param blogName 文章名称
 * @returns 增加后的阅读量
 */
export async function incrementReadCount(blogName: string): Promise<number> {
  try {
    const stats = await readStats();
    
    // 检查该文章是否已有阅读量记录，如果没有则初始化为0
    if (!stats.stats[blogName]) {
      stats.stats[blogName] = 0;
    }
    
    // 增加阅读量
    stats.stats[blogName]++;
    
    // 保存更新后的阅读量
    await saveStats(stats);
    
    return stats.stats[blogName];
  } catch (error) {
    console.error(`增加文章"${blogName}"阅读量失败:`, error);
    return 0;
  }
}

/**
 * 获取指定文章的阅读量
 * @param blogName 文章名称
 * @returns 阅读量
 */
export async function getReadCount(blogName: string): Promise<number> {
  try {
    const stats = await readStats();
    return stats.stats[blogName] || 0;
  } catch (error) {
    console.error(`获取文章"${blogName}"阅读量失败:`, error);
    return 0;
  }
}

/**
 * 获取所有文章的阅读量统计
 * @returns 所有文章的阅读量统计对象
 */
export async function getAllReadStats(): Promise<Record<string, number>> {
  try {
    const stats = await readStats();
    return stats.stats;
  } catch (error) {
    console.error("获取所有阅读量统计失败:", error);
    return {};
  }
}