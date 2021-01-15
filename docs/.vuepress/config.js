module.exports = {
  base: "/lite-virtual-list/",
  title: "lite-virtual-list",
  description: "基于vue的高性能虚拟列表组件库",
  head: [
    [
      "link",
      { rel: "shortcut icon", type: "image/x-icon", href: "./favicon.ico" }
    ]
  ],
  lastUpdated: "Last Updated",
  themeConfig: {
    displayAllHeaders: true, // 默认值：false
    nav: [
      {
        text: "指南",
        link: "/guide/"
      },
      {
        text: "Example",
        link: "/example/"
      },
      {
        text: "GitHub",
        link: "https://github.com/wensiyuanseven/lite-virtual-list"
      }
    ],
    sidebar: {
      "/guide/": ["", "use", "notice"],
      "/example/": ["", "variable", "waterfall", "status","deleteItem"],
      // fallback
      "/": [""]
    }
  }
};
