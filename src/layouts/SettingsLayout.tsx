import { Button, Card, Form, Slider } from "antd";
import { useContext } from "react";
import { BlotContext } from "../contexts/BlotContext";

export const SettingsLayout = () => {
  const { rectangleWidth, setRectangleWidth, rectangleHeight, setRectangleHeight } = useContext(BlotContext);
  const reset = () => (setRectangleWidth(45), setRectangleHeight(15));
  return (
    <Card
      title={
        <>
          Settings
          <Button type="default" size="small" style={{ float: "right" }} onClick={reset}>
            Reset
          </Button>
        </>
      }
      size="small"
    >
      <Form.Item label="Width">
        <Slider min={5} max={100} onChange={setRectangleWidth} value={rectangleWidth} />
      </Form.Item>
      <Form.Item label="Height">
        <Slider min={5} max={40} onChange={setRectangleHeight} value={rectangleHeight} />
      </Form.Item>
    </Card>
  );
};
