import { Navbar, Nav, Container } from "react-bootstrap";
import React from "react";
import logo from "../assets/logo.png";
import styles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";

import {
  useCurrentUser,
  useSetCurrentUser,
} from "../context/CurrentUserContext";

import axios from "axios";

const NavBar = ({ showAddTaskMenuItem, showAddTeamMenuItem }) => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  const handleSignOut = async () => {
    try {
      await axios.post("dj-rest-auth/logout/");
      setCurrentUser(null);
    } catch (err) {
      console.log(err);
    }
  };


  const addTaskIcon = (
    <NavLink
      className={styles.NavLink}
      activeClassName={styles.Active}
      to="/tasks/create"
    >
      <i className="far fa-plus-square"></i>Task
    </NavLink>
  );

  const addTeamIcon = (
    <NavLink
      className={styles.NavLink}
      activeClassName={styles.Active}
      to="/teams/create"
    >
      <i className="far fa-plus-square"></i>Team
    </NavLink>
  );

  const loggedInIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        to={`/tasks/`}
      >
        <i className="fa-solid fa-list"></i>Tasks
      </NavLink>
      <NavLink
        className={styles.NavLink}
        to={`/teams/`}
      >
        <i className="fa-solid fa-list"></i>Teams
      </NavLink>
      <NavLink className={styles.NavLink} to="/" onClick={handleSignOut}>
        <i className="fas fa-sign-out-alt"></i>{currentUser && currentUser.username}
      </NavLink>
    </>
  );

  const loggedOutIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signin"
      >
        <i className="fas fa-sign-in-alt"></i>Sign in
      </NavLink>
      <NavLink
        to="/signup"
        className={styles.NavLink}
        activeClassName={styles.Active}
      >
        <i className="fas fa-user-plus"></i>Sign up
      </NavLink>
    </>
  );

  return (
    <Navbar expanded={expanded} className={styles.NavBar} expand="md" fixed="top">
      <Container>
        <NavLink to="/" className={styles.Logo}>
          <Navbar.Brand className={styles.LogoImage}>
            <img src={logo} alt="logo" height="30" />
            <span className={styles.LogoText}>ORGANIZER</span>
          </Navbar.Brand>
        </NavLink>
        {showAddTaskMenuItem && addTaskIcon}
        {showAddTeamMenuItem && addTeamIcon}

        <Navbar.Toggle
          ref={ref}
          onClick={() => setExpanded(!expanded)}
          aria-controls="basic-navbar-nav"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-left">
            <NavLink
              exact
              className={styles.NavLink}
              activeClassName={styles.Active}
              to="/"
            >
              <i className="fas fa-home"></i>Home
            </NavLink>

            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;