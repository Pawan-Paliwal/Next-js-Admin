import React from "react";

const Detail = ({ data, id = null, className = "" }) => {
  return (
    <section id={id} className={`py-16 ${className}`}>
      <div className="container">
        <div className="[&_p]:text-text mx-auto max-w-[836px] 2xl:max-w-none [&_p]:not-first:mt-4">
          {data}
        </div>
      </div>
    </section>
  );
};

export default Detail;
