import Konva from "konva";
import { useState } from "react";
import { Layer, Rect, Stage, Text } from "react-konva";

const ColoredRect = () => {
  const [color, setColor] = useState(Konva.Util.getRandomColor());
  const handleClick = () => setColor(Konva.Util.getRandomColor());
  return <Rect x={20} y={20} width={50} height={50} fill={color} shadowBlur={5} onClick={handleClick} />;
};

export const App = () => {
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Text text="Try click on rect" />
        <ColoredRect />
      </Layer>
    </Stage>
  );
};
