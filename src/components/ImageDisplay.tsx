
import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Image as ImageIcon } from 'lucide-react';

interface GeneratedImage {
  url: string;
  prompt: string;
}

interface ImageDisplayProps {
  image: GeneratedImage | null;
  isLoading: boolean;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ image, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="w-full h-64 bg-white/20" />
        <div className="flex items-center justify-center text-white/60">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/60 mr-3" />
          正在生成图像...
        </div>
      </div>
    );
  }

  if (!image) {
    return (
      <div className="w-full h-64 bg-white/5 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center">
        <div className="text-center text-white/60">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">图像将在这里显示</p>
          <p className="text-sm mt-2">输入描述并生成Prompt后开始创建</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative group overflow-hidden rounded-lg">
        <img
          src={image.url}
          alt="Generated social media image"
          className="w-full h-auto max-h-96 object-contain bg-white rounded-lg shadow-lg transition-transform group-hover:scale-105"
          onError={(e) => {
            console.error('Image failed to load:', image.url);
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
      </div>
      
      <Card className="bg-white/5 border-white/20 p-3">
        <p className="text-sm text-white/80 break-words">
          <span className="font-medium text-white">使用的Prompt: </span>
          {image.prompt}
        </p>
      </Card>
    </div>
  );
};
