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
  element?: (row: any) => void;
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
  return (
    <>
      {loading && <Loading />}
      {rows.length > 0 && (
        <table className="w-full h-fit border-collapse relative">
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
            {rows.length > 0 &&
              rows?.map((row, index) => {
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
      )}

      {rows.length === 0 && (
        <div className="py-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h3 className="text-xl font-medium text-gray-600">
              No issues found
            </h3>
            <p className="text-gray-500 max-w-md">
              We couldn't find any issues matching your criteria. Try adjusting
              your search or filters.
            </p>

            <div>
              <Button
                Icon={Plus}
                activeText="Add New Issue"
                className="text-nowrap bg-blue-500 hover:bg-blue-700 text-white py-2 px-5 rounded-sm font-bold cursor-pointer "
                onClick={() => popup(true)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface RowProps {
  row: any;
  headers: Header[];
  borderHidden: boolean;
  onlyBottomBorder: boolean;
  fontSize?: string;
  rowHeight?: string;
  firstRowColor?: string | null;
}

const Row: React.FC<RowProps> = ({
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
      {headers?.map((header, index) => {
        if (header.hidden) return null;
        return (
          <td
            key={index}
            className={`
                      box-border p-2.5  text-[#202224] 
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
