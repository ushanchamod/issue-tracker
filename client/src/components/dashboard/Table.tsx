import React from "react";
import Loading from "../ui/Loading";
import Button from "../ui/Button";
import { Plus } from "lucide-react";

export interface Header {
  key: string;
  title: string;
  hidden?: boolean;
  align?: "left" | "center" | "right";
  bold?: number;
  element?: (row: any) => React.ReactNode;
  titleElement?: () => React.ReactNode;
  width?: string | number;
}

interface BasicTableProps {
  headers: Header[];
  rows: any[];
  headerColor?: string;
  borderHidden?: boolean;
  onlyBottomBorder?: boolean;
  fontSize?: string;
  rowHeight?: string;
  firstRowColor?: string | null;
  loading?: boolean;
  popup: (x: boolean) => void;
}

const Table: React.FC<BasicTableProps> = ({
  headers = [],
  rows = [],
  headerColor = "#f0f0f0",
  borderHidden = false,
  onlyBottomBorder = false,
  fontSize,
  rowHeight,
  firstRowColor = null,
  loading,
  popup,
}) => {
  if (rows.length === 0) {
    return (
      <div className="py-12 text-center">
        {loading && <Loading />}
        <div className="flex flex-col items-center justify-center space-y-4">
          <h3 className="text-xl font-medium text-gray-600">No issues found</h3>
          <p className="text-gray-500 max-w-md">
            We couldn't find any issues matching your criteria. Try adjusting
            your search or filters.
          </p>
          <div>
            <Button
              Icon={Plus}
              activeText="Add New Issue"
              className="text-nowrap bg-blue-500 hover:bg-blue-700 text-white py-2 px-5 rounded-sm font-bold cursor-pointer"
              onClick={() => popup(true)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* desktop */}
      <table className="w-full h-fit border-collapse relative hidden lg:block">
        {loading && <Loading />}
        <thead>
          <tr>
            {headers?.map((header, index) => {
              if (header.hidden) return null;
              return (
                <th
                  key={index}
                  className={`box-border p-2.5 text-left sticky top-0 z-[1] text-[#202224] whitespace-nowrap
                  ${
                    borderHidden || onlyBottomBorder
                      ? "border-none"
                      : "border border-[#D5D5D5]"
                  }
                  ${header.bold ? `font-[${header.bold}]` : "font-normal"}
                `}
                  style={{
                    textAlign: header.align,
                    backgroundColor: headerColor,
                    fontSize: fontSize ? fontSize : "16px",
                    height: rowHeight ? rowHeight : "auto",
                    width: header.width ? header.width : "auto",
                  }}
                >
                  {header.titleElement ? header.titleElement() : header.title}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => {
            if (row.hidden) return null;
            return (
              <Row
                key={index}
                borderHidden={borderHidden}
                onlyBottomBorder={onlyBottomBorder}
                row={row}
                headers={headers}
                fontSize={fontSize}
                rowHeight={rowHeight}
                firstRowColor={
                  firstRowColor && index === 0 ? firstRowColor : null
                }
              />
            );
          })}
        </tbody>
      </table>

      {/* mobile */}
      <div className="space-y-4 p-2 block lg:hidden">
        {loading && <Loading />}
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-4">
              {/* Main content area */}
              {headers
                .filter((header) => !header.hidden)
                .map((header, headerIndex) => {
                  if (header.key === "") {
                    // Action buttons column
                    return (
                      <div key={headerIndex} className="flex justify-end mt-2">
                        {header.element && header.element(row)}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={headerIndex}
                      className="mb-3 last:mb-0 border-b border-gray-100 last:border-0 pb-3 last:pb-0"
                    >
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {header.title}
                      </div>
                      <div className="mt-1 text-sm text-gray-800">
                        {header.element ? header.element(row) : row[header.key]}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const Row: React.FC<any> = ({
  row,
  headers,
  borderHidden,
  onlyBottomBorder,
  fontSize,
  rowHeight,
  firstRowColor = null,
}) => {
  return (
    <tr>
      {headers?.map((header: any, index: number) => {
        if (header.hidden) return null;
        return (
          <td
            key={index}
            className={`
              box-border p-2.5 text-[#202224] 
              ${
                borderHidden
                  ? "border-none"
                  : onlyBottomBorder
                  ? "border-b border-b-[#D5D5D5] border-l-0 border-r-0 border-t-0"
                  : "border border-[#D5D5D5]"
              }
              ${index === 0 ? "border-t-0" : ""}
              truncate
            `}
            style={{
              fontSize,
              height: rowHeight || "auto",
              background: firstRowColor || undefined,
              maxWidth: header.width,
              width: header.width,
              overflow: "hidden",
              padding: header.element ? "10px" : undefined,
              whiteSpace: "nowrap",
              textTransform: "unset",
            }}
            title={row[header.key]?.toString()}
          >
            {header.element ? header.element(row) : row[header.key]}
          </td>
        );
      })}
    </tr>
  );
};

export default Table;
