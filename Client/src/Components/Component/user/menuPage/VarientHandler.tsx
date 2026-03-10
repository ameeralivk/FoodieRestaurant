import VariantSelectModal from "../../../modals/Admin/varientSelectModal";
import { showErrorToast } from "../../../Elements/ErrorToast";
import { showSuccessToast } from "../../../Elements/SuccessToast";
import { AddToCart } from "../../../../services/cart";

interface Props {
  open: boolean;
  item: any;
  userId?: string;
  restaurantId?: string;
  table?: string | null;
  onClose: () => void;
  onSuccess?: (table: string) => void;
}

const VariantHandler: React.FC<Props> = ({
  open,
  item,
  userId,
  restaurantId,
  table,
  onClose,
  onSuccess,
}) => {
  if (!open || !item) return null;

  return (
    <VariantSelectModal
      open={open}
      itemName={item.name}
      basePrice={item.price}
      variant={item.variant}
      onClose={onClose}
      onConfirm={async ({ variantOption }) => {
        try {
          if (userId && restaurantId && table) {
            const res = await AddToCart(
              userId,
              restaurantId,
              item._id,
              table,
              "1",
              variantOption
                ? {
                    category: item.variant.category,
                    option: variantOption.option,
                    price: variantOption.price,
                  }
                : undefined,
            );

            if (res.success) {
              if (table && onSuccess) onSuccess(table);
              showSuccessToast("Added to Cart Successfully");
            }
          }
        } catch {
          showErrorToast("Failed to add item");
        } finally {
          onClose();
        }
      }}
    />
  );
};

export default VariantHandler;
