import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import "./Header.scss";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Button href="/home" color="inherit">
            <HomeIcon />
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Button href="/listusers" color="inherit">
              Usuarios
            </Button>
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Button href="/listcategories" color="inherit">
              Categorias
            </Button>
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Button href="/listplaces" color="inherit">
              Lugares
            </Button>
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Button href="/listfeatures" color="inherit">
              Caracteristicas
            </Button>
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Button href="/null" color="inherit">
              Estadisticas
            </Button>
          </Typography>
          <Button color="inherit">
            <AccountMenu />
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

function AccountMenu() {
  const history = useHistory();
  const logOut = () => {
    sessionStorage.clear();
    history.push("/login");
  };
  const ChangePassword = () => {
    sessionStorage.clear();
    history.push("/changepassword");
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton onClick={handleClick} size="small" sx={{ ml: 1 }}>
            <AccountCircleIcon sx={{ width: 32, height: 32 }} />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <Avatar />
          <b>
            {sessionStorage.getItem("user login first_name") +
              " " +
              sessionStorage.getItem("user login last_name")}
          </b>
        </MenuItem>
        <MenuItem>
          <b>{sessionStorage.getItem("user login nick")}</b>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={ChangePassword}
          component={Link}
          to="/changepassword"
        >
          <ListItemIcon path="/listusers" to="/changepassword">
            <Logout fontSize="small" />
          </ListItemIcon>
          Cambiar contraseña
        </MenuItem>
        <MenuItem onClick={logOut} component={Link} to="/login">
          <ListItemIcon path="/listusers">
            <Logout fontSize="small" />
          </ListItemIcon>
          Salir
        </MenuItem>
        <MenuItem component={Link} to="/changePassword">
          <ListItemIcon path="/listusers">
            <Logout fontSize="small" />
          </ListItemIcon>
          Cambiar contraseña
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
