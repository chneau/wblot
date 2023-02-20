import { Table } from "antd";
import { useContext } from "react";
import { BlotContext } from "../contexts/BlotContext";

export const TableLayout = () => {
  const { rectangles } = useContext(BlotContext);
  const sortedRectangles = [...rectangles].sort((a, b) => a.x - b.x);
  const values = [sortedRectangles.reduce((acc, cur, idx) => ({ ...acc, [idx]: cur.value }), { key: 0 })];
  const columns = sortedRectangles.map((_, idx) => ({ dataIndex: idx, title: idx + 1 }));
  return <div>{rectangles.length == 0 ? <>No data</> : <Table size="small" pagination={false} dataSource={values} columns={columns} />}</div>;
};
