import React, { useEffect } from 'react';
import styles from './PageHeader.module.scss';
import { Breadcrumb } from 'react-bootstrap';

const PageHeader = (props) => {

  useEffect(()=>{
    document.title = props.titles;
  },[props])
  return (

    <div className={styles.PageHeader}>
      {/* <!-- PAGE-HEADER --> */}
      <div className="page-header">
        <h1 className="page-title">{props.titles}</h1>
      </div>
      {/* <!-- PAGE-HEADER END --> */}
    </div>
  )
};

export default PageHeader;
