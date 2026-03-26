export default function VideoModal({ video, onClose }) {
  if (!video) return null;
  const ytId = video.youtube_id || video.id;
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-inner" onClick={e => e.stopPropagation()}>
        <div className="modal-close" onClick={onClose}>✕ Close</div>
        <div className="iframe-wrap">
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={video.title}
          />
        </div>
      </div>
    </div>
  );
}