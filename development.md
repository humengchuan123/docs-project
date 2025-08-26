<!--
 * @Author: humengchuan 531537052@qq.com
 * @Date: 2025-08-26 11:36:40
 * @LastEditors: humengchuan 531537052@qq.com
 * @LastEditTime: 2025-08-26 18:39:51
 * @FilePath: \project\work-tool\docs-vitepress\development.md
 * @Description:
-->

# 开发文档

### 标签说明

layout:
用于指定页面使用的布局。VitePress 默认提供了三种布局：home、doc 和 page。

home: 用于首页，通常包含英雄单元（hero）、特性（features）等元素。

doc: 适用于文档页面，具有默认的文档样式。

page: 类似于 doc，但不应用任何额外的样式。

hero:
当使用 layout: home 时有效，定义了主页顶部的英雄单元。
可以包括 name, text, tagline, image, 和 actions 等属性。

name: 文档标题。
text: 副标题/描述。
tagline: 文档标语。
image: 图片配置，可以是左侧或右侧展示的图片。
actions: 操作按钮，如“开始”、“了解更多”等。

features:
同样是在 layout: home 下使用的，列出了若干个特性卡片，每个特性卡片可以有自己的图标、标题和描述。
有助于突出产品或项目的不同特性和优势。

actions:
在 hero 配置中使用，表示一系列的操作按钮，每个按钮可以有文本和链接。
theme: 按钮主题，可选值为 brand 或 alt，分别对应不同的样式。
text: 按钮文本。

其他可能用到的 Frontmatter 属性
title: 页面标题，会显示在浏览器标签上。
description: 页面描述，通常用于 SEO 的 meta 描述。
head: 自定义头部信息，比如添加 meta 标签或者 link 标签。
editLink: 控制是否显示编辑此页链接。
lastUpdated: 显示最后更新时间。
outline: 控制目录（大纲）是否显示以及其标题。
