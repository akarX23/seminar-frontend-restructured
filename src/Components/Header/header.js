import { Button, makeStyles } from "@material-ui/core";
import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { userTypes } from "../../helpers/utils";
import Avatar from "@material-ui/core/Avatar";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import "./header.css";
import { IconButton } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { useHistory } from "react-router-dom";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { collegeAddSessions, logout } from "../../actions/user_actions";
import BuySessions from "./buySessions";
import { grey } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: theme.palette.primary.main,
  },
  brand: {
    ...theme.typography.h5,
    color: theme.palette.common.white + " !important",
  },
  login: {
    backgroundColor: theme.palette.secondary.main,
    boxShadow: theme.shadows[0],
    ...theme.typography.body2,
    color: theme.palette.common.white,
    padding: "10px 20px",
    "&:hover": {
      color: theme.palette.common.white,
      backgroundColor: theme.palette.secondary.dark,
    },
    borderRadius: 5,
    fontWeight: theme.typography.fontWeightBold,
    letterSpacing: "0.1em",
  },
  sesCredits: {
    ...theme.typography.subtitle1,
    marginRight: 10,
  },
  userDetails: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: theme.palette.common.white,
  },
  avatar: {
    width: 30,
    height: 30,
    marginLeft: 20,
    cursor: "pointer",
  },
  arrow: {
    color: theme.palette.common.white,
    width: 8,
    height: 8,
    marginLeft: 5,
    marginTop: 3,
  },
  menuPaper: {
    backgroundColor: theme.palette.background.paper,
    marginTop: "5px",
    marginLeft: "20px",
  },
  menuItem: {
    "&:hover": {
      backgroundColor: grey[300],
    },
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
  },
  menuItemIcon: {
    marginRight: "-23px",
  },
}));

const Header = ({ user: { details, type }, collegeAddSessions, logout }) => {
  const classes = useStyles();
  const [show, setShowMenu] = useState(false);
  const [showBuySession, setShowBuySession] = useState(false);
  const history = useHistory();

  const menuTrigger = useRef(null);

  const handleOpenMenu = () => {
    setShowMenu(true);
  };

  const handleClose = () => setShowMenu(false);

  const handleLogout = async () => {
    await logout();
  };

  const getCollegeDropdownNav = () => {
    const nav = [
      { text: "My Courses", link: "/mycourses", Icon: MenuBookIcon },
      {
        text: "Buy Sessions",
        func: () => {
          setShowBuySession(true);
          setShowMenu(null);
        },
        Icon: ShoppingBasketIcon,
      },
    ];
    return nav;
  };

  const getStudentDropdownNav = () => {
    const nav = [
      { text: "My Sessions", link: "/mysessions", Icon: MenuBookIcon },
    ];
    return nav;
  };

  const handleBuySessions = async (number_of_sessions) => {
    // Temporary condition. Check will performed while submitting
    if (number_of_sessions < 1 || number_of_sessions === "") {
      return;
    }

    await collegeAddSessions(details?.id, number_of_sessions);
    setShowBuySession(false);
  };

  const getDropdownItems = () => {
    let dropdown = [];
    if (type === userTypes.COLLEGE) dropdown = [...getCollegeDropdownNav()];
    if (type === userTypes.STUDENT) dropdown = [...getStudentDropdownNav()];
    dropdown.push({ text: "Logout", func: handleLogout, Icon: ExitToAppIcon });

    return dropdown.map(({ Icon, text, link, func }, i) => (
      <MenuItem
        className={classes.menuItem}
        onClick={(event) => {
          link && history.push(link);
          func && func();
        }}
        key={i}
      >
        <ListItemIcon className={classes.menuItemIcon}>
          <Icon />
        </ListItemIcon>
        <ListItemText primary={text} />
      </MenuItem>
    ));
  };

  return (
    <div className={`padding-alignment ${classes.wrapper}`}>
      <a className={classes.brand} href="/">
        Seminar Room
      </a>
      <div className={classes.userDetails}>
        {!details && (
          <Button className={classes.login} href="/login">
            Login
          </Button>
        )}
        {type === userTypes.COLLEGE && (
          <p>Session Credits : {details.session_count}</p>
        )}
        {details && (
          <>
            <Avatar
              src={details?.image}
              alt="user-image"
              className={classes.avatar}
              onClick={handleOpenMenu}
            />
            <IconButton
              className={classes.arrow}
              onClick={handleOpenMenu}
              ref={menuTrigger}
            >
              <ExpandMoreIcon />
            </IconButton>
            <Menu
              id="user-menu"
              keepMounted
              open={show}
              onClose={handleClose}
              anchorEl={menuTrigger.current}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              classes={{ paper: classes.menuPaper }}
            >
              {getDropdownItems()}
            </Menu>
            <BuySessions
              open={showBuySession}
              closeDialog={setShowBuySession}
              buySessions={handleBuySessions}
            />
          </>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({ logout, collegeAddSessions }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
