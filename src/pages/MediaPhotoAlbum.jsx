import React, { useState, useEffect } from 'react';
import PhotoAlbum from 'react-photo-album';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/captions.css';

// Define breakpoints for responsive images
const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48];

// Định nghĩa chiều rộng cố định cho tất cả ảnh
const FIXED_WIDTH = 2000;

/**
 * Component chính cho Photo Album
 */
const MediaPhotoAlbum = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(-1);
  const [layout, setLayout] = useState('masonry'); // 'rows', 'columns', 'masonry'

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
                const naturalWidth = img.naturalWidth;
                const naturalHeight = img.naturalHeight;
                
                // Cố định chiều rộng và tính lại chiều cao dựa trên tỷ lệ ảnh
                // const width = FIXED_WIDTH;
                // const height = Math.round((naturalHeight / naturalWidth) * FIXED_WIDTH);
                
                const width = naturalWidth;
                const height = naturalHeight;
                
                console.log(width, height)
                // Tạo alt text từ tên file
                const altText = filename
                  .split('.')[0]
                  .replace(/[-_]/g, ' ')
                  .replace(/\b\w/g, l => l.toUpperCase());
                
                // Tạo srcSet cho responsive images
                const srcSet = breakpoints.map((breakpoint) => {
                  const breakpointHeight = Math.round((height / width) * breakpoint);
                  return {
                    src: src,
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

  // Cấu hình cho các kiểu layout
  const layoutOptions = {
    masonry: {
      spacing: 8,
      columnWidth: 300,
    },
    rows: {
      spacing: 8,
      padding: 0,
      targetRowHeight: 250,
    },
    columns: {
      spacing: 8,
      padding: 0,
      columnCount: 3,
    }
  };

  // Chuẩn bị ảnh cho lightbox
  const slides = photos.map(({ src, width, height, alt, title, description }) => ({
    src,
    width,
    height,
    alt,
    title,
    description,
  }));

  // Handler để chuyển đổi layout
  const changeLayout = (newLayout) => {
    setLayout(newLayout);
  };

  // Tính tổng số ảnh và kích thước
  const totalPhotos = photos.length;
  const totalSize = photos.reduce((acc, photo) => acc + (photo.width * photo.height), 0);
  const averageWidth = totalPhotos ? Math.round(photos.reduce((acc, photo) => acc + photo.width, 0) / totalPhotos) : 0;
  const averageHeight = totalPhotos ? Math.round(photos.reduce((acc, photo) => acc + photo.height, 0) / totalPhotos) : 0;

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <div>Đang tải album ảnh...</div>
      </div>
    );
  }

  return (
    <div className="photo-album-container">
      <h1>Album Ảnh</h1>
      
      <div className="album-info">
        <div>{totalPhotos} ảnh</div>
        <div>Kích thước ảnh: Chiều rộng cố định {FIXED_WIDTH}px</div>
        <div>Chiều cao trung bình: {averageHeight}px</div>
      </div>
      
      <div className="layout-controls">
        <button 
          onClick={() => changeLayout('masonry')} 
          className={layout === 'masonry' ? 'active' : ''}
          title="Hiển thị kiểu gạch xếp"
        >
          Masonry
        </button>
        <button 
          onClick={() => changeLayout('rows')} 
          className={layout === 'rows' ? 'active' : ''}
          title="Hiển thị theo hàng"
        >
          Rows
        </button>
        <button 
          onClick={() => changeLayout('columns')} 
          className={layout === 'columns' ? 'active' : ''}
          title="Hiển thị theo cột"
        >
          Columns
        </button>
      </div>
      
      {photos.length > 0 ? (
        <>
          <div className="album-wrapper">
            <PhotoAlbum
              layout={layout}
              photos={photos}
              layoutOptions={layoutOptions[layout]}
              onClick={({ index }) => setIndex(index)}
              componentsProps={{
                imageProps: { 
                  loading: "lazy",
                  className: "album-image" 
                }
              }}
              renderPhoto={({ photo, wrapperProps, imageProps }) => (
                <div {...wrapperProps}>
                  <img {...imageProps} />
                  <div className="image-overlay">
                    <div className="image-title">{photo.title}</div>
                  </div>
                </div>
              )}
            />
          </div>
          
          <Lightbox
            slides={slides}
            open={index >= 0}
            index={index}
            close={() => setIndex(-1)}
            plugins={[Zoom, Thumbnails, Captions]}
            captions={{ descriptionTextAlign: 'center' }}
            zoom={{ maxZoomPixelRatio: 3 }}
            thumbnails={{ width: 100, height: 80 }}
          />
        </>
      ) : (
        <p className="no-photos">Không tìm thấy ảnh trong thư mục media.</p>
      )}
      
    </div>
  );
};

export default MediaPhotoAlbum;