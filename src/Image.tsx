import { useContext, useEffect, useRef, useState } from "react";
import { Image as KonvaImage, Layer, Text } from "react-konva";
import { BlotContext } from "./BlotContext";
import { Canvas } from "./Canvas";
import { RectangleManager } from "./RectangleManager";

export const Image = () => {
  const { image } = useContext(BlotContext);
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
        <Canvas parentWidth={parentWidth} parentHeight={parentHeight}>
          <Layer>
            {image ? <KonvaImage image={image} /> : <Text text="Drag and drop a picture" x={parentWidth / 2 - 60} y={parentHeight / 2 - 5} />}
            <RectangleManager />
          </Layer>
        </Canvas>
      )}
    </div>
  );
};
