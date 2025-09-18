'use client';

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Background() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === 'dark';
  const gradientBg = isDark 
    ? 'from-gray-900 via-gray-900 to-gray-800' 
    : 'from-gray-50 via-white to-gray-100';
  const circle1Color = isDark ? 'bg-blue-600/20' : 'bg-blue-400/15';
  const circle2Color = isDark ? 'bg-purple-600/20' : 'bg-purple-400/15';
  const circle3Color = isDark ? 'bg-pink-600/15' : 'bg-teal-400/10';
  const gridColor = isDark ? 'border-gray-800' : 'border-gray-200';

  return (
    <div className={`w-screen h-screen fixed inset-0 -z-10 bg-gradient-to-br ${gradientBg}`}>
      {/* 几何装饰元素 */}
      <div className="absolute w-full h-full inset-0 overflow-hidden">
        {/* 大型渐变圆形 */}
        <div className={`absolute top-[10%] right-[15%] w-[50vw] h-[50vw] rounded-full ${circle1Color} blur-3xl animate-pulse`} style={{ animationDuration: '8s' }} />
        
        <div className={`absolute bottom-[15%] left-[10%] w-[45vw] h-[45vw] rounded-full ${circle2Color} blur-3xl animate-pulse`} style={{ animationDuration: '10s', animationDelay: '2s' }} />
        
        <div className={`absolute top-[40%] left-[30%] w-[35vw] h-[35vw] rounded-full ${circle3Color} blur-3xl animate-pulse`} style={{ animationDuration: '12s', animationDelay: '1s' }} />
        
        {/* 网格纹理 - 仅在深色模式下显示 */}
        <div className={`absolute inset-0 ${isDark ? 'opacity-[0.03]' : 'opacity-0'}`}>
          <div className={`w-full h-full border-[1px] border-dashed ${gridColor} bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:40px_40px]`}></div>
        </div>
        
        {/* 细微粒子装饰 */}
        <div className={`absolute top-[20%] left-[25%] w-1 h-1 rounded-full bg-white ${isDark ? 'opacity-20' : 'opacity-10'} animate-pulse`} style={{ animationDuration: '3s' }} />
        <div className={`absolute top-[60%] right-[20%] w-1.5 h-1.5 rounded-full bg-white ${isDark ? 'opacity-20' : 'opacity-10'} animate-pulse`} style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
        <div className={`absolute bottom-[30%] left-[35%] w-1 h-1 rounded-full bg-white ${isDark ? 'opacity-20' : 'opacity-10'} animate-pulse`} style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className={`absolute top-[40%] right-[40%] w-1.5 h-1.5 rounded-full bg-white ${isDark ? 'opacity-20' : 'opacity-10'} animate-pulse`} style={{ animationDuration: '3.5s', animationDelay: '1.5s' }} />
      </div>
    </div>
  );
}