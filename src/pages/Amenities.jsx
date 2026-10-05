import { amenities } from "../data.js";
import { Reveal } from "../components/motion.jsx";
import PageBanner from "../components/PageBanner.jsx";
import Icon from "../components/Icon.jsx";

export default function Amenities() {
  return (
    <div className="page-bg">
      <PageBanner img="deck" pos="center 35%" eyebrow="Onboard" title="Onboard Amenities" sub="Enjoy premium comfort and convenience throughout your journey." />
      <div className="container section">
        <div className="grid g4">{amenities.map(([t, d, ic], i) => (
          <Reveal key={t} delay={i * 60} className="card feat"><div className="cicon"><Icon name={ic} size={26} /></div><h3>{t}</h3><p>{d}</p></Reveal>
        ))}</div>
      </div>
    </div>
  );
}
