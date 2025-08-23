import { View, Text, Image } from "@tarojs/components";
import "./index.scss";
import backgroundPic from '../../assets/images/xianluomao.png';
import sanhuamao from '../../assets/images/sanhuamao.png';
import jumao from '../../assets/images/jumao.png';

type TabKey = "intro" | "progress" | "profile";

interface Props {
  activeKey: TabKey;
  onChange: (key: TabKey) => void;
}

const items: Array<{ key: TabKey; text: string; icon: string }> = [
  { key: "intro", text: "介绍", icon: backgroundPic },
  { key: "progress", text: "进度", icon: sanhuamao },
  { key: "profile", text: "个人", icon: jumao },
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
          <Image
            src={i.icon}
            className="tab-icon"
            mode="widthFix"
          />
          <Text className="tab-text">{i.text}</Text>
        </View>
      ))}
    </View>
  );
}

