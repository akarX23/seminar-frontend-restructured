import React from "react";

import Button from "@material-ui/core/Button";

import "./planCard.css";
import { getFormattedPrice } from "../../helpers/utils";
import { makeStyles } from "@material-ui/core";
import { green, grey } from "@material-ui/core/colors";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

const useStyles = makeStyles((theme) => ({
  selected: {
    backgroundColor: theme.palette.success.main + " !important",
    cursor: "default",
  },
  heading: {
    backgroundColor: theme.palette.primary.main,
    paddingBottom: 20,
    color: "white ",
    "& > h4": {
      fontSize: 28,
      marginBottom: 0,
    },
    "& > p": {
      marginTop: 0,
    },
  },
  price: {
    fontSize: 28,
  },
  info: {
    fontSize: 17,
    color: grey[800],
    marginTop: 10,
    marginBottom: 10,
  },
  features: {
    fontSize: 16,
    display: "flex",
    flexDirection: "column",
    "& > div > p": {
      margin: "0 0 0 15px",
    },
    "& > div": {
      display: "flex",
      alignItems: "center",
      marginTop: 15,
    },
  },
  icon: {
    color: green[400],
  },
}));

const PlanCard = ({
  planName,
  price,
  students,
  faculties,
  features,
  selectPlan,
  id,
  subPlan,
  tagline,
}) => {
  const classes = useStyles();
  const isSelected = subPlan === id;

  return (
    <div className="plan-card-container">
      <div className={`${classes.heading} `}>
        <h4>{planName}</h4>
        <p>{tagline}</p>
        <div>
          <p>
            <b className={classes.price}>{getFormattedPrice(price)}</b> /Per
            Session
          </p>
        </div>
      </div>
      <div className={classes.info}>
        <p>
          <b>{students} students</b> Allowed Per Session
        </p>
        <p>
          <b>{faculties} faculties</b> Allowed Per Session
        </p>
      </div>
      <div className="border" />
      <div className={classes.features}>
        {features.map((feature, i) => (
          <div key={i}>
            <CheckCircleIcon fontSize="small" className={classes.icon} />
            <p>{feature}</p>
          </div>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      <div className="btn-container">
        <Button
          variant="contained"
          color="secondary"
          onClick={(event) => !isSelected && selectPlan(id)}
          className={isSelected ? classes.selected : ""}
        >
          {isSelected ? "Selected" : "Choose Plan"}
        </Button>
      </div>
    </div>
  );
};

export default PlanCard;
