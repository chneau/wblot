import Konva from "konva";
import { BorderRectWithText } from "./BorderRectWithText";

export interface Rectangle {
  value: number;
  x: number;
  y: number;
}
interface RectangleManagerProps {
  rectangles: Rectangle[];
  setRectangles: (rectangles: Rectangle[]) => void;
  width: number;
  height: number;
}
export const RectangleManager = ({ rectangles, setRectangles, width, height }: RectangleManagerProps) => {
  const onDragMoveHandler = (idx: number, evt: Konva.KonvaEventObject<DragEvent>) => {
    const newRectangles = [...rectangles];
    newRectangles[idx] = { ...newRectangles[idx], x: evt.target.x(), y: evt.target.y() };
    setRectangles(newRectangles);
  };
  const onClickHandler = (idx: number, evt: Konva.KonvaEventObject<MouseEvent>) => {
    if (!evt.evt.ctrlKey) return;
    const newRectangles = rectangles.filter((_, i) => idx != i);
    setRectangles(newRectangles);
  };
  return (
    <>
      {rectangles.map((rect, idx) => (
        <BorderRectWithText //
          key={idx}
          width={width}
          height={height}
          onDragMove={(evt) => onDragMoveHandler(idx, evt)}
          onClick={(evt) => onClickHandler(idx, evt)}
          {...rect}
        />
      ))}
    </>
  );
};
