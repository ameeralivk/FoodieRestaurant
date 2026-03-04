import { Eye } from "lucide-react";

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

interface RestaurantRowProps {
  name: string;
  owner: string;
  location: string;
  plan: string;
  status: "pending" | "approved" | "rejected"; // or string
  isBlocked: boolean;
  onView: () => void;
}

// Table Row Component
const TableRow: React.FC<TableRowProps> = ({ children, className = "" }) => {
  return (
    <tr
      className={`border-b border-amber-900/20 hover:bg-amber-950/20 transition-colors ${className}`}
    >
      {children}
    </tr>
  );
};

// Table Cell Component
const TableCell: React.FC<TableCellProps> = ({ children, className = "" }) => {
  return (
    <td className={`py-4 px-4 text-sm text-amber-50 ${className}`}>
      {children}
    </td>
  );
};

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusColors = {
    Active: "bg-amber-700/30 text-amber-200",
    Pending: "bg-yellow-700/30 text-yellow-200",
    Blocked: "bg-red-900/30 text-red-200",
  };

  return (
    <span
      className={`px-3 py-1 rounded text-xs font-medium ${
        statusColors[status as keyof typeof statusColors] ||
        "bg-gray-700/30 text-gray-200"
      }`}
    >
      {status}
    </span>
  );
};

// Icon Button Component
const IconButton: React.FC<{
  icon: React.ReactNode;
  onClick: () => void;
  title: string;
}> = ({ icon, onClick, title }) => (
  <button
    onClick={onClick}
    title={title}
    className="text-amber-200 hover:text-amber-100 hover:bg-amber-900/20 p-1.5 rounded transition-colors"
  >
    {icon}
  </button>
);

const RestaurantRow: React.FC<RestaurantRowProps> = ({
  name,
  owner,
  location,
  plan,
  isBlocked,
  status,
  onView,
}) => {
  return (
    <TableRow>
      <TableCell>{name}</TableCell>
      <TableCell>{owner}</TableCell>
      <TableCell>{location}</TableCell>
      <TableCell>{plan}</TableCell>
      <TableCell>{isBlocked ? "true" : "false"}</TableCell>
      <TableCell>
        <StatusBadge status={status} />
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2 cursor-pointer">
          <IconButton
            icon={<Eye size={16} className="cursor-pointer" />}
            onClick={onView}
            title="View Details"
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default RestaurantRow;
