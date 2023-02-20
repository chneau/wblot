import { createContext, ReactNode, useState } from "react";
import { useDropzone } from "react-dropzone";

interface BlotContextProps {
  image?: HTMLImageElement;
  rectangleWidth: number;
  rectangleHeight: number;
  setRectangleWidth: (width: number) => void;
  setRectangleHeight: (height: number) => void;
}
export interface Rectangle {
  value: number;
  x: number;
  y: number;
}
export const BlotContext = createContext<BlotContextProps>({ rectangleWidth: 45, rectangleHeight: 15 } as BlotContextProps);

export const BlotProvider = ({ children }: { children: ReactNode }) => {
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);
  const [rectangleWidth, setRectangleWidth] = useState(45);
  const [rectangleHeight, setRectangleHeight] = useState(15);
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const onDrop = (files: File[]) => {
    const image = new Image();
    image.src = URL.createObjectURL(files[0]);
    image.onload = () => setImage(image);
  };
  const { getRootProps } = useDropzone({ onDrop, noClick: true });
  return (
    <BlotContext.Provider value={{ image, rectangleWidth, rectangleHeight, setRectangleWidth, setRectangleHeight }}>
      <div {...getRootProps()}>{children}</div>
    </BlotContext.Provider>
  );
};
