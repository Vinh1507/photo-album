import React, { useState } from 'react';
import { MasonryPhotoAlbum } from 'react-photo-album';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import { usePhotos } from '../data/photos';

const HikingPhotoAlbum = () => {
  const [index, setIndex] = useState(-1);
  const { photos, loading } = usePhotos();

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
      
      <div className="album-wrapper">
        <MasonryPhotoAlbum
          photos={photos}
          columns={4}
          spacing={4}
          padding={5}
          onClick={({ index }) => setIndex(index)}
          renderPhoto={({ photo, wrapperProps, imageProps }) => (
            <div {...wrapperProps} className="photo-wrapper">
              <img {...imageProps} className="album-image" />
              <div className="image-overlay">
                <div className="image-title">{photo.alt}</div>
              </div>
            </div>
          )}
        />
      </div>
      
      <Lightbox
        slides={photos}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        plugins={[Zoom, Thumbnails, Captions]}
        captions={{ descriptionTextAlign: 'center' }}
        zoom={{ maxZoomPixelRatio: 3 }}
        thumbnails={{ width: 100, height: 80 }}
      />
    </div>
  );
};

export default HikingPhotoAlbum; 