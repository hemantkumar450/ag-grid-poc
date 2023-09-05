import { NavLink } from "react-router-dom";
import classes from "./main-navigation.module.css";

const MainNavigation = () => {
  return (
    <header className={classes.header}>
      <nav>
        <div className={classes.list}>
          
            <NavLink
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              to="/"
              end
            >
              Home
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              to="/grid"
            >
              Grid
            </NavLink>
          
        </div>
      </nav>
    </header>
  );
};

export default MainNavigation;
