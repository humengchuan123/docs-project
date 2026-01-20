/*
 * @Author: humengchuan 531537052@qq.com
 * @Date: 2025-08-26 11:20:55
 * @LastEditors: humengchuan 531537052@qq.com
 * @LastEditTime: 2025-12-19 12:54:58
 * @FilePath: \project\work-tool\docs-vitepress\.vitepress\config.mjs
 * @Description: 
 */
import { defineConfig } from 'vitepress'
import { SearchPlugin } from 'vitepress-plugin-search';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "mengchuanの开发文档",
  description: "A VitePress Site",
  head: [
    ['link', { rel: 'icon',  href: '/favicon.ico' }]
  ],
  locales: {
    '/': { lang: 'en-US', title: 'English Docs', description: 'English documentation' },
    '/zh/': { lang: 'zh-CN', title: '中文文档', description: '中文文档说明' },
    // 添加更多语言...
  },
  themeConfig: {
    logo: {
      light: '/book.png',
      dark: '/book-dark.png'
    },
    search: {
      provider: 'local',
      options: {
        previewLength: 62,
        buttonLabel: '搜索',
        placeholder: '请输入关键词',
        // 如果需要针对不同语言的页面进行过滤，可以使用 allow 和 ignore 选项
        allow: ['/zh/', '/ja/'],
        ignore: [],
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        }

      }
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '示例', 
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
          { text: '开发学习', link: '/development' },
          { text: 'NodeJS文档', link: '/node-learn' },
          { text: 'CI/CD', link: '/src/build-story/jenkins' },
        ]
      },
      // { text: '开发学习', link: '/development' },
      // { text: '项目文档', link: '/api-project' },
      // { text: 'NodeJS文档', link: '/node-learn' },
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
          { text: 'Express&Koa', link: '/src/nodejs/express' },
          { text: 'Nest', link: '/src/nodejs/nest' },
          { text: 'Mysql', link: '/src/nodejs/mysql' },
          { text: 'Mongodb', link: '/src/nodejs/mongodb' },
          { text: 'Redis', link: '/src/nodejs/redis' },
          { text: '面试题', link: '/src/nodejs/interview' },
        ]
      },
      {
        text: 'golang',
        items: [
          { text: 'go', link: '/src/golang/index' },
          { text: 'gin', link: '/src/golang/gin' },
        ]
      },
      {
        text: 'CI/CD',
        items: [
          { text: 'Jenkins', link: '/src/build-story/jenkins' },
          { text: 'Docker', link: '/src/build-story/docker' },
          { text: 'Git', link: '/src/build-story/git' },
          { text: 'Gitlab', link: '/src/build-story/gitlab' },
          { text: 'Github', link: '/src/build-story/github' },
        ]
      },
      {
        text: 'Japanese',
        items: [
          { text: '日本語の勉強', link: '/japanese' },
          { text: '影子跟读', link: '/janpan-shadow-reading' },
          { text: '词汇', link: '/janpan-words' },
          { text: '文法', link: '/janpan-grammar' },
          { text: '听力', link: '/janpan-listening' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
  plugins: [SearchPlugin()]
})
