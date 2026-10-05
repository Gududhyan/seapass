// Photo hero background: slow Ken Burns drift plus animated water shimmer.
// Photo: "Luxury Yacht Sailing at Sunset" from Pexels (free to use). Replace public/hero.jpg to change it.
export default function HeroScene() {
  return (
    <div className="scene photo" aria-hidden="true">
      <img src="/hero.jpg" alt="" className="photo-img" fetchPriority="high" />
      <div className="shimmer s1" />
      <div className="shimmer s2" />
    </div>
  );
}
