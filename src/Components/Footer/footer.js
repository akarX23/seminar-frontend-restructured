import { makeStyles } from "@material-ui/core";
import React from "react";
import { useRouteMatch } from "react-router-dom";
import twitterImage from "../../assets/images/tw.png";
import fbImage from "../../assets/images/fb.png";

const useStyles = makeStyles((theme) => ({
  wrapper: (props) => ({
    backgroundColor: props.light ? "#333" : "#6f8197",
    color: theme.palette.common.white,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }),
  footerText: {
    ...theme.typography.body1,
  },
  footerRight: {
    display: "flex",
    width: "auto",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerImage: {
    width: 20,
    height: 20,
    marginLeft: 20,
  },
}));

const Footer = () => {
  const match = useRouteMatch("/");
  const classes = useStyles({ light: match.isExact });

  return (
    <>
      <div
        style={{
          flexGrow: 1,
          backgroundColor: "#ececec",
          marginBottom: "20px",
          marginTop: "20px",
        }}
      ></div>
      <div className={`${classes.wrapper} padding-alignment`}>
        <p className={classes.footerText}>Seminar Room &#169; 2021</p>
        <div className={classes.footerRight}>
          <p className={classes.footerText}>Connect with us on...&thinsp;</p>
          <img
            src={fbImage}
            className={classes.footerImage}
            alt="Facebook logo"
          />
          <img
            src={twitterImage}
            className={classes.footerImage}
            alt="Twitter logo"
          />
        </div>
      </div>
    </>
  );
};

export default Footer;
