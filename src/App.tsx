import Konva from "konva";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Image as KonvaImage, Layer, Rect, Stage, Text } from "react-konva";

const ColoredRect = () => {
  const [color, setColor] = useState(Konva.Util.getRandomColor());
  return <Rect x={20} y={20} width={50} height={50} fill={color} shadowBlur={5} onClick={() => setColor(Konva.Util.getRandomColor())} />;
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
        <Layer>{image ? <KonvaImage image={image} /> : <Text text="Drag and drop a picture" />}</Layer>
      </Stage>
    </div>
  );
};
