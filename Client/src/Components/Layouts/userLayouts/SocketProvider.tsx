import { useEffect} from "react";
import type{ ReactNode } from "react";
import Socket from "../../../socket";
import toast from "react-hot-toast";

interface Props {
  children: ReactNode;
}

const SocketProvider = ({ children }: Props) => {
  useEffect(() => {
    Socket.connect();

    Socket.on("order:itemUpdated", () => {
      toast.success("Item status updated");
    });

    Socket.on("order:completed", () => {
      toast.success("Your order is completed 🎉");
    });

    return () => {
      Socket.off("order:itemUpdated");
      Socket.off("order:completed");
    };
  }, []);

  return <>{children}</>;
};

export default SocketProvider;
