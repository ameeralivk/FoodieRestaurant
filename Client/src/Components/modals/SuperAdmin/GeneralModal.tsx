
import { useState, useEffect } from "react";
import ErrorPTag from "../../Elements/ErrorParagraph";

interface FieldProps {
  name: string;
  label: string;
  type:
    | "text"
    | "number"
    | "image"
    | "features"
    | "select"
    | "duration"
    | "multi-select"
    | "tags"
    | "variant-price";
  value?: any;
  options?: string[];
  variantMap?: Record<string, string[]>;
  placeholder?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  fields: FieldProps[];
  title?: string;
  submitText?: string;
  cancelText?: string;
  mode?: "add" | "edit" | "view";
  externalErrors?: { [key: string]: string };
  loading?: boolean;
  onFieldChange?: (name: string, value: any) => void;
  tagName?: string;
}

export default function ReusableModal({
  isOpen,
  onClose,
  onSubmit,
  fields,
  title = "Modal Title",
  submitText = "Submit",
  cancelText = "Close",
  mode = "edit",
  tagName = "tags",
  externalErrors = {},
  loading = false,
  onFieldChange,
}: ModalProps) {
  const [formData, setFormData] = useState<any>({});
  const [features, setFeatures] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState<(File | string)[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [variantCategory, setVariantCategory] = useState("");
  const [variantPrices, setVariantPrices] = useState<
    { option: string; price: number }[]
  >([]);

  const isViewMode = mode === "view";

  const variantField = fields.find((f) => f.type === "variant-price");
  const VARIANT_MAP = variantField?.variantMap || {};

  useEffect(() => {
    if (isOpen) {
      const empty: any = {};
      fields.forEach((field) => {
        if (
          field.type !== "multi-select" &&
          field.type !== "image" &&
          field.type !== "tags" &&
          field.type !== "variant-price"
        ) {
          empty[field.name] = field.value || "";
        }
      });

      setFormData(empty);
      setFeatures(fields.find((f) => f.type === "multi-select")?.value || []);
      setTags(fields.find((f) => f.type === "tags")?.value || []);
      const initialImages = fields.find((f) => f.type === "image")?.value || [];
      setImagePreviews(initialImages);
      setImages(initialImages);

      const vp = fields.find((f) => f.type === "variant-price")?.value;
      setVariantCategory(vp?.category || "");
      setVariantPrices(vp?.values || []);
    }
  }, [isOpen]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    onFieldChange && onFieldChange(name, value);
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const newTag = tagInput.trim();
    if (!tags.includes(newTag)) {
      const updated = [...tags, newTag];
      setTags(updated);
      onFieldChange && onFieldChange("tags", updated);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    const updated = tags.filter((t) => t !== tag);
    setTags(updated);
    onFieldChange && onFieldChange("tags", updated);
  };

  const hasValue = (field: FieldProps) => {
    if (!isViewMode) return true;

    const value = field.value;

    if (field.type === "image") return value?.length > 0;
    if (field.type === "tags") return value?.length > 0;
    if (field.type === "multi-select") return value?.length > 0;

    if (field.type === "variant-price") {
      return value?.category && value?.values?.length > 0;
    }

    return value !== undefined && value !== null && value !== "";
  };

  const handleSubmit = () => {
    if (onSubmit) {
      const finalData = { ...formData };

      Object.keys(finalData).forEach((key) => {
        const value = finalData[key];
        if (value !== "" && !isNaN(Number(value))) {
          finalData[key] = Number(value);
        }
      });

      finalData.features = features;
      finalData[tagName] = tags;
      finalData.images = images;

      if (variantCategory && variantPrices.length > 0) {
        const validPrices = variantPrices.filter(
          (v) => v.option && v.price !== undefined && v.price !== null,
        );
        if (validPrices.length > 0) {
          finalData.variantPricing = {
            category: variantCategory,
            values: validPrices,
          };
        }
      }

      onSubmit(finalData);
    }
  };

  const tagField = fields.find((f) => f.type === "tags");
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-gray-900 text-white p-6 rounded-lg w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center border-b border-gray-700 pb-3">
          {title}
        </h2>

        {/* FORM FIELDS */}
        <div className="space-y-4">
          {fields
            .filter(
              (f) =>
                f.type !== "multi-select" &&
                f.type !== "image" &&
                f.type !== "tags" &&
                f.type !== "variant-price" &&
                hasValue(f),
            )
            .map((field) => (
              <div key={field.name} className="flex flex-col">
                <span className="text-gray-400 text-sm mb-1">
                  {field.label}
                </span>
                {field.type === "select" ? (
                  isViewMode ? (
                    <div className="bg-gray-800 px-3 py-2 rounded border border-gray-700">
                      {formData[field.name]}
                    </div>
                  ) : (
                    <select
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )
                ) : isViewMode ? (
                  <div className="bg-gray-800 px-3 py-2 rounded border border-gray-700">
                    {formData[field.name]}
                  </div>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    placeholder={field.placeholder || `Enter ${field.label}`}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                  />
                )}
                {externalErrors[field.name] && (
                  <ErrorPTag Text={externalErrors[field.name]} />
                )}
              </div>
            ))}

          {/* VARIANT FIELD */}
          {fields.some((f) => f.type === "variant-price" && hasValue(f)) && (
            <div className="mt-6">
              <span className="text-gray-400 text-sm mb-2 block">
                Variant Pricing
              </span>
              {!isViewMode && (
                <select
                  value={variantCategory}
                  onChange={(e) => {
                    setVariantCategory(e.target.value);
                    setVariantPrices([]);
                  }}
                  className="w-full mb-3 px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                >
                  <option value="">Select Variant</option>
                  {Object.keys(VARIANT_MAP).map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              )}
              {variantCategory &&
                VARIANT_MAP[variantCategory].map((opt) => {
                  const row = variantPrices.find((v) => v.option === opt);
                  return (
                    <div key={opt} className="flex gap-2 mb-2">
                      <div className="w-1/2 bg-gray-800 px-3 py-2 rounded">
                        {opt}
                      </div>
                      {isViewMode ? (
                        <div className="w-1/2 bg-gray-800 px-3 py-2 rounded">
                          ₹{row?.price || 0}
                        </div>
                      ) : (
                        <input
                          type="number"
                          placeholder="Price"
                          value={row?.price || ""}
                          className="w-1/2 px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                          onChange={(e) => {
                            const price = Number(e.target.value);
                            setVariantPrices((prev) => {
                              const rest = prev.filter((p) => p.option !== opt);
                              return [...rest, { option: opt, price }];
                            });
                          }}
                        />
                      )}
                    </div>
                  );
                })}
            </div>
          )}

          {/* TAGS FIELD */}
          {fields.some((f) => f.type === "tags") && (
            <div className="mt-5">
              <span className="text-gray-400 text-sm mb-2 block">
                {tagField?.label || "Tags"}
              </span>
              {isViewMode ? (
                <div className="flex flex-wrap gap-2 bg-gray-800 p-3 rounded border border-gray-700">
                  {tags.length > 0 ? (
                    tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-gray-700 px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No tags added</p>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Enter tag..."
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, i) => (
                      <div
                        key={i}
                        className="bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        {tag}
                        {!isViewMode && (
                          <button
                            className="text-red-400 hover:text-red-600"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    {tags.length === 0 && (
                      <p className="text-gray-500">No tags added</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* IMAGE FIELD */}
          {fields.some((f) => f.type === "image") && (
            <div className="flex gap-4 flex-wrap mt-7">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative">
                  <img
                    src={src}
                    alt={`preview-${i}`}
                    className="w-24 h-24 object-cover rounded border border-gray-600 cursor-pointer hover:opacity-80"
                    onClick={() =>
                      !isViewMode &&
                      document.getElementById("imageInput")?.click()
                    }
                  />
                  {!isViewMode && (
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      onClick={() => {
                        const updatedImages = images.filter(
                          (_, index) => index !== i,
                        );
                        const updatedPreviews = imagePreviews.filter(
                          (_, index) => index !== i,
                        );
                        setImages(updatedImages);
                        setImagePreviews(updatedPreviews);
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {!isViewMode && imagePreviews.length < 3 && (
                <>
                  <div
                    className="w-24 h-24 flex items-center justify-center text-center border border-gray-600 rounded cursor-pointer bg-gray-800 text-blue-700 hover:bg-gray-700"
                    onClick={() =>
                      document.getElementById("imageInput")?.click()
                    }
                  >
                    Click to select
                  </div>
                  {externalErrors.images && (
                    <div className="mt-2">
                      <ErrorPTag Text={externalErrors.images} />
                    </div>
                  )}
                  <input
                    type="file"
                    id="imageInput"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        const filesArray = Array.from(e.target.files).slice(
                          0,
                          3 - images.length,
                        );
                        const newPreviews = filesArray.map((file) =>
                          URL.createObjectURL(file),
                        );
                        setImages((prev) => [...prev, ...filesArray]);
                        setImagePreviews((prev) => [...prev, ...newPreviews]);
                      }
                    }}
                  />
                </>
              )}
            </div>
          )}

          {/* MULTI-SELECT FEATURES */}
          {fields.some((f) => f.type === "multi-select") && (
            <div className="mt-5">
              <span className="text-gray-400 text-sm mb-2 block">Features</span>
              {isViewMode ? (
                <ul className="list-disc list-inside space-y-2 bg-gray-800 p-3 rounded border border-gray-700">
                  {features.map((feat, i) => (
                    <li key={i}>{feat}</li>
                  ))}
                </ul>
              ) : (
                <div className="bg-gray-800 border border-gray-700 rounded p-2">
                  <input
                    type="text"
                    placeholder="Search features..."
                    className="w-full mb-2 px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                    onChange={(e) =>
                      setSearchTerm(e.target.value.toLowerCase())
                    }
                  />
                  <div className="max-h-40 overflow-y-auto">
                    {fields
                      .find((f) => f.type === "multi-select")
                      ?.options?.filter((opt) =>
                        opt.toLowerCase().includes(searchTerm),
                      )
                      .map((opt) => {
                        const isSelected = features.includes(opt);
                        return (
                          <div
                            key={opt}
                            className="flex items-center justify-between px-2 py-2 hover:bg-gray-700 rounded cursor-pointer"
                            onClick={() =>
                              setFeatures(
                                isSelected
                                  ? features.filter((f) => f !== opt)
                                  : [...features, opt],
                              )
                            }
                          >
                            <span>{opt}</span>
                            {isSelected && (
                              <span className="text-green-400 font-bold">
                                ✔
                              </span>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 mt-6 border-t border-gray-700 pt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
          >
            {cancelText}
          </button>
          {!isViewMode && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-4 py-2 rounded bg-amber-600 hover:bg-amber-700 flex items-center gap-2 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {loading ? "Please wait..." : submitText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
