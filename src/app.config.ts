// src/app.config.ts
export default {
  pages: [
    "pages/index/index",
    "pages/profile/ProLogic",
    "pages/profile/registration/registration",
    "pages/profile/notifications/notifications",
    "pages/profile/contact/contact",
  ], // 目标页面（添加这一行）
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
