import React from 'react';

interface Column {
  key: string;
  label: string;
  render?: (item: any) => React.ReactNode;
}

interface ReusableTableProps {
  columns: Column[];
  data: any[];
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
}

const ReusableTable: React.FC<ReusableTableProps> = ({ columns, data, onEdit, onDelete }) => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-200">
          {columns.map((col) => (
            <th key={col.key} className="border p-2">{col.label}</th>
          ))}
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="border">
            {columns.map((col) => (
              <td key={col.key} className="p-2">
                {col.render ? col.render(item) : item[col.key]}
              </td>
            ))}
            <td className="p-2">
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                onClick={() => onEdit(item)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => onDelete(item)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ReusableTable;