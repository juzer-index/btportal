import React, { useState, useEffect } from 'react';
import styles from './Header.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { FormControl, Nav, Navbar, Dropdown, InputGroup, Modal, Row, Col, Badge } from 'react-bootstrap';
import { MENUITEMS } from '../Sidebar/Sidemenu';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { auth } from '../../Firebase/firebase';

const SideMenuIcon = () => {
  //leftsidemenu
  document.querySelector(".app").classList.toggle("sidenav-toggled");
}

// Darkmode
const DarkMode = () => {
  document.querySelector(".app").classList.toggle('dark-mode');
}

// FullScreen
var elem = document.documentElement;
var i = true
const Fullscreen = (vale) => {
  switch (vale) {
    case true:
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
      }
      i = false
      break;
    case false:
      document.exitFullscreen()
      i = true
      break;
      default:
        break;
  }
}

// SwitcherMenu

// const SidSwitcherIcon = () => {

//   //leftsidemenu
//   document.querySelector(".demo_changer").classList.toggle("active");
//   document.querySelector(".demo_changer").style.right = "0px";

// }

const RightSideBar = () => {
  //leftsidemenu

  //rightsidebar
  document.querySelector(".sidebar-right").classList.toggle("sidebar-open");
  //swichermainright
}
const Header = () => {

  document.querySelector('.main-content')?.addEventListener('click', () => {
    console.log("search-result");
    document.querySelector(".search-result")?.classList.add("d-none")
  })

  // For CountrySelector Modal
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [InputValue, setInputValue] = useState("");
  const [searchval, setsearchval] = useState("Type something");
  const [searchcolor, setsearchcolor] = useState("text-dark");
  const [NavData, setNavData] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {

  })
  let myfunction = (inputvalue) => {
    document.querySelector(".search-result").classList.remove("d-none")
    console.log('ok');
    
    let i =[]
    let allElement2 = [];
    
    MENUITEMS.map(mainlevel => {
      if (mainlevel.Items) {
        mainlevel.Items.map(sublevel => {
          // console.log("sublevel --- ", sublevel)
          if (sublevel.children) {
            sublevel.children.map(sublevel1 => {
              // console.log("sublevel1 --- ", sublevel1)
              i.push(sublevel1)
              if (sublevel1.children) {
                sublevel1.children.map(sublevel2 => {
                  // console.log("sublevel2 --- ", sublevel2)
                i.push(sublevel2)
                  return sublevel2;
                })
              }
              return sublevel1;
            })
          }
          return sublevel;
        })
      }
      return mainlevel;

    }
    )
    for (let allElement of i){
      if(allElement.title.toLowerCase().includes(inputvalue.toLowerCase())){
        if(allElement.title.toLowerCase().startsWith(inputvalue.toLowerCase())){
          setShow2(true)
          allElement2.push(allElement)
        }
        }
      }       
      if(!allElement2.length || inputvalue === ""){
        if(inputvalue === ""){
          setShow2(false);
          setsearchval("Type something")
          setsearchcolor('text-dark')
        }
        if(!allElement2.length){
          setShow2(false);
          setsearchcolor('text-danger')
          setsearchval("There is no component with this name")
        }
      }
      setNavData(allElement2)
  }
  
  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `${process.env.PUBLIC_URL}/`; 
    navigate(path);
  }
  return (
    <div className={styles.Header}>

<div className='header sticky app-header header1'>
        <div className="container-fluid main-container">
          <div className="d-flex">
            <Link aria-label="Hide Sidebar" className="app-sidebar__toggle" data-bs-toggle="sidebar" to="#" onClick={() => SideMenuIcon()} />
            <Link className="logo-horizontal " to={`${process.env.PUBLIC_URL}/Dashboard`}>
              <img src={require("../../assets/images/brand/logo-white.png")} className="header-brand-img desktop-logo" alt="logo" />
              <img src={require("../../assets/images/brand/logo-dark.png")} className="header-brand-img light-logo1" alt="logo" />
            </Link>
            {/* <div className="main-header-center ms-3 d-none d-lg-block">
              <FormControl onChange={(ele=>{myfunction(ele.target.value); setInputValue(ele.target.value)})} onClick={()=>{setShow1(true)}} placeholder="Search for results..." type="search" />
              <button className='btn px-0 pt-2'><i className="fe fe-search" aria-hidden="false"></i></button>
              {show1 ?
                <div className="card search-result p-absolute w-100 card border mt-1">
                <div className="card-header">
                <h4 className="card-title me-2 text-break">Search result of "{InputValue}" </h4>
                </div>
                <ul className='card-body list-group'>
                    {show2 ?
                  NavData.map((e) => 
                  <li  key={Math.random()}>
                    <Link className='list-group-item'  to={`${e.path}/`}>{e.title}</Link>
                  </li>
                    )
                    :<b className={`${searchcolor} list-group-item`}>{searchval}</b>}
                </ul>
                 
                 </div>
                : ""}
            </div> */}

            <Navbar className="d-flex order-lg-2 ms-auto header-right-icons">
              <Dropdown className="dropdown d-none" >
                <Link to="#" className="nav-link icon " >
                  <i className="fe fe-search"></i>
                </Link>
                <Dropdown.Menu className="header-search dropdown-menu-start ">
                  <InputGroup className="input-group w-100 p-2">
                    <FormControl type="text" placeholder="Search...." />
                    <InputGroup.Text className="btn btn-primary">
                      <i className="fe fe-search" aria-hidden="true"></i>
                    </InputGroup.Text>
                  </InputGroup>
                </Dropdown.Menu>
              </Dropdown>
              <Navbar.Toggle className="d-lg-none ms-auto header2" >
                <span className="navbar-toggler-icon fe fe-more-vertical"></span>
              </Navbar.Toggle>

              <div className="responsive-navbar p-0">

                <Navbar.Collapse className="" id="navbarSupportedContent-4">
                  <div className="d-flex order-lg-2">


                    {/* Dark Mode */}

                    <div className="dropdown  d-flex">
                      <Nav.Link className="nav-link icon theme-layout nav-link-bg layout-setting" onClick={() => DarkMode()}>
                        <span className="dark-layout"><i className="fe fe-moon"></i></span>
                        <span className="light-layout"><i className="fe fe-sun"></i></span>
                      </Nav.Link>
                    </div>


                    {/* FullScreen button */}

                    <div className="dropdown d-flex">
                      <Nav.Link className="nav-link icon full-screen-link nav-link-bg" onClick={() => Fullscreen(i)}>
                        <i className="fe fe-minimize fullscreen-button"></i>
                      </Nav.Link>
                    </div>


                  </div>
                </Navbar.Collapse>
              </div>

              {/* Switcher  */}

              {/* <div className="demo-icon nav-link icon" onClick={() => SidSwitcherIcon()}>
                <i className="fe fe-settings fa-spin  text_primary"></i>
              </div> */}

            </Navbar>
          </div>
        </div>
      </div>
    </div>
  )

};

export default Header;
