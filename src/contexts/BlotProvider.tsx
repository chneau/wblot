import { ReactNode, useState } from "react";
import { useDropzone } from "react-dropzone";
import { BlotContext, Rectangle } from "./BlotContext";

export const BlotProvider = ({ children }: { children: ReactNode }) => {
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);
  const [rectangleWidth, setRectangleWidth] = useState(45);
  const [rectangleHeight, setRectangleHeight] = useState(15);
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const addRectangle = (rec: Omit<Rectangle, "value">) => setRectangles([...rectangles, { ...rec, x: rec.x - rectangleWidth / 2, y: rec.y - rectangleHeight / 2, value: getPixelsValue(image, rec.x, rec.y, rectangleWidth, rectangleHeight) }]);
  const deleteRectangle = (idx: number) => setRectangles(rectangles.filter((_, i) => i !== idx));
  const updateRectangle = (idx: number, rec: Omit<Rectangle, "value">) => setRectangles(rectangles.map((r, i) => (i === idx ? { ...r, ...rec, value: getPixelsValue(image, rec.x, rec.y, rectangleWidth, rectangleHeight) } : r)));
  const onDrop = (files: File[]) => {
    const image = new Image();
    image.src = URL.createObjectURL(files[0]);
    image.onload = () => setImage(image);
  };
  const { getRootProps } = useDropzone({ onDrop, noClick: true });
  return (
    <BlotContext.Provider
      value={{
        image, //
        rectangleWidth,
        setRectangleHeight,
        rectangleHeight,
        setRectangleWidth,
        rectangles,
        addRectangle,
        deleteRectangle,
        updateRectangle,
      }}
    >
      <div {...getRootProps()}>{children}</div>
    </BlotContext.Provider>
  );
};

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
