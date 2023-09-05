import { Link, useNavigate } from "react-router-dom";
import classes from "./home.module.css";
const HomePage = () => {
  const navigate = useNavigate();
  const navigateHandler = () => navigate("/Grid");
  return (
    <>
      <div className={classes.container}>
        <h1>Home</h1>
        <div>AG-Grid Example with react</div>
        <Link to={"/grid"}> To Grid</Link>
      </div>
    </>
  );
};
export default HomePage;
