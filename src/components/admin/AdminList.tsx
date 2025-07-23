import React, { JSX } from 'react';
import { bomiStyles } from '../../templates/Bomi junior High/bomi';

interface AdminListProps {
  columns: string[];
  data: (string | JSX.Element)[][];
  loading?: boolean;
}

export const AdminList: React.FC<AdminListProps> = ({ columns, data, loading = false }) => {
  return (
    <div className="overflow-x-auto mt-4">
      {loading ? (
        <div className="text-center py-4 text-gray-500">Loading...</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="border p-2 text-left text-sm font-medium"
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
                <td colSpan={columns.length} className="border p-2 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
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