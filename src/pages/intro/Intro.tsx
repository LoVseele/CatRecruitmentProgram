// pages/intro/Intro.tsx
import { View, Text, Swiper, SwiperItem, Image } from "@tarojs/components";
import "../index.scss";
import "./intro.scss";
import { useState } from "react";
import { blocks } from "./data";
export default function Intro() {
  const [current, setCurrent] = useState(0);

  return (
    <View className="page-content">
      <Swiper
        className="intro"
        vertical
        duration={600}
        onChange={(e) => setCurrent(e.detail.current)}
      >
        {blocks.map((item, index) => (
          <SwiperItem key={index}>
            <View className={`intro-item ${current === index ? "active" : ""}`}>
              <View className="intro-item-title">{item.title}</View>
              {item.image && (
                <Image
                  className="intro-item-image"
                  src={item.image}
                  mode="widthFix"
                />
              )}
              <View>
                {item.paragraphs.map((p, idx) => (
                  <Text key={idx} className="intro-item-text">
                    {p}
                  </Text>
                ))}
              </View>
            </View>
          </SwiperItem>
        ))}
      </Swiper>
    </View>
  );
}
