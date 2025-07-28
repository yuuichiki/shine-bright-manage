import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload, Image as ImageIcon, Video } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  allowVideo?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  images, 
  onImagesChange, 
  maxImages = 6,
  allowVideo = true 
}) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (images.length + files.length > maxImages) {
      toast({
        title: "Lỗi",
        description: `Chỉ được phép tải lên tối đa ${maxImages} tệp`,
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    const newImages: string[] = [];
    let processedFiles = 0;

    files.forEach((file) => {
      if (file.type.startsWith('image/') || (allowVideo && file.type.startsWith('video/'))) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newImages.push(e.target.result as string);
          }
          processedFiles++;
          
          if (processedFiles === files.length) {
            onImagesChange([...images, ...newImages]);
            setUploading(false);
            toast({
              title: "Thành công",
              description: `Đã tải lên ${files.length} tệp`,
            });
          }
        };
        reader.readAsDataURL(file);
      } else {
        processedFiles++;
        toast({
          title: "Lỗi",
          description: `Tệp ${file.name} không được hỗ trợ`,
          variant: "destructive"
        });
      }
    });

    if (processedFiles === files.length && files.length === 0) {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          type="file"
          multiple
          accept={allowVideo ? "image/*,video/*" : "image/*"}
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
          disabled={uploading || images.length >= maxImages}
        />
        <label htmlFor="file-upload">
          <Button 
            variant="outline" 
            disabled={uploading || images.length >= maxImages}
            asChild
          >
            <span>
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? 'Đang tải...' : 'Tải ảnh/video'}
            </span>
          </Button>
        </label>
        <span className="text-sm text-muted-foreground">
          ({images.length}/{maxImages})
        </span>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((src, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border">
                {src.startsWith('data:video/') ? (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <Video className="h-8 w-8 text-gray-400" />
                    <span className="ml-2 text-sm text-gray-500">Video</span>
                  </div>
                ) : (
                  <img
                    src={src}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;