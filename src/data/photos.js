import { useState, useEffect } from 'react';

const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48];

const photos = [];

export const usePhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        // Sử dụng import.meta.glob của Vite để lấy tất cả file ảnh
        const imageFiles = import.meta.glob('/src/media/*.{jpg,JPG,jpeg,png,gif,webp,avif}', { eager: true });
        
        // Xử lý các file ảnh để tạo cấu trúc dữ liệu phù hợp
        const photoItems = await Promise.all(
          Object.entries(imageFiles).map(async ([path, module], index) => {
            const src = module.default;
            const filename = path.split('/').pop();
            
            return new Promise((resolve) => {
              const img = new Image();
              
              img.onload = () => {
                // Lấy kích thước thực của ảnh
                const width = img.naturalWidth;
                const height = img.naturalHeight;
                
                // Tạo alt text từ tên file
                const altText = filename
                  .split('.')[0]
                  .replace(/[-_]/g, ' ')
                  .replace(/\b\w/g, l => l.toUpperCase());
                
                // Tạo srcSet cho responsive images
                const srcSet = breakpoints.map((breakpoint) => {
                  const breakpointHeight = Math.round((height / width) * breakpoint);
                  return {
                    src,
                    width: breakpoint,
                    height: breakpointHeight,
                  };
                });
                
                resolve({
                  src,
                  key: `photo-${index}`,
                  width,
                  height,
                  srcSet,
                  alt: altText,
                  title: altText,
                  description: `Photo ${index + 1} - ${altText}`,
                });
              };
              
              img.onerror = () => {
                console.error(`Failed to load image: ${path}`);
                resolve(null);
              };
              
              img.src = src;
            });
          })
        );
        
        // Lọc bỏ các ảnh không tải được (null)
        const validPhotos = photoItems.filter(photo => photo !== null);
        
        setPhotos(validPhotos);
        setLoading(false);
      } catch (error) {
        console.error('Error loading images:', error);
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  return { photos, loading };
};

export default photos; 