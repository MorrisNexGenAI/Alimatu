import React from 'react';
import { bomiStyles } from '../../templates/Bomi junior High/bomi';

interface AdminListProps {
  columns: string[];
  data: string[][];
  loading?: boolean;
}

export const AdminList: React.FC<AdminListProps> = ({ columns, data, loading = false }) => {
  return (
    <div className="overflow-x-auto">
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="border p-2 text-left"
                  style={{ backgroundColor: bomiStyles.backgroundColor }}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="border p-2 text-center">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border p-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};