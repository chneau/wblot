import Konva from "konva";
import { useContext } from "react";
import { BlotContext } from "../contexts/BlotContext";
import { Rectangle } from "./Rectangle";

export const Rectangles = () => {
  const { deleteRectangle, updateRectangle, rectangles, rectangleHeight, rectangleWidth } = useContext(BlotContext);
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
        <Rectangle //
          key={idx}
          width={rectangleWidth}
          height={rectangleHeight}
          onDragMove={(evt) => onDragMoveHandler(idx, evt)}
          onClick={(evt) => onClickHandler(idx, evt)}
          {...rect}
        />
      ))}
    </>
  );
};
