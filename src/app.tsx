// src/app.ts

import { Component, PropsWithChildren } from "react";
import { Provider } from "react-redux"; // 引入 Provider
import { store } from "./store"; // 引入 store
import "./sdk";
import "./app.scss";

class App extends Component<PropsWithChildren> {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    // 使用 Provider 包裹整个应用
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

export default App;
