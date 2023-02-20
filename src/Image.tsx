import { useContext, useEffect, useRef, useState } from "react";
import { Image as KonvaImage, Layer, Text } from "react-konva";
import { BlotContext, Rectangle } from "./BlotContext";
import { Canvas } from "./Canvas";
import { RectangleManager } from "./RectangleManager";

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

export const Image = () => {
  const { image, rectangleWidth, rectangleHeight } = useContext(BlotContext);
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const addRectangle = (rec: Omit<Rectangle, "value">) => setRectangles([...rectangles, { ...rec, x: rec.x - rectangleWidth / 2, y: rec.y - rectangleHeight / 2, value: getPixelsValue(image, rec.x, rec.y, rectangleWidth, rectangleHeight) }]);
  const deleteRectangle = (idx: number) => setRectangles(rectangles.filter((_, i) => i !== idx));
  const updateRectangle = (idx: number, rec: Omit<Rectangle, "value">) => setRectangles(rectangles.map((r, i) => (i === idx ? { ...r, ...rec, value: getPixelsValue(image, rec.x, rec.y, rectangleWidth, rectangleHeight) } : r)));
  const parentContainer = useRef<HTMLDivElement>(null);
  const [parentWidth, setParentWidth] = useState(0);
  const [parentHeight, setParentHeight] = useState(0);
  useEffect(() => {
    if (!parentContainer.current) return;
    const { width, height } = parentContainer.current.getBoundingClientRect();
    setParentWidth(width);
    setParentHeight(height);
  }, [parentContainer]);
  return (
    <div ref={parentContainer} style={{ minHeight: "100%" }}>
      {parentHeight && parentWidth && (
        <Canvas addRectangle={addRectangle} parentWidth={parentWidth} parentHeight={parentHeight}>
          <Layer>
            {image ? <KonvaImage image={image} /> : <Text text="Drag and drop a picture" x={parentWidth / 2 - 60} y={parentHeight / 2 - 5} />}
            <RectangleManager rectangles={rectangles} updateRectangle={updateRectangle} deleteRectangle={deleteRectangle} width={rectangleWidth} height={rectangleHeight} />
          </Layer>
        </Canvas>
      )}
    </div>
  );
};
