import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { DropzoneProvider } from "./DropzoneContext";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("No root element found");

createRoot(rootElement).render(
  <StrictMode>
    <DropzoneProvider>
      <App />
    </DropzoneProvider>
  </StrictMode>
);
