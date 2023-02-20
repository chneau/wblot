import { Col, Layout, Row } from "antd";
import "antd/dist/reset.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BlotProvider } from "./contexts/BlotProvider";
import { CanvasLayout } from "./layouts/CanvasLayout";
import { Table } from "./layouts/TableLayout";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BlotProvider>
      <Layout>
        <Layout.Content>
          <Row style={{ minHeight: window.innerHeight }}>
            <Col span={18}>
              <CanvasLayout />
            </Col>
            <Col span={6}>
              <Table />
            </Col>
          </Row>
        </Layout.Content>
      </Layout>
    </BlotProvider>
  </StrictMode>
);
