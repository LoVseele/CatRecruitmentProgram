// src/app.ts
import "abortcontroller-polyfill/dist/abortcontroller-polyfill-only";

import { Component, PropsWithChildren } from "react";
import { Provider } from "react-redux"; // 引入 Provider
import { store } from "./store"; // 引入 store
import "./sdk";
import "./app.scss";
import { initializeAuth } from "./store/userSlice"; // 导入 initializeAuth

class App extends Component<PropsWithChildren> {
  componentDidMount() {
    // 在应用加载时，执行认证初始化逻辑
    store.dispatch(initializeAuth());
  }

  componentDidShow() {}

  componentDidHide() {}

  render() {
    // 使用 Provider 包裹整个应用
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

export default App;
