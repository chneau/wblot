import { Button, Card, Table } from "antd";
import { useContext } from "react";
import { BlotContext } from "../contexts/BlotContext";

export const TableLayout = () => {
  const { rectangles } = useContext(BlotContext);
  const sortedRectangles = [...rectangles].sort((a, b) => a.x - b.x);
  const values = [sortedRectangles.reduce((acc, cur, idx) => ({ ...acc, [idx]: cur.value }), { key: 0 })];
  const columns = sortedRectangles.map((_, idx) => ({ dataIndex: idx, title: idx + 1 }));
  const copyTable = () => navigator.clipboard.writeText(values.map((row) => Object.values(row).join("\t")).join("\r"));
  return (
    <Card
      title={
        <>
          Table
          <Button type="primary" size="small" style={{ float: "right" }} onClick={copyTable}>
            Copy
          </Button>
        </>
      }
      size="small"
    >
      <Table size="small" pagination={false} dataSource={values} columns={columns} style={{ overflow: "auto" }} />
    </Card>
  );
};
