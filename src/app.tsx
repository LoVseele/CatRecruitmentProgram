import "abortcontroller-polyfill/dist/abortcontroller-polyfill-only";
import { Component, PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import "./sdk";
import "./app.scss";
import { initializeAuth } from "./store/userSlice";

class App extends Component<PropsWithChildren> {
  componentDidMount() {
    // 在应用加载时，执行认证初始化逻辑
    store.dispatch(initializeAuth());
  }

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

export default App;
