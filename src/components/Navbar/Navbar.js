import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "../../redux/reducers/authReducer";
import { logout } from "../../redux/reducers/authReducer";
//Icons..
import CloseMenu from "../../assets/close.svg";
import HamburgerMenu from "../../assets/hamburger.svg";
import HomeIcon from "../../assets/home.png";
import OrdersIcon from "../../assets/basket.png";
import SignIn from "../../assets/Log in.png";
import Logout from "../../assets/Log Out.png";
import Cart from "../../assets/cart.png";

const Navbar = () => {
  const [click, setClick] = useState(false);
  const dispatch = useDispatch();

  const user = useSelector(getUser);
  const isAuthenticated = user;

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Function to logout from app
  const onLogoutHandler = () => {
    scrollTop();
    dispatch(logout()); // inbuilt firebase function to logout
    closeMobileMenu();
  };

  return (
    <nav
      className="navbar"
      style={{
        justifyContent: "space-evenly",
        boxShadow: "rgb(17 17 26 / 5%) 0px 15px 20px",
      }}
    >
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo" onClick={closeMobileMenu}>
          Busy Buy
        </NavLink>
        <div className="menu-icon" onClick={handleClick}>
          <img
            src={click ? CloseMenu : HamburgerMenu}
            style={{ width: "35px", height: "35px", marginTop: "-20px" }}
            alt=""
          />
        </div>
        <ul
          className={click ? "nav-menu active" : "nav-menu"}
          onClick={scrollTop}
        >
          <li className="nav-item active">
            <NavLink
              activeclassname="active-links"
              to="/"
              className="nav-links"
              onClick={closeMobileMenu}
              exact="true"
            >
              <span>
                <img
                  className="icon_styles"
                  src={HomeIcon}
                  alt="Home"
                  onClick={scrollTop}
                />
              </span>{" "}
              Home
            </NavLink>
          </li>

          {isAuthenticated && (
            <>
              <li className="nav-item active">
                <NavLink
                  activeclassname="active-links"
                  to="/myorders"
                  onClick={closeMobileMenu}
                  className="nav-links"
                >
                  <span>
                    <img
                      className="icon_styles"
                      src={OrdersIcon}
                      alt="Orders"
                      onClick={scrollTop}
                    />
                  </span>{" "}
                  My orders
                </NavLink>
              </li>

              <li className="nav-item active">
                <NavLink
                  activeclassname="active-links"
                  to="/cart"
                  onClick={closeMobileMenu}
                  className="nav-links"
                >
                  <span>
                    <img
                      className="icon_styles"
                      src={Cart}
                      alt="Cart"
                      onClick={scrollTop}
                    />
                  </span>{" "}
                  Cart
                </NavLink>
              </li>
            </>
          )}

          <li className="nav-item active">
            {isAuthenticated ? (
              <NavLink
                to="/"
                onClick={onLogoutHandler}
                activeclassname="active-links"
                className="nav-links"
              >
                <span>
                  <img className="icon_styles" src={Logout} alt="Logout" />
                </span>
                Logout
              </NavLink>
            ) : (
              <>
                <NavLink
                  activeclassname="active-links"
                  to="/signin"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  <span>
                    <img
                      className="icon_styles"
                      src={SignIn}
                      alt="SignIn"
                      onClick={scrollTop}
                    />
                  </span>
                  SignIn
                </NavLink>
              </>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
