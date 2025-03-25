import React, { useEffect, useState } from "react";
import styles from "./Header.module.scss";
import { Link, useNavigate } from "react-router-dom";
import {
  FormControl,
  Nav,
  Modal,
  Row,
  Col,
  Dropdown,
  Badge,
  Navbar,
  InputGroup,
  Button,
} from "react-bootstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { MENUITEMS } from "../Sidebar/Sidemenu";
import { auth } from "../../Firebase/firebase";
import { connect } from "react-redux";
import { shopingData } from "../../Data/DataECommerce/DataShoppingCart";
import { AddToCart } from "../../Redux/action";
import FaqModal from "../Backtotop/FaqModal";
import { ToastContainer } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchProjects } from '../../Redux/projectSlice';

//leftsidemenu
const SideMenuIcon = () => {
  document.querySelector(".app").classList.toggle("sidenav-toggled");
};

// FullScreen
var elem = document.documentElement;
var i = true;
const Fullscreen = (vale) => {
  switch (vale) {
    case true:
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
      }
      i = false;
      break;
    case false:
      document.exitFullscreen();
      i = true;
      break;
    default:
      break;
  }
};

const Header = ({ local_varaiable, AddToCart }) => {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(fetchProjects());
  //   console.log("usEffectCalled");
  // }, [dispatch]);

  // const projects = useSelector((state) => state.projects.data);
  // const loading = useSelector((state) => state.projects.loading);
  // const error = useSelector((state) => state.projects.error);
  // console.log("projects123",projects);

  // const el = document.querySelector('.main-content');
  // if (el) {
  //   el.addEventListener('click', () => {
  //     document.querySelector(".search-result").classList.add("d-none")
  //   })

  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [InputValue, setInputValue] = useState("");
  const [searchval, setsearchval] = useState("Type something");
  const [searchcolor, setsearchcolor] = useState("text-dark");
  const [NavData, setNavData] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [InputShow, setInputShow] = useState(false);

  const handleClose3 = () => setInputShow(false);
  const handleShow3 = () => setInputShow(true);

  let navigate = useNavigate();
  const routeChange = () => {
    let path = `${process.env.PUBLIC_URL}/`;
    navigate(path);
  };
  let myfunction = (inputvalue) => {
    document.querySelector(".search-result").classList.remove("d-none");
    // console.log('ok');

    let i = [];
    let allElement2 = [];

    MENUITEMS.map((mainlevel) => {
      if (mainlevel.Items) {
        mainlevel.Items.map((sublevel) => {
          // console.log("sublevel --- ", sublevel)
          if (sublevel.children) {
            sublevel.children.map((sublevel1) => {
              // console.log("sublevel1 --- ", sublevel1)
              i.push(sublevel1);
              if (sublevel1.children) {
                sublevel1.children.map((sublevel2) => {
                  // console.log("sublevel2 --- ", sublevel2)
                  i.push(sublevel2);
                  return sublevel2;
                });
              }
              return sublevel1;
            });
          }
          return sublevel;
        });
      }
      return mainlevel;
    });
    for (let allElement of i) {
      if (allElement.title.toLowerCase().includes(inputvalue.toLowerCase())) {
        if (
          allElement.title.toLowerCase().startsWith(inputvalue.toLowerCase())
        ) {
          setShow2(true);
          allElement2.push(allElement);
        }
      }
    }
    if (!allElement2.length || inputvalue === "") {
      if (inputvalue === "") {
        setShow2(false);
        setsearchval("Type something");
        setsearchcolor("text-dark");
      }
      if (!allElement2.length) {
        setShow2(false);
        setsearchcolor("text-danger");
        setsearchval("There is no component with this name");
      }
    }
    setNavData(allElement2);
  };

  // let location = useLocation();

  const [FiltershopingData, sethopingData] = useState([]);
  const [Price, setPrice] = useState(0);

  useEffect(() => {
    // console.log(local_varaiable);
    // if (local_varaiable == undefined) {
    // 	sethopingData(shopingData)
    // 	shopingData.filter((ele) => {
    // 		setPrice(Number(ele.newprice) + Price);
    // 	})
    // }
    // else if (local_varaiable.length == 0) {
    // 	sethopingData(shopingData)
    // 	shopingData.filter((ele) => {
    // 		setPrice(Number(ele.newprice) + Price);
    // 	})
    // }
    // else {
    // 	sethopingData(local_varaiable)
    // 	local_varaiable.filter((ele) => {
    // 		setPrice(Number(ele.newprice) + Price);
    // 	})
    // }
  }, [local_varaiable]);

  // const navigate = useNavigate();
  const formsSubmit = (e) => {};
  const LogoutFunction = () => {
    const user_type = localStorage.getItem("user_type");
    localStorage.clear();
    localStorage.setItem("adminUser", "");
    if (user_type === "admin") {
      navigate("/");
    } else if (user_type === "dealer") {
      navigate("/login_retailer");
    } else if (user_type === "customer") {
      navigate("/login_customer");
    } else {
      navigate("/");
    }
  };

  return (
    <div className={styles.Header}>
      <div className="header sticky app-header header1">
        <div className="container-fluid main-container">
          <div className="d-flex">
            <Link
              aria-label="Hide Sidebar"
              className="app-sidebar__toggle"
              data-bs-toggle="sidebar"
              to="#"
              onClick={() => SideMenuIcon()}
            />
            <Link
              className="logo-horizontal "
              to={`${process.env.PUBLIC_URL}/Dashboard`}
            >
              <img
                src={require("../../logo_t.png")}
                style={{ height: "80px" }}
                className="header-brand-img desktop-logo"
                alt="logo"
              />
              <img
                src={require("../../logo_t.png")}
                style={{ height: "50px" }}
                className="header-brand-img light-logo1"
                alt="logo"
              />
            </Link>

            <div className="main-header-center ms-3 d-none d-lg-block"></div>

            <Navbar className="d-flex order-lg-2 ms-auto header-right-icons">
              <Dropdown className="dropdown d-none">
                <Link to="#" className="nav-link icon ">
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
              <Navbar.Toggle className="d-lg-none ms-auto header2 navbar-toggler navresponsive-toggler">
                <span className="navbar-toggler-icon fe fe-more-vertical"></span>
              </Navbar.Toggle>

              <div className="dropdown d-flex">
                {/* <Button
                      className="me-3 mt-2"
                      variant="primary"
                      animation="flip"
                      onClick={handleShow3}
                    >
                     Project + 
                    </Button> */}
                <ToastContainer />

                <Modal show={InputShow} onHide={handleClose3}>
                  <Modal.Header>
                    <Modal.Title>Add</Modal.Title>
                    <span className="d-flex ms-auto" onClick={handleClose3}>
                      <i className="fe fe-x ms-auto"></i>
                    </span>
                  </Modal.Header>
                  <form
                    method="post"
                    onSubmit={formsSubmit}
                    autocomplete="off"
                    encType="multipart/form-data"
                  >
                    <Modal.Body>
                      <div className="container">
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="mb-3">
                              <label
                                htmlFor="recipient-name"
                                className="col-form-label"
                              >
                                Name :<span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                required
                                name="name"
                                placeholder="Enter  Name"
                              />
                            </div>
                          </div>
                          {/* <div className="col-lg-6">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                   Email<span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="email"
                                    className="form-control"
                                    required
                                    name="email"
                                    placeholder="Enter email"
                                  />
                                </div>
                              </div>
                              
                              <div className="col-lg-6">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                   Mobile<span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    required
                                    name="mobile"
                                    placeholder="Enter Mobile"
                                  />
                                </div>
                              </div> */}
                        </div>
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="success" type="submit">
                        Save Changes
                      </Button>

                      <Button variant="danger" onClick={handleClose3}>
                        Close
                      </Button>
                    </Modal.Footer>
                  </form>
                </Modal>
                <FaqModal />
              </div>
              <div className="dropdown d-flex">
                <Nav.Link
                  className="nav-link icon  nav-link-bg"
                  onClick={() => {
                    LogoutFunction();
                  }}
                >
                  <i className="fe  fe-log-out"></i>
                </Nav.Link>
              </div>
              <div className="responsive-navbar navbar p-0">
                <Navbar.Collapse className="" id="navbarSupportedContent-4">
                  <div className="d-flex order-lg-2">
                    {/* <Dropdown className="d-lg-none d-flex" >
                      <Dropdown.Toggle href="#" className="nav-link icon no-caret" >
                        <i className="fe fe-search"></i>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="header-search dropdown-menu-start">
                        <InputGroup className="w-100 p-2">
                          <FormControl type="text" placeholder="Search...." />
                          <InputGroup.Text>
                            <i className="fa fa-search" aria-hidden="true" ></i>
                          </InputGroup.Text>
                        </InputGroup>
                      </Dropdown.Menu>
                    </Dropdown> */}

                    {/* Country Select Modal */}

                    {/* Dark Mode */}

                    {/* <!-- Shopping-Cart Theme-Layout --> */}

                    {/* FullScreen button */}

                    {/* <div className="dropdown d-flex">
                      <Nav.Link className="nav-link icon full-screen-link nav-link-bg" onClick={() => Fullscreen(i)}>
                        <i className="fe fe-minimize fullscreen-button"></i>
                      </Nav.Link>
                    </div>
                    <div className="dropdown d-flex">
                      <FaqModal />
                    </div>

                    <div className="dropdown d-flex">
                      <Nav.Link className="nav-link icon  nav-link-bg" onClick={()=>{LogoutFunction()}}>
                          <i className="fe  fe-log-out"></i>
                      </Nav.Link>
                    </div> */}

                    {/* Notification */}

                    {/* Messages */}

                    {/* Right Side-bar */}

                    {/* Profile  */}
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
  );
};
const mapStateToProps = (state) => ({
  local_varaiable: state,
});
export default connect(mapStateToProps, { AddToCart })(Header);
