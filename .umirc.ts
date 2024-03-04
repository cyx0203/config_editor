import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  // layout: {
  //   name: '公用 - 配置工具',
  //   locale: true,
  //   layout: 'top',
  // },
  hash: true,
  history: {
    type: 'hash',
  },
  base: './',
  publicPath: './',
  title: '公用 - 配置工具',
  theme: {
    'border-radius-base': '4px',
  },
  routes: [
    {
      path: '/',
      redirect: '/components',
    },
    {
      path: '/components',
      component: '@/layout',
      routes: [
        {
          path: '/components',
          redirect: '/components/admin',
        },
        {
          path: 'editor',
          component: '@/pages/form',
        },
        {
          path: 'admin',
          component: '@/pages/admin',
        },
        {
          path: 'editor2',
          component: '@/pages/menu',
        },
      ],
    },
  ],
  fastRefresh: {},
  antd: {},
  mfsu: {},
  webpack5: {},
  // exportStatic: {},
  headScripts: [
    {
      content: `
        try {
          const { ipcRenderer } = require('electron');
          window.ipcRenderer = ipcRenderer;
        } catch (error) {
          console.warn('需要在 electron 环境下运行');
        }`,
      charset: 'utf-8',
    },
  ],
});
