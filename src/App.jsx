import React from 'react';
import '@ant-design/v5-patch-for-react-19';
import HikingPhotoAlbum from './pages/HikingPhotoAlbum';
import './styles/HikingPhotoAlbum.css';

function App() {
  return (
    <div className="App">
      <h1>Ứng dụng Photo Album</h1>
      <HikingPhotoAlbum />
    </div>
  );
}

export default App;