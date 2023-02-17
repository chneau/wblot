import { useDropzone } from "react-dropzone";

interface DropzoneProps {
  setImage: (image: HTMLImageElement) => void;
  children: React.ReactNode;
}
export const Dropzone = ({ setImage, children }: DropzoneProps) => {
  const onDrop = (files: File[]) => {
    const file = files[0];
    console.log(`File ${file.name} dropped`);
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = () => setImage(image);
  };
  const { getRootProps } = useDropzone({ onDrop, noClick: true });
  return <div {...getRootProps}>{children}</div>;
};
