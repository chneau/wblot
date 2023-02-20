import { Col, Layout, Row } from "antd";
import "antd/dist/reset.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DropzoneProvider } from "./DropzoneContext";
import { Image } from "./Image";
import { Table } from "./Table";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DropzoneProvider>
      <Layout>
        <Layout.Content>
          <Row style={{ minHeight: window.innerHeight }}>
            <Col span={18}>
              <Image />
            </Col>
            <Col span={6}>
              <Table />
            </Col>
          </Row>
        </Layout.Content>
      </Layout>
    </DropzoneProvider>
  </StrictMode>
);
