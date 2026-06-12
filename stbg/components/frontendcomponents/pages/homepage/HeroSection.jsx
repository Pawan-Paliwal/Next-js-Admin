import Image from "next/image";

export default function HeroSection() {
  return (
    <section>
      <div className="home-secA sec-pad-all">
        <div className="container">
          <div className="main_wrapper flex">
            <div className="colA">
              <div className="heading">
                <h1>Transforming <span> India’s healthcare ecosystem</span></h1>
                <p>One connected ecosystem for care, cure, and community. Built on trust, powered by technology, designed for people.</p>
              </div>
            </div>
            <div className="colB">
              <div className="animate_figure">
                <figure>
                  <Image src="/assets/images/home/hero_1.png" width="200" height="350" alt="Hero Image"></Image>
                </figure>
                <figure>
                  <Image src="/assets/images/home/hero_2.png" width="200" height="350" alt="Hero Image"></Image>
                </figure>
                <figure>
                  <Image src="/assets/images/home/hero_3.png" width="200" height="350" alt="Hero Image"></Image>
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
