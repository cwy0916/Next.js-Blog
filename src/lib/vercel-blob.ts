import { put } from '@vercel/blob';

/**
 * 从 Vercel Blob 读取数据
 * @param blobPath Blob 路径
 * @returns 解析后的 JSON 数据或默认值
 */
export async function readFromBlob<T>(blobPath: string, defaultValue: T): Promise<T> {
  try {
    // 直接使用 fetch 获取 blob 内容
    const response = await fetch(blobPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch blob: ${response.status}`);
    }
    const content = await response.text();
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`读取 Blob ${blobPath} 失败:`, error);
    return defaultValue;
  }
}

/**
 * 写入数据到 Vercel Blob
 * @param blobPath Blob 路径
 * @param data 要写入的数据
 * @returns 操作是否成功
 */
export async function writeToBlob<T>(blobPath: string, data: T): Promise<boolean> {
  try {
    await put(blobPath, JSON.stringify(data, null, 2), {
      access: 'public',
      contentType: 'application/json'
    });
    return true;
  } catch (error) {
    console.error(`写入 Blob ${blobPath} 失败:`, error);
    return false;
  }
}