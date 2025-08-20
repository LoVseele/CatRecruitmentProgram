// src/app.config.ts
export default {
  pages: ["pages/index/index"],
  window: {
    navigationStyle: "custom",
  },
  // 关键：仅保留 pagePath 和 text，删除 iconPath/selectedIconPath
  /*   tabBar: {
    list: [
      {
        pagePath: "pages/intro/index",
        text: "",
      },
      {
        pagePath: "pages/progress/index",
        text: "",
      },
      {
        pagePath: "pages/profile/index",
        text: "",
      },
    ],
  }, */
};
