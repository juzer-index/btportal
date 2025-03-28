import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const BacktoTop = () => {
  const [BacktoTop, setBacktopTop] = useState("");
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        setBacktopTop("d-block no-print");
      } else setBacktopTop("");
    });
  }, []);

  const screenup = () => {
    window.scrollTo({
      top: 10,
      behavior: "auto",
      //   smooth
    });
  };
  return (
    <div className='no-print'>
      <Link to="#" id="back-to-top" onClick={screenup} className={`${BacktoTop}`} ><i className="fa fa-angle-up"></i></Link>
    </div>
  );
};

BacktoTop.propTypes = {};

BacktoTop.defaultProps = {};

export default BacktoTop;









