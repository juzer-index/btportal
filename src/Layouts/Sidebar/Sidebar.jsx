import React, { Fragment, useCallback, useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  MENUITEMS,
  ADMINMENUITEMS,
  DEALERMENUITEMS,
  CUSTOMERMENUITEMS,
  EMPLOYEETEMS,
  EXECUTIVEMENUITEMS,
} from "./Sidemenu";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Button, Modal } from "react-bootstrap";
import { getProjects } from "../../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../../Redux/projectSlice";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
const Onhover = () => {
  if (document.querySelector(".app")?.classList.contains("sidenav-toggled"))
    document.querySelector(".app").classList.add("sidenav-toggled-open");
};
const Outhover = () => {
  document.querySelector(".app")?.classList.remove("sidenav-toggled-open");
};
let history = [];
const adminUser = localStorage.getItem("adminUser") || "";

export const Sidebar = () => {
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(true);
  const [openCustomers, setOpenCustomers] = useState([]);

  const handleClick = (customerIndex) => {
    const updatedOpenCustomers = [...openCustomers];
    updatedOpenCustomers[customerIndex] = !openCustomers[customerIndex];
    setOpenCustomers(updatedOpenCustomers);
  };

  // const handleClick = () => {
  //   setOpen(!open);
  // };
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProjects());
    console.log("usEffectCalled");
  }, [dispatch]);

  const projects = useSelector((state) => state.projects.data);
  const loading = useSelector((state) => state.projects.loading);
  const error = useSelector((state) => state.projects.error);
  console.log("projectsidebar", projects);
  const user_type = localStorage.getItem("adminUser");
  let selectedMenuItem = [];
  const [InputShow, setInputShow] = useState(false);
  const [mainData, setMainData] = useState([
    {
      title: "ACG",
      selected: true,
      type: "link",
    },
    {
      title: "FAP",
      selected: false,
      type: "link",
    },
    {
      title: "CF",
      selected: false,
      type: "link",
    },
    {
      title: "KPI",
      selected: false,
      type: "link",
    },
  ]);

  const handleClose3 = () => setInputShow(false);
  const handleShow3 = () => setInputShow(true);

  if (user_type === "Admin") {
    selectedMenuItem = ADMINMENUITEMS;
  } else if (user_type === "Executive") {
    selectedMenuItem = EXECUTIVEMENUITEMS;
  } else {
    selectedMenuItem = EMPLOYEETEMS;
  }

  let location = useLocation();
  const [menuitems, setMenuitems] = useState(selectedMenuItem);

  useEffect(() => {
    history.push(location.pathname); // add  history to history  stack for current location.pathname to prevent multiple history calls innerWidth  and innerWidth calls from  multiple users. This is important because the history stack is not always empty when the user clicks  the history
    if (history.length > 2) {
      history.shift();
    }
    if (history[0] !== history[1]) {
      setSidemenu();
    }
    let mainContent = document.querySelector(".main-content");

    //when we click on the body to remove

    //eslint
    mainContent.addEventListener("click", mainContentClickFn);
    return () => {
      mainContent.removeEventListener("click", mainContentClickFn);
    };
  }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

  // location
  useEffect(() => {
    if (
      document.body.classList.contains("horizontal") &&
      window.innerWidth >= 992
    ) {
      clearMenuActive();
    }
  }, []);

  //  In Horizontal When we click the body it should we Closed using in useEfffect Refer line No:16
  //eslint
  function mainContentClickFn() {
    if (
      document.body.classList.contains("horizontal") &&
      window.innerWidth >= 992
    ) {
      clearMenuActive();
    }
  }

  function clearMenuActive() {
    MENUITEMS.map((mainlevel) => {
      if (mainlevel.Items) {
        mainlevel.Items.map((sublevel) => {
          sublevel.active = false;
          if (sublevel.children) {
            sublevel.children.map((sublevel1) => {
              sublevel1.active = false;
              if (sublevel1.children) {
                sublevel1.children.map((sublevel2) => {
                  sublevel2.active = false;
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

    setMenuitems((arr) => [...arr]);
  }

  function setSidemenu() {
    if (menuitems) {
      menuitems.map((mainlevel) => {
        if (mainlevel.Items) {
          mainlevel.Items.map((items) => {
            items.active = false;
            items.selected = false;
            if (
              location.pathname === "/sash/preview/" ||
              location.pathname === "/sash/preview"
            ) {
              location.pathname = "/sash/preview/Dashboard/";
            }

            if (location.pathname === items.path + "/") {
              items.active = true;
              items.selected = true;
            }
            if (items.children) {
              items.children.map((submenu) => {
                submenu.active = false;
                // console.log(submenu.active = false);
                submenu.selected = false;
                if (location.pathname === submenu.path + "/") {
                  items.active = true;
                  items.selected = true;
                  submenu.active = true;
                  submenu.selected = true;
                }
                if (submenu.children) {
                  submenu.children.map((submenu1) => {
                    submenu1.active = false;
                    submenu1.selected = false;
                    if (location.pathname === submenu1.path + "/") {
                      items.active = true;
                      items.selected = true;
                      submenu.active = true;
                      submenu.selected = true;
                      submenu1.active = true;
                      submenu1.selected = true;
                    }
                    return submenu1;
                  });
                }
                return submenu;
              });
            }
            return items;
          });
        }
        setMenuitems((arr) => [...arr]);
        return mainlevel;
      });
    }
  }

  function toggleSidemenu(item) {
    if (
      !document.body.classList.contains("horizontal-hover") ||
      window.innerWidth < 992
    ) {
      // To show/hide the menu
      if (!item.active) {
        menuitems.map((mainlevel) => {
          if (mainlevel.Items) {
            mainlevel.Items.map((sublevel) => {
              sublevel.active = false;
              if (item === sublevel) {
                sublevel.active = true;
              }
              if (sublevel.children) {
                sublevel.children.map((sublevel1) => {
                  sublevel1.active = false;
                  if (item === sublevel1) {
                    sublevel.active = true;
                    sublevel1.active = true;
                  }
                  if (sublevel1.children) {
                    sublevel1.children.map((sublevel2) => {
                      sublevel2.active = false;
                      if (item === sublevel2) {
                        sublevel.active = true;
                        sublevel1.active = true;
                        sublevel2.active = true;
                      }
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
      } else {
        item.active = !item.active;
      }
    }

    setMenuitems((arr) => [...arr]);
  }
  const formsSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    // formData.append("icon", selectedImage1);
    console.log("formData", formData);
    const formJson = Object.fromEntries(formData.entries());
    addData(formJson);
  };
  const getData = useCallback(async () => {
    try {
      const apiData = await getProjects();
      if (apiData.error) {
        // setError(apiData.error);
      } else {
        console.log("getData", apiData.data);
        setMainData(apiData.data);
      }
    } catch (err) {
      // console.log("err", err.name);
      // if (err.response) {
      //   setError(err.response.data.message);
      //   setErrorToast(err.response.data.message);
      // } else if (err.name === "AxiosError") {
      //   setError(err.message);
      //   setErrorToast(err.message);
      // } else {
      //   setError("something went wrong");
      //   setErrorToast("something went wrong");
      // }
    }
    // setLoading(false);
  }, []);

  const addData = async (body) => {
    // try {
    //   const apiData = await addCustomer(body);
    //   if (apiData.error) {
    //   } else {
    //     getData();
    //     handleClose3();
    //   }
    // } catch (err) {
    // }
    // setLoading(false);
  };
  return (
    <Fragment>
      <div
        className="app-sidebar"
        onMouseOver={() => Onhover()}
        onMouseOut={() => Outhover()}
      >
        <PerfectScrollbar
          options={{ suppressScrollX: true, useBothWheelAxes: false }}
        >
          <div className="side-header">
            {adminUser}
            <Link
              className="header-brand1"
              to={`${process.env.PUBLIC_URL}/Dashboard/`}
            >
              <img
                src={require("../../logo_t.png")}
                style={{ width: "75px" }}
                className="header-brand-img desktop-logo"
                alt="logo1"
              />
              <img
                src={require("../../logo_t.png")}
                className="header-brand-img toggle-logo"
                alt="logo-2"
              />
              <img
                src={require("../../logo_t.png")}
                className="header-brand-img light-logo"
                alt="logo-3"
              />
              <img
                src={require("../../logo_t.png")}
                style={{ width: "75px" }}
                className="header-brand-img light-logo1"
                alt="logo-4"
              />
            </Link>
          </div>
          <div className="main-sidemenu">
            <div className="slide-left disabled" id="slide-left">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#7b8191"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z" />
              </svg>
            </div>
            {/* first level */}
            <ul className="side-menu" style={{ marginLeft: "0px" }}>
              {menuitems.map((Item, i) => (
                <Fragment key={i + Math.random() * 100}>
                  <li className="sub-category">
                    <h3>{Item.menutitle}</h3>
                  </li>
                  {Item.Items.map((menuItem, i) => (
                    <li
                      className={`slide ${
                        menuItem.selected ? "is-expanded" : ""
                      }`}
                      key={i}
                    >
                      {menuItem.type === "sub" ? (
                        <Link
                          to="#"
                          className={`side-menu__item ${
                            menuItem.selected ? "active" : ""
                          }`}
                          onClick={(event) => {
                            event.preventDefault();
                            toggleSidemenu(menuItem);
                          }}
                        >
                          <i className={`${menuItem.icon} side-menu__icon`}></i>
                          <span className="side-menu__label">
                            {menuItem.title}
                            {menuItem.active}
                          </span>
                          {menuItem.badge ? (
                            <span className={menuItem.badge}>
                              {menuItem.badgetxt}
                            </span>
                          ) : (
                            ""
                          )}

                          {menuItem.active ? (
                            document.body.classList.contains("horizontal") ? (
                              <i className="angle fe fe-chevron-up"></i>
                            ) : (
                              <i className="angle fe fe-chevron-down"></i>
                            )
                          ) : document.body.classList.contains("horizontal") ? (
                            <i className="angle fe fe-chevron-down"></i>
                          ) : (
                            <i className="angle fe fe-chevron-right"></i>
                          )}
                        </Link>
                      ) : (
                        ""
                      )}

                      {menuItem.type === "link" ? (
                        <NavLink
                          to={menuItem.path + "/"}
                          className={`side-menu__item ${
                            menuItem.selected ? "active" : ""
                          }`}
                          onClick={() => toggleSidemenu(menuItem)}
                        >
                          <i className={`${menuItem.icon} side-menu__icon`}></i>
                          <span className="side-menu__label">
                            {menuItem.title}
                          </span>
                          {menuItem.badge ? (
                            <span className={menuItem.badge}>
                              {menuItem.badgetxt}
                            </span>
                          ) : (
                            ""
                          )}
                        </NavLink>
                      ) : (
                        ""
                      )}
                      {/* Second Level */}
                      {menuItem.children ? (
                        <ul
                          className={`slide-menu ${menuItem.Names} ${
                            menuItem.active ? "open" : ""
                          }`}
                          style={
                            menuItem.active
                              ? {
                                  opacity: 1,
                                  transition: "opacity 500ms ease-in",
                                  display: "block",
                                }
                              : { display: "none" }
                          }
                        >
                          <div className={`${menuItem.Name}`}>
                            {menuItem.children.map((childrenItem, index) => {
                              return (
                                <li
                                  key={index}
                                  className={`sub-slide ${
                                    childrenItem.selected ? "is-expanded" : ""
                                  }`}
                                >
                                  {childrenItem.type === "sub" ? (
                                    <Link
                                      to="#"
                                      className={`sub-side-menu__item ${
                                        childrenItem.selected ? "active" : ""
                                      }`}
                                      onClick={(event) => {
                                        event.preventDefault();
                                        toggleSidemenu(childrenItem);
                                      }}
                                    >
                                      <span className="sub-side-menu__label">
                                        {childrenItem.title}
                                        {childrenItem.active}
                                      </span>
                                      {childrenItem.active ? (
                                        <i className="sub-angle fa fa-angle-down"></i>
                                      ) : (
                                        <i className="sub-angle fa fa-angle-right"></i>
                                      )}
                                    </Link>
                                  ) : (
                                    ""
                                  )}

                                  {childrenItem.type === "link" ? (
                                    <NavLink
                                      to={childrenItem.path + "/"}
                                      className="slide-item"
                                    >
                                      {childrenItem.title}
                                    </NavLink>
                                  ) : (
                                    ""
                                  )}
                                  {/* third lavel */}
                                  {childrenItem.children ? (
                                    <ul
                                      className="sub-slide-menu"
                                      style={
                                        childrenItem.active
                                          ? { display: "block" }
                                          : { display: "none" }
                                      }
                                    >
                                      {childrenItem.children.map(
                                        (childrenSubItem, key) => (
                                          <li
                                            className={`${
                                              childrenSubItem.selected
                                                ? " is-expanded"
                                                : ""
                                            }`}
                                            key={key}
                                          >
                                            {childrenSubItem.type === "link" ? (
                                              <NavLink
                                                to={childrenSubItem.path + "/"}
                                                className="sub-slide-item"
                                              >
                                                {childrenSubItem.title}
                                              </NavLink>
                                            ) : (
                                              ""
                                            )}

                                            {childrenSubItem.type === "sub" ? (
                                              <Link
                                                to="#"
                                                className={`"sub-slide-item" ${
                                                  childrenSubItem.selected
                                                    ? " is-expanded"
                                                    : ""
                                                }`}
                                                onClick={(event) => {
                                                  event.preventDefault();
                                                  toggleSidemenu(
                                                    childrenSubItem
                                                  );
                                                }}
                                              >
                                                <span className="sub-side-menu__label">
                                                  {childrenSubItem.title}
                                                </span>
                                                {childrenSubItem.active ? (
                                                  <i className="sub-angle fa fa-angle-down"></i>
                                                ) : (
                                                  <i className="sub-angle fa fa-angle-right"></i>
                                                )}
                                              </Link>
                                            ) : (
                                              ""
                                            )}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  ) : (
                                    ""
                                  )}
                                </li>
                              );
                            })}
                          </div>
                        </ul>
                      ) : (
                        ""
                      )}
                    </li>
                  ))}
                </Fragment>
              ))}
            </ul>
            <ul className="side-menu" style={{ marginLeft: "0px" }}>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    Project Data
                    {/* <span
                              onClick={() => {
                                dispatch(fetchProjects());
                                alert("dispatch");
                              }}
                            
                            >
                           Refresh   <i className="fe fe-arrows-rotate"></i>
                            </span> */}
                  </ListSubheader>
                }
              >
                {loading === true && (
                  <div>
                    <ListItemButton>
                      <ListItemText primary="Loading..." />
                    </ListItemButton>
                  </div>
                )}
                {projects &&
                  projects.map((customer, index) => (
                    <div key={customer._id}>
                      <ListItemButton
                        disableRipple
                        onClick={() => handleClick(index)}
                      >
                        <i className="fe fe-folder side-menu__icon"></i>

                        <span className="side-menu__label">
                          {customer.customerName}
                        </span>

                        {openCustomers[index] ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse
                        in={openCustomers[index]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" disablePadding>
                          {customer.projects.map((project, i) => {
                            if (!project?.isActive) {
                              return null;
                            }
                            return (
                              <ListItemButton
                                disableRipple
                                onClick={() => {
                                  navigate(
                                    `${process.env.PUBLIC_URL}/project/${project._id}`
                                  );
                                }}
                                key={project._id}
                                sx={{ pl: 4 }}
                              >
                                <i className="fe fe-file side-menu__icon"></i>
                                <span className="side-menu__label-item">
                                  {/* {`${i + 1}. ${project.name}`} */}
                                  {`${project.name}`}
                                </span>
                              </ListItemButton>
                            );
                          })}
                        </List>
                      </Collapse>
                    </div>
                  ))}
              </List>
            </ul>

            <div className="slide-right" id="slide-right">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#7b8191"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z" />
              </svg>
            </div>
          </div>
        </PerfectScrollbar>
      </div>
    </Fragment>
  );
};
