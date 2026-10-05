import { Link } from "react-router-dom";

// Inner-page header: the sea photo is a fixed full-page background, with breadcrumb and title on top.
export default function PageBanner({ img, title, sub, crumb, pos = "center" }) {
  return (
    <>
      <div className="bgfix" aria-hidden="true"><img src={`/img/${img}.jpg`} alt="" style={{ objectPosition: pos }} /></div>
      <section className="banner">
        <div className="container banner-in">
          <div className="crumbs" role="navigation" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><b>{crumb || title}</b></div>
          <h1>{title}</h1>
          {sub && <p>{sub}</p>}
        </div>
      </section>
    </>
  );
}
