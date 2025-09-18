'use client';

import { useEffect, useState } from "react";

export default function ClickEffect() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let a_idx = 0;
    const a = ["❤富强❤", "❤民主❤", "❤文明❤", "❤和谐❤", "❤自由❤", "❤平等❤", "❤公正❤", "❤法治❤", "❤爱国❤", 
               "❤敬业❤", "❤诚信❤", "❤友善❤"];

    function randomColor() {
      return "rgb(" + (~~(Math.random() * 255)) + "," + (~~(Math.random() * 255)) + "," + (~~(Math.random() * 255)) + ")";
    }

    function handleClick(event: MouseEvent) {
      const heart = document.createElement("b");
      // 防止拖动
      heart.onselectstart = new Function('event.returnValue=false');
      
      document.body.appendChild(heart).innerHTML = a[a_idx];
      a_idx = (a_idx + 1) % a.length;
      heart.style.cssText = "position: fixed;left:-100%;pointer-events: none;";

      const f = 16, // 字体大小
            x = event.clientX - f / 2, // 横坐标
            y = event.clientY - f, // 纵坐标
            c = randomColor(), // 随机颜色
            a = 1, // 透明度
            s = 1.2; // 放大缩小

      const timer = setInterval(function () {
        if (heart.style.opacity && parseFloat(heart.style.opacity) <= 0) {
          document.body.removeChild(heart);
          clearInterval(timer);
        } else {
          heart.style.cssText = "font-size:16px;cursor: default;position: fixed;color:" +
              c + ";left:" + x + "px;top:" + y + "px;opacity:" + a + ";transform:scale(" +
              s + ");pointer-events: none;z-index: 9999;";

          y--;
          a -= 0.016;
          s += 0.002;
        }
      }, 15);
    }

    // 添加点击事件监听器
    window.addEventListener('click', handleClick);

    // 组件卸载时移除事件监听器
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  return null;
}