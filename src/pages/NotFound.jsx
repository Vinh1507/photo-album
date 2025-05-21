import NotFound from 'src/assets/404.jpg';

export default function NotFoundComponent() {
  return (
    <div className="not-found-container">
      <img src={NotFound} alt="NotFound" className="not-found-image" />
    </div>
  );
}
