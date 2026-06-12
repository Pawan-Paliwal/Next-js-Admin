import PoistionsCol from "@/components/frontendcomponents/molecules/PoistionsCol";

export default function OpenPositions({ positions, ref }) {
    if (!positions || positions.length === 0) return null;
    return (
        <section>
            <div className="open_positions_sec sec-pad-all sec-pad_career" ref={ref}>
                <div className="container">
                    <div className="main_wrapper">
                        <div className="heading">
                            <em>Open positions ({positions.length})</em>

                            <h2>
                                Ready for the <span>Next Challenge?</span>
                            </h2>
                            <p>Find a role where expertise directly creates a positive, lasting impact on the healthcare system. The journey toward institutional transformation starts here.</p>
                        </div>
                        <div className="open_wrapper">
                            {positions.map((position) => (
                                <PoistionsCol
                                    key={position.JobCategoryID}
                                    positionName={position.JobCategoryName}
                                    positionLoc={position.JobLocation}
                                    jobDescription={position.JobCategoryDescription}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
