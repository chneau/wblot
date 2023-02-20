import { createContext } from "react";

export interface Rectangle {
  value: number;
  x: number;
  y: number;
}

interface BlotContextProps {
  image?: HTMLImageElement;
  rectangleWidth: number;
  setRectangleWidth: (width: number) => void;
  rectangleHeight: number;
  setRectangleHeight: (height: number) => void;
  rectangles: Rectangle[];
  addRectangle: (rec: Omit<Rectangle, "value">) => void;
  deleteRectangle: (idx: number) => void;
  updateRectangle: (idx: number, rec: Omit<Rectangle, "value">) => void;
}
export const BlotContext = createContext<BlotContextProps>({ rectangleWidth: 45, rectangleHeight: 15 } as BlotContextProps);
