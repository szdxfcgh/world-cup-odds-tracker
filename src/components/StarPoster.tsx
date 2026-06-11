import Image from 'next/image';

const stars = [
  { key: 'haaland', name: 'ERLING HAALAND', image: '/stars/haaland.jpg' },
  { key: 'yamal', name: 'LAMINE YAMAL', image: '/stars/yamal.jpg' },
  { key: 'bellingham', name: 'JUDE BELLINGHAM', image: '/stars/bellingham.jpg' },
  { key: 'vinicius', name: 'VINICIUS JR', image: '/stars/vinicius.jpg' },
  { key: 'messi', name: 'LIONEL MESSI', image: '/stars/messi.jpg' },
  { key: 'ronaldo', name: 'CRISTIANO RONALDO', image: '/stars/ronaldo.jpg' },
  { key: 'mbappe', name: 'KYLIAN MBAPPE', image: '/stars/mbappe.jpg' },
];

export default function StarPoster() {
  return (
    <div className="star-poster" aria-label="七名球星编辑型群像海报">
      <div className="star-poster-grid" aria-hidden="true" />
      <div className="star-poster-beam star-poster-beam-a" aria-hidden="true" />
      <div className="star-poster-beam star-poster-beam-b" aria-hidden="true" />
      {stars.map((star) => (
        <figure key={star.key} className={`poster-star poster-star-${star.key}`}>
          <Image
            src={star.image}
            alt={star.name}
            fill
            loading="eager"
            sizes="(max-width: 768px) 45vw, 28vw"
          />
          <figcaption>{star.name}</figcaption>
        </figure>
      ))}
      <div className="star-poster-smoke" aria-hidden="true" />
      <div className="star-poster-data" aria-hidden="true">
        <span>07 / GLOBAL ICONS</span>
        <span>48 TEAMS</span>
        <span>104 MATCHES</span>
      </div>
    </div>
  );
}
