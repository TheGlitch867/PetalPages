export function fileToCompressedDataUrl(
  file: File,
  maxWidth = 240,
  maxHeight = 320,
  quality = 0.85,
): Promise<string> {
  return compressImageFile(file, maxWidth, maxHeight, quality);
}

export function fileToBackgroundDataUrl(file: File): Promise<string> {
  return compressImageFile(file, 1600, 1200, 0.82);
}

function compressImageFile(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        const scale = Math.min(maxWidth / width, maxHeight / height, 1);
        width = Math.round(width * scale);
        height = Math.round(height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not process image."));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("Could not load image."));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}
