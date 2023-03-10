import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import logo from "../../assets/logo.svg";

const Navbar = () => {
  const { toggleDarkMode, darkMode } = useContext(DarkModeContext);
  const { user, logOut } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleProfile = () => {
    const userId = JSON.parse(localStorage.getItem("user") || "null")?.id;
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <img src={logo} alt="socialsync logo " />
        </Link>
        <HomeOutlinedIcon />
        {darkMode ? (
          <WbSunnyOutlinedIcon
            onClick={toggleDarkMode}
            style={{ cursor: "pointer" }}
          />
        ) : (
          <DarkModeOutlinedIcon
            onClick={toggleDarkMode}
            style={{ cursor: "pointer" }}
          />
        )}
        <GridViewOutlinedIcon />
        <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="right">
        <PersonOutlinedIcon
          onClick={handleProfile}
          style={{ cursor: "pointer" }}
        />
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />
        <ExitToAppOutlinedIcon onClick={logOut} style={{ cursor: "pointer" }} />
        <div className="user">
          <img src={`/upload/${user?.profileImg}`} alt="" />
          <span>{user?.name}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
