import { useEffect, useState } from 'react';
import { Searchbar } from './Searchbar';
import { ImageGallery } from './ImageGallery';
import { Button } from './Button';
import { Loader } from './Loader';
import { Modal } from './Modal';

export const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(null);

  const per_page = 12;
  const API_KEY = '34850794-1a63b0f1d33e83dba8f53aae2';
  const url = `https://pixabay.com/api/?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=${per_page}`;

  const fetchImages = async () => {
    try {
      const response = await fetch(url);
      const newImages = await response.json();
      const newImagesHits = newImages.hits;

      setImages(prevImages => [...prevImages, ...newImagesHits]);
    } catch (error) {
      return error;
    } finally {
      setIsLoading(false);
    }
  };
  const loadMorePages = () => {
    setPage(prevPage => prevPage + 1);
  };

  useEffect(() => {
    if (!query) return;
    fetchImages(query, page);
    // eslint-disable-next-line
  }, [query, page]);

  const handleSearchSubmit = searchQuery => {
    setQuery(searchQuery);
    setPage(1);
    setImages([]);
  };
  const showModal = largeImageUrl => {
    setModal(largeImageUrl);
  };
  const closeModal = () => {
    setModal(null);
  };
  return (
    <>
      <Searchbar onSubmit={handleSearchSubmit} />
      <ImageGallery images={images} onImageClick={showModal} />
      {images.length > per_page - 1 && (
        <Button onClick={loadMorePages}>Load more</Button>
      )}
      {isLoading && <Loader />}
      {modal && <Modal onClose={closeModal} largeImageUrl={modal} />}
    </>
  );
};
