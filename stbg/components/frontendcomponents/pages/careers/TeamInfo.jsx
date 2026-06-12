import Image from "next/image";

export default function TeamInfo(){
    return(
        <section>
            <div className="team_info_sec sec-pad-all sec-pad_career">
                <div className="container">
                    <div className="heading">
                        <h2>A team <span>Redefining Healthcare</span></h2>
                        <p>A collective of innovators, problem-solvers, and builders united by a single, ambitious mission.</p>
                    </div>
                    <div className="team_info_wrapper">
                        <div className="team_info_col">
                            <div className="upper_sec">
                                <h2>Tackle Meaningful Challenges</h2>
                                <div className="icon">
                                    <Image src="/assets/images/career/team_info1.svg" width="65" height="65" alt="icon"></Image>
                                </div>
                            </div>
                            <div className="desc">
                                <p>Operating at the complex intersection of fintech and healthcare, the work directly impacts millions of lives. This environment is designed for those passionate about untangling complex problems and building high-impact solutions.</p>
                            </div>
                        </div>
                        <div className="team_info_col">
                            <div className="upper_sec">
                                <h2>A Culture of Ownership & Growth</h2>
                                <div className="icon">
                                    <Image src="/assets/images/career/team_info2.svg" width="65" height="65" alt="icon"></Image>
                                </div>
                            </div>
                            <div className="desc">
                                <p>Great ideas are welcome from every level. Built on trust and ownership, the culture empowers individuals to take initiative and drive projects forward. Professional development is a core commitment, offering an environment ripe with learning opportunities.</p>
                            </div>
                        </div>
                        <div className="team_info_col">
                            <div className="upper_sec">
                                <h2>Collaborative Passion</h2>
                                <div className="icon">
                                    <Image src="/assets/images/career/team_info3.svg" width="65" height="65" alt="icon"></Image>
                                </div>
                            </div>
                            <div className="desc">
                                <p>Surroundings include a diverse team of bright and driven colleagues sharing a powerful sense of purpose. A collaborative setting encourages mutual challenges, shared learning, and collective celebration of success.</p>
                            </div>
                        </div>
                        <div className="team_info_col">
                            <div className="upper_sec">
                                <h2>Innovation in High-Growth Settings</h2>
                                <div className="icon">
                                    <Image src="/assets/images/career/team_info4.svg" width="65" height="65" alt="icon"></Image>
                                </div>
                            </div>
                            <div className="desc">
                                <p>At the forefront of an evolving healthcare landscape, this fast-paced setting encourages curiosity and provides the platform to turn ambitious ideas into reality.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}