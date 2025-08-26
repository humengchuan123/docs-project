/*
 * @Author: humengchuan 531537052@qq.com
 * @Date: 2025-08-26 11:20:55
 * @LastEditors: humengchuan 531537052@qq.com
 * @LastEditTime: 2025-08-26 11:52:00
 * @FilePath: \project\work-tool\docs-vitepress\.vitepress\config.mjs
 * @Description: 
 */
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "mengchuanの开发文档",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '示例', link: '/markdown-examples' },
      { text: '开发学习', link: '/development' },
      // { text: '项目文档', link: '/api-project' },
      { text: 'NodeJS文档', link: '/node-learn' },
      { text: '日本語の勉強', link: '/japanese' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      },
      {
        text: '开发学习',
        items: [
          { text: '开发学习', link: '/development' },
        ]
      },
      {
        text: '项目文档',
        items: [
          { text: '项目文档', link: '/api-project' },
        ]
      },
      {
        text: 'NodeJS',
        items: [
          { text: 'NodeJS', link: '/node-learn' },
        ]
      },
      {
        text: 'Japanese',
        items: [
          { text: '日本語の勉強', link: '/japanese' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
