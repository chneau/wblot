import { createContext, ReactNode, useState } from "react";
import { useDropzone } from "react-dropzone";

export const DropzoneContext = createContext<{ image?: HTMLImageElement }>({});

export const DropzoneProvider = ({ children }: { children: ReactNode }) => {
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);
  const onDrop = (files: File[]) => {
    const image = new Image();
    image.src = URL.createObjectURL(files[0]);
    image.onload = () => setImage(image);
  };
  const { getRootProps } = useDropzone({ onDrop, noClick: true });
  return (
    <DropzoneContext.Provider value={{ image }}>
      <div {...getRootProps()}>{children}</div>
    </DropzoneContext.Provider>
  );
};
