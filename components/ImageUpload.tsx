"use client";
import config from "@/lib/config";
import { IKImage, IKUpload, ImageKitProvider } from "imagekitio-next";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

const { env: {
  imagekit: {
    publicKey,
    urlEndpoint } } } = config;

const authenticator = async () => {
  try {
    console.log("Fetching authentication from:", `${config.env.apiEndPoint}/api/auth/imagekit`);

    const response = await fetch(`${config.env.apiEndPoint}/api/auth/imagekit`);
    console.log("Raw response:", response);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("Authentication data received:", data);

    const { signature, expire, token } = data;
    return { token, signature, expire };

  } catch (error: any) {
    toast.error(`Authentication failed: ${error.message}`);
    console.error("Authentication failed:", error);
    throw new Error(`Authentication failed: ${error.message}`);
  }
};


interface ImageUploadProps {
  onFileChange: (filePath: string) => void;
  maxSizeMB?: number;
  allowedFileTypes?: string[];
}

const ImageUpload = ({
  onFileChange,
  maxSizeMB = 100,
  allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
}: ImageUploadProps) => {
  const ikUploadRef = useRef<any>(null);
  const [file, setFile] = useState<{ filePath: string; url: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onError = (error: any) => {
    console.error("Upload error:", error);
    setIsUploading(false);
    setError(error.message || "Failed to upload image");
    toast.error("Upload failed: " + (error.message || "Unknown error"));
  }

  const onSuccess = (res: any) => {
    setIsUploading(false);
    setFile({
      filePath: res.filePath,
      url: res.url
    });
    onFileChange(res.filePath);
    toast.success("Image uploaded successfully");
  }

  const validateFile = (file: File): boolean => {
    // Check file size (convert MB to bytes)
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size exceeds ${maxSizeMB}MB limit`);
      return false;
    }

    // Check file type
    if (allowedFileTypes.length > 0 && !allowedFileTypes.includes(file.type)) {
      toast.error(`File type not supported. Please upload: ${allowedFileTypes.join(', ')}`);
      return false;
    }

    return true;
  }

  const handleUploadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(null);

    if (ikUploadRef.current) {
      ikUploadRef.current.click();
    }
  }

  const handleBeforeUpload = (file: File) => {
    if (!validateFile(file)) {
      return false;
    }
    setIsUploading(true);
    return true;
  }

  const handleRemoveImage = () => {
    setFile(null);
    onFileChange("");
    toast.info("Image removed");
  }

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}>

      <IKUpload
        className="hidden"
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        onUploadStart={() => setIsUploading(true)}
        validateFile={handleBeforeUpload}
        fileName={`upload-${Date.now()}.png`} />

      <div className="flex flex-col gap-4 w-full">
        {!file && (
          <button
            className="upload-btn flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            onClick={handleUploadClick}
            disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <p className="text-base text-gray-600">Uploading...</p>
              </>
            ) : (
              <>
                <Image src="/icons/upload.svg"
                  alt="upload-icon"
                  width={20}
                  height={20}
                  className="object-contain" />
                <p className="text-base text-gray-700">Upload a File</p>
              </>
            )}
          </button>
        )}

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {file && (
          <div className="relative">
            <div className="absolute top-2 right-2 z-10">
              <button
                onClick={handleRemoveImage}
                className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="mt-2 mb-1">
              <p className="text-sm text-gray-500 truncate">
                {file.filePath.split('/').pop()}
              </p>
            </div>
            <IKImage
              alt="Uploaded image"
              path={file.filePath}
              width={500}
              height={300}
              className="rounded-md object-cover max-h-64 w-full"
              loading="lazy"
              lqip={{ active: true }}
            />
          </div>
        )}
      </div>
    </ImageKitProvider>
  )
}

export default ImageUpload