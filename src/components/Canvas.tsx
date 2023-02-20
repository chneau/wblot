import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { ReactElement, useContext, useState } from "react";
import { Stage } from "react-konva";
import { BlotContext } from "../contexts/BlotContext";

interface CanvasProps {
  children: ReactElement;
  parentWidth: number;
  parentHeight: number;
}
export const Canvas = ({ children, parentHeight, parentWidth }: CanvasProps) => {
  const { addRectangle } = useContext(BlotContext);
  const [canvasX, setCanvasX] = useState(0);
  const [canvasY, setCanvasY] = useState(0);
  const onCanvasClick = (evt: Konva.KonvaEventObject<MouseEvent>) => {
    if (!evt.evt.ctrlKey) return;
    const stage = evt.target.getStage();
    if (!stage) return console.error("No stage");
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return console.error("No pointer position");
    let { x, y } = pointerPosition;
    addRectangle({ x: x - canvasX, y: y - canvasY });
  };
  const onDragEnd = (evt: KonvaEventObject<DragEvent>) => {
    setCanvasX(evt.target.x());
    setCanvasY(evt.target.y());
  };
  return (
    <Stage width={parentWidth} height={parentHeight} onClick={onCanvasClick} draggable onDragEnd={onDragEnd}>
      {children}
    </Stage>
  );
};
