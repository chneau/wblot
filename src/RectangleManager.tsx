import Konva from "konva";
import { useContext } from "react";
import { BlotContext } from "./BlotContext";
import { BorderRectWithText } from "./BorderRectWithText";

export const RectangleManager = () => {
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
        <BorderRectWithText //
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
