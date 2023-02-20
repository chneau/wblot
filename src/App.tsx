import { useContext, useState } from "react";
import { Image as KonvaImage, Layer, Text } from "react-konva";
import { Canvas } from "./Canvas";
import { DropzoneContext } from "./DropzoneContext";
import { Rectangle, RectangleManager } from "./RectangleManager";

const getPixelsValue = (image: HTMLImageElement | undefined, x: number, y: number, width: number, height: number) => {
  if (!image) return 0;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No context");
  ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  let sum = 0;
  for (let i = 0; i < data.length; i += 4) sum += data[i] + data[i + 1] + data[i + 2];
  return Math.round(sum / (data.length / 4));
};

export const App = () => {
  const { image } = useContext(DropzoneContext);
  const [width, setWidth] = useState(45);
  const [height, setHeight] = useState(15);
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const addRectangle = (rec: Omit<Rectangle, "value">) => setRectangles([...rectangles, { ...rec, value: getPixelsValue(image, rec.x, rec.y, width, height) }]);
  const deleteRectangle = (idx: number) => setRectangles(rectangles.filter((_, i) => i !== idx));
  const updateRectangle = (idx: number, rec: Omit<Rectangle, "value">) => setRectangles(rectangles.map((r, i) => (i === idx ? { ...r, ...rec, value: getPixelsValue(image, rec.x, rec.y, width, height) } : r)));
  return (
    <Canvas addRectangle={addRectangle} width={width} height={height}>
      <Layer>
        {image ? <KonvaImage image={image} /> : <Text text="Drag and drop a picture" x={window.innerWidth / 2} y={window.innerHeight / 2} />}
        <RectangleManager rectangles={rectangles} updateRectangle={updateRectangle} deleteRectangle={deleteRectangle} width={width} height={height} />
      </Layer>
    </Canvas>
  );
};
