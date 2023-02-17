import { useContext, useState } from "react";
import { Image as KonvaImage, Layer, Text } from "react-konva";
import { Canvas } from "./Canvas";
import { DropzoneContext } from "./DropzoneContext";
import { Rectangle, RectangleManager } from "./RectangleManager";

export const App = () => {
  const { image } = useContext(DropzoneContext);
  const [width, setWidth] = useState(45);
  const [height, setHeight] = useState(15);
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const addRectangle = (rectangle: Rectangle) => setRectangles([...rectangles, rectangle]);
  const deleteRectangle = (idx: number) => setRectangles(rectangles.filter((_, i) => i !== idx));
  const updateRectangle = (idx: number, rectangle: Partial<Rectangle>) => setRectangles(rectangles.map((r, i) => (i === idx ? { ...r, ...rectangle } : r)));
  return (
    <Canvas addRectangle={addRectangle} width={width} height={height}>
      <Layer>
        {image ? <KonvaImage image={image} /> : <Text text="Drag and drop a picture" x={window.innerWidth / 2} y={window.innerHeight / 2} />}
        <RectangleManager rectangles={rectangles} updateRectangle={updateRectangle} deleteRectangle={deleteRectangle} width={width} height={height} />
      </Layer>
    </Canvas>
  );
};
