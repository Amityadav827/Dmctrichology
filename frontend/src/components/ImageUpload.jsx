import { useEffect, useState } from "react";

function ImageUpload({
  label,
  file,
  previewUrl,
  onFileChange,
  multiple = false,
  helperText = "PNG, JPG, WEBP up to 5MB",
}) {
  const [preview, setPreview] = useState(previewUrl || "");
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (multiple && Array.isArray(file) && file.length) {
      const objectUrls = file.map((item) => URL.createObjectURL(item));
      setPreview(objectUrls);

      return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
    }

    if (!multiple && file instanceof File) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }

    setPreview(previewUrl || (multiple ? [] : ""));
    return undefined;
  }, [file, previewUrl, multiple]);

  const handleFiles = (files) => {
    if (!files?.length) {
      onFileChange(multiple ? [] : null);
      return;
    }

    onFileChange(multiple ? Array.from(files) : files[0]);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-700">{label}</label>
      <label
        className={`flex cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed px-6 py-8 text-center transition ${
          dragActive
            ? "border-coral bg-white"
            : "border-slate-300 bg-slate-50 hover:border-coral hover:bg-white"
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          handleFiles(event.dataTransfer.files);
        }}
      >
        <span className="text-sm font-semibold text-slate-700">
          {multiple ? "Click or drop images here" : "Click or drop image here"}
        </span>
        <span className="mt-1 text-xs text-slate-400">{helperText}</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          multiple={multiple}
          onChange={(event) => handleFiles(event.target.files)}
        />
      </label>

      {Array.isArray(preview) && preview.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((imageUrl, index) => (
            <div
              key={`${imageUrl}-${index}`}
              className="overflow-hidden rounded-[22px] border border-slate-200 bg-white p-3"
            >
              <img
                src={imageUrl}
                alt={`Preview ${index + 1}`}
                className="h-40 w-full rounded-2xl object-cover"
              />
            </div>
          ))}
        </div>
      ) : preview ? (
        <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white p-3">
          <img src={preview} alt="Preview" className="h-48 w-full rounded-2xl object-cover" />
        </div>
      ) : null}
    </div>
  );
}

export default ImageUpload;
