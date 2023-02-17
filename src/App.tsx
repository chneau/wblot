import Konva from "konva";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Image as KonvaImage, Layer, Rect, Stage, Text } from "react-konva";

const ColoredRect = () => {
  const [color, setColor] = useState(Konva.Util.getRandomColor());
  return <Rect x={20} y={20} width={50} height={50} fill={color} shadowBlur={5} onClick={() => setColor(Konva.Util.getRandomColor())} />;
};

interface BorderRectWithText {
  value: number;
  x: number;
  y: number;
  width: number;
  height: number;
}
const BorderRectWithText = ({ value, x, y, width, height }: BorderRectWithText) => {
  const [xPos, setXPos] = useState(x);
  const [yPos, setYPos] = useState(y);
  const onDragMove = (evt: Konva.KonvaEventObject<DragEvent>) => {
    setXPos(evt.target.x());
    setYPos(evt.target.y());
  };
  return (
    <Layer x={xPos} y={yPos} onDragMove={onDragMove} draggable>
      <Text text={`${value}`} />
      <Rect width={width} height={height} stroke="red" strokeWidth={1} />
    </Layer>
  );
};

export const App = () => {
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);
  const onDrop = (files: File[]) => {
    const image = new Image();
    image.src = URL.createObjectURL(files[0]);
    image.onload = () => setImage(image);
  };
  const { getRootProps } = useDropzone({ onDrop, noClick: true });
  return (
    <div {...getRootProps()}>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>{image ? <KonvaImage image={image} /> : <Text text="Drag and drop a picture" x={window.innerWidth / 2} y={window.innerHeight / 2} />}</Layer>
        <BorderRectWithText value={550} x={50} y={50} width={45} height={15} />
        {/* TODO: How to keep track of the state of multiple of them? */}
        {/* as well, it needs a onDragMove callback to recalculate the value of the Rect from the image */}
      </Stage>
    </div>
  );
};
