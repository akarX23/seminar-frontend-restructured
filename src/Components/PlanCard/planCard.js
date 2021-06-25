import React from "react";

import Button from "@material-ui/core/Button";

import "./planCard.css";
import { getFormattedPrice } from "../../helpers/utils";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  selected: {
    backgroundColor: theme.palette.success.main + " !important",
    cursor: "default",
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
}) => {
  const classes = useStyles();
  const isSelected = subPlan === id;

  return (
    <div className="plan-card-container">
      <h4>{planName}</h4>
      <p>{getFormattedPrice(price)} per session</p>
      <p>Students allowed per session : {students}</p>
      <p>Faculties allowed per session : {faculties}</p>
      <div className="border"></div>
      {features.map((feature, i) => (
        <p key={i}>{feature}</p>
      ))}
      <Button
        variant="contained"
        color="secondary"
        onClick={(event) => !isSelected && selectPlan(id)}
        className={isSelected ? classes.selected : ""}
      >
        {isSelected ? "Selected" : "Select plan"}
      </Button>
    </div>
  );
};

export default PlanCard;
