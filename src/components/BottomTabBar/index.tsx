import { View, Text } from "@tarojs/components";
import "./index.scss";

interface Props {
  activeKey: "intro" | "progress" | "profile";
  onChange: (key: Props["activeKey"]) => void;
}

const items: Array<{ key: Props["activeKey"]; text: string }> = [
  { key: "intro", text: "介绍" },
  { key: "progress", text: "进度" },
  { key: "profile", text: "个人" },
];

export default function BottomTabBar({ activeKey, onChange }: Props) {
  return (
    <View className="bottom-tab-bar">
      {items.map((i) => (
        <View
          key={i.key}
          className={`tab-bar-item ${activeKey === i.key ? "active" : ""}`}
          onClick={() => onChange(i.key)}
        >
          <Text className="tab-text">{i.text}</Text>
        </View>
      ))}
    </View>
  );
}
