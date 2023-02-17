import Konva from "konva";
import { BorderRectWithText } from "./BorderRectWithText";

export interface Rectangle {
  value: number;
  x: number;
  y: number;
}
interface RectangleManagerProps {
  rectangles: Rectangle[];
  deleteRectangle: (idx: number) => void;
  updateRectangle: (idx: number, rectangle: Omit<Rectangle, "value">) => void;
  width: number;
  height: number;
}
export const RectangleManager = ({ rectangles, deleteRectangle, updateRectangle, width, height }: RectangleManagerProps) => {
  const onDragMoveHandler = (idx: number, evt: Konva.KonvaEventObject<DragEvent>) => {
    const newRectangles = [...rectangles];
    newRectangles[idx] = { ...newRectangles[idx], x: evt.target.x(), y: evt.target.y() };
    updateRectangle(idx, { x: evt.target.x(), y: evt.target.y() });
  };
  const onClickHandler = (idx: number, evt: Konva.KonvaEventObject<MouseEvent>) => {
    if (!evt.evt.ctrlKey) return;
    deleteRectangle(idx);
    evt.cancelBubble = true;
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
