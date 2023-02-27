import { Card, Slider } from "antd";
import { useContext } from "react";
import { BlotContext } from "../contexts/BlotContext";

export const SettingsLayout = () => {
  const { rectangleWidth, setRectangleWidth, rectangleHeight, setRectangleHeight } = useContext(BlotContext);
  return (
    <Card title="Settings" size="small">
      <Slider min={5} max={100} onChange={setRectangleWidth} value={rectangleWidth} />
      <Slider min={5} max={40} onChange={setRectangleHeight} value={rectangleHeight} />
    </Card>
  );
};
