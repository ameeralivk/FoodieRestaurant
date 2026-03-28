import React from "react";
import { Eye, Pencil, Trash2, User } from "lucide-react";
import LoadingRow from "../SuperAdmin/LoadingRow";
import jsPDF from "jspdf";
import QRCodeLib from "qrcode";

/* ===================== TYPES ===================== */

interface Column {
  header: string;
  accessor: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface ImageField {
  accessor: string;
  alt?: string;
  size?: string;
  rounded?: boolean;
}

type ActionType = "view" | "edit" | "delete";

interface Action {
  type: ActionType;
  onClick: (row: any) => void;
}

interface ToggleField {
  accessor: string;
  invert?: boolean;
  toggleSize?: string;
  onToggle: (row: any, newValue: boolean) => void;
}

interface QRField {
  enabled: boolean;
  urlAccessor: string; // field name in row
}

interface ReusableTableProps {
  title?: string;
  columns?: Column[];
  data?: any[];
  actions?: Action[];
  actionStyle?: string;
  toggleField?: ToggleField;
  qrField?: QRField;
  imageField?: ImageField;
  loading: boolean;
  minWidth?: string;
}

/* ===================== COMPONENT ===================== */

const ReusableTable: React.FC<ReusableTableProps> = ({
  columns = [],
  data = [],
  actions,
  toggleField,
  actionStyle,
  qrField,
  imageField,
  loading,
  minWidth = "min-w-[1100px]",
}) => {
  const colSpan =
    columns.length +
    (imageField ? 1 : 0) +
    (actions ? 1 : 0) +
    (toggleField ? 1 : 0) +
    (qrField?.enabled ? 1 : 0);

  /* ===================== HELPERS ===================== */

  const renderValue = (value: any, col: Column, row: any) => {
    if (col.render) return col.render(value, row);
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "object" && value !== null)
      return JSON.stringify(value);
    return value;
  };

  /* ===================== QR DOWNLOAD ===================== */

  const handleDownloadQR = async (text: string, rowId: string) => {
    if (!text) {
      alert("QR data missing");
      return;
    }

    try {
      const qrDataUrl = await QRCodeLib.toDataURL(text, {
        width: 300,
        margin: 2,
      });

      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Restaurant QR Code", 105, 20, { align: "center" });
      doc.addImage(qrDataUrl, "PNG", 55, 35, 100, 100);
      doc.setFontSize(12);
      doc.text(`Table ID: ${rowId}`, 105, 150, { align: "center" });
      doc.save(`QRCode-${rowId}.pdf`);
    } catch (error) {
      console.error("QR download failed", error);
    }
  };

  /* ===================== JSX ===================== */

  return (
    <div>
      <div className={`max-w-7xl mx-auto ${minWidth}`}>
        <div className="bg-gray-900 rounded-lg shadow-xl border border-gray-700 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                {imageField && (
                  <th className="py-4 px-6 text-gray-300 font-semibold"></th>
                )}

                {columns.map((col, index) => (
                  <th
                    key={index}
                    className="py-4 px-6 text-left text-gray-300 font-semibold"
                  >
                    {col.header}
                  </th>
                ))}

                {actions && (
                  <th className="py-4 px-6 text-gray-300 font-semibold">
                    Actions
                  </th>
                )}

                {toggleField && (
                  <th className="py-4 px-6 text-gray-300 font-semibold">
                    Status
                  </th>
                )}

                {qrField?.enabled && (
                  <th className="py-4 px-6 text-gray-300 font-semibold">QR</th>
                )}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <LoadingRow colSpan={colSpan} />
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={colSpan}
                    className="text-center py-6 text-gray-400"
                  >
                    No data found.
                  </td>
                </tr>
              ) : (
                data.map((row: any) => (
                  <tr
                    key={row._id || row.id || row.tableNo}
                    className="border-b border-gray-700 hover:bg-gray-800 transition"
                  >
                    {imageField && (
                      <td className="py-4 px-6">
                        {row[imageField.accessor] ? (
                          <img
                            src={row[imageField.accessor]}
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-500" />
                          </div>
                        )}
                      </td>
                    )}
                    {/* DATA COLUMNS */}
                    {/* {columns.map((col, idx) => (
                      <td key={idx} className="py-4 px-6 text-gray-300">
                        {renderValue(row[col.accessor], col, row)}
                      </td>
                    ))} */}
                    {columns.map((col, idx) => (
                      <td
                        key={idx}
                        className="py-4 px-6 text-gray-300 max-w-[200px] break-words whitespace-normal"
                      >
                        {renderValue(row[col.accessor], col, row)}
                      </td>
                    ))}

                    {/* ACTIONS */}
                    {actions && (
                      <td className="py-4 px-6 text-center">
                        <div
                          className={`flex items-center justify-center gap-3 ${actionStyle ?? ""}`}
                        >
                          {actions.map((action, idx) => {
                            let icon = null;
                            let color = "";

                            switch (action.type) {
                              case "view":
                                icon = <Eye size={18} />;
                                color = "text-blue-400 hover:text-blue-300";
                                break;
                              case "edit":
                                icon = <Pencil size={18} />;
                                color = "text-amber-400 hover:text-amber-300";
                                break;
                              case "delete":
                                icon = <Trash2 size={18} />;
                                color = "text-red-400 hover:text-red-300";
                                break;
                            }

                            return (
                              <button
                                key={idx}
                                onClick={() => action.onClick(row)}
                                className={color}
                              >
                                {icon}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    )}

                    {/* TOGGLE */}
                    {toggleField && (
                      <td className="py-4 px-6">
                        {(() => {
                          const raw = Boolean(row[toggleField.accessor]);
                          const checked = toggleField.invert ? !raw : raw;

                          return (
                            <div
                              className={`pl-${
                                toggleField.toggleSize
                                  ? toggleField.toggleSize
                                  : ""
                              }`}
                            >
                              <label className="inline-flex items-center cursor-pointer relative ml-8">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={checked}
                                  onChange={() =>
                                    toggleField.onToggle(row, !raw)
                                  }
                                />
                                <div className="w-11 h-6 bg-gray-600 rounded-full peer-checked:bg-green-500 transition"></div>
                                <div className="w-5 h-5 bg-white rounded-full absolute left-1 top-0.5 peer-checked:translate-x-5 transition"></div>
                              </label>
                            </div>
                          );
                        })()}
                      </td>
                    )}

                    {/* QR DOWNLOAD ONLY */}
                    {qrField?.enabled && (
                      <td className="py-4 px-6">
                        <button
                          onClick={() =>
                            handleDownloadQR(
                              row[qrField.urlAccessor],
                              row._id || row.id || row.tableNo,
                            )
                          }
                          className="bg-blue-500 text-white px-3 ml-6 py-1 rounded hover:bg-blue-400"
                        >
                          Download QR
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReusableTable;
