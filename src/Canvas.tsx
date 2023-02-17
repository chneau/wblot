import Konva from "konva";
import { ReactElement } from "react";
import { Stage } from "react-konva";
import { Rectangle } from "./RectangleManager";

interface CanvasProps {
  addRectangle: (rectangle: Rectangle) => void;
  children: ReactElement;
  width: number;
  height: number;
}
export const Canvas = ({ addRectangle, children, height, width }: CanvasProps) => {
  const onCanvasClick = (evt: Konva.KonvaEventObject<MouseEvent>) => {
    if (!evt.evt.ctrlKey) return;
    const stage = evt.target.getStage();
    if (!stage) return console.error("No stage");
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return console.error("No pointer position");
    let { x, y } = pointerPosition;
    x -= width / 2;
    y -= height / 2;
    addRectangle({ value: 0, x, y });
  };
  return (
    <Stage width={window.innerWidth} height={window.innerHeight} onClick={onCanvasClick}>
      {children}
    </Stage>
  );
};
