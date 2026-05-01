const MAX_IMAGE_WIDTH = 1600;
const JPEG_QUALITY = 0.7;
const OUTPUT_MIME_TYPE = "image/jpeg";

function getResizedDimensions(width: number, height: number) {
  if (width <= MAX_IMAGE_WIDTH) {
    return { width, height };
  }

  const ratio = MAX_IMAGE_WIDTH / width;

  return {
    width: MAX_IMAGE_WIDTH,
    height: Math.round(height * ratio),
  };
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image for compression."));
    };

    image.src = objectUrl;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to compress image."));
          return;
        }

        resolve(blob);
      },
      mimeType,
      quality
    );
  });
}

function buildCompressedFileName(fileName: string): string {
  const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");

  return `${nameWithoutExtension}.jpg`;
}

export async function compressImageForUpload(file: File): Promise<File> {
  const image = await loadImageFromFile(file);

  const { width, height } = getResizedDimensions(
    image.naturalWidth,
    image.naturalHeight
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is not supported in this browser.");
  }

  context.drawImage(image, 0, 0, width, height);

  const compressedBlob = await canvasToBlob(
    canvas,
    OUTPUT_MIME_TYPE,
    JPEG_QUALITY
  );

  return new File([compressedBlob], buildCompressedFileName(file.name), {
    type: OUTPUT_MIME_TYPE,
    lastModified: Date.now(),
  });
}

export const compressImageForUltrasoundUpload = compressImageForUpload;
export const compressImageForPetUpload = compressImageForUpload;
export const compressImageForVetUpload = compressImageForUpload;
export const compressImageForClinicUpload = compressImageForUpload;
