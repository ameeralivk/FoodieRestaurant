import React from "react";
import type { IWalletTransaction } from "../../../../types/wallet";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

interface WalletTableProps {
  transactions: IWalletTransaction[];
}

const WalletTable: React.FC<WalletTableProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No transactions found.
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-100">
        <tr>
          <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
            Transaction Details
          </th>
          <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
            Amount
          </th>
          <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
            Status
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-50">
        {transactions.map((transaction, index) => {
          const isCredit = transaction.type === "credit"; // ✅ check type, not amount
          return (
            <tr
              key={index}
              className="hover:bg-gray-50/80 transition-colors group"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCredit
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {isCredit ? (
                      <ArrowDownLeft className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(transaction.createdAt).toDateString()}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 text-right">
                <span
                  className={`text-sm font-bold ${
                    isCredit ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isCredit ? "+" : "-"}₹
                  {Math.abs(transaction.amount).toLocaleString()}
                </span>
              </td>

              <td className="px-6 py-4 text-right hidden sm:table-cell">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Successful
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default WalletTable;
