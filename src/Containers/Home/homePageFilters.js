import { makeStyles } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import { grey } from "@material-ui/core/colors";
import MenuItem from "@material-ui/core/MenuItem";
import { userTypes } from "../../helpers/utils";

const useStyles = makeStyles((theme) => ({
  label: {
    ...theme.typography.body1,
    color: theme.palette.common.black,
    margin: 0,
    marginBottom: 10,
    fontSize: 18,
  },
  wrapper: {
    display: "flex",
    alignItems: "center",
  },
  menu: {
    backgroundColor: theme.palette.common.white,
    paddingLeft: "2px",
    paddingRight: "2px",
    boxShadow: "0 0 4px 2px #000",
    marginTop: 5,
  },
  menuItem: {
    color: theme.palette.common.black,
    borderRadius: "5px",
    "&:hover": {
      backgroundColor: grey[300],
    },
    padding: "5px 7px 5px",
  },
  selectedItem: {
    backgroundColor: `${theme.palette.primary.light} !important`,
    color: "white",
  },
  menuContain: {
    color: "white",
    padding: "10px",
    backgroundColor: `${theme.palette.common.white} !important`,
    color: theme.palette.common.black + " !important",
    fontSize: 17,
    boxShadow: "0 0 5px #000",
  },
  field: {
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "black",
    },
  },
}));

const Filters = ({ type, courses, changeSessionDisplay, details }) => {
  const classes = useStyles();

  const [listType, setListType] = useState("all");
  const [courseType, setCourseType] = useState("all");

  useEffect(() => {
    setListType("all");
    setCourseType("all");

    changeSessionDisplay("session", "all");
    if (type === userTypes.COLLEGE) changeSessionDisplay("course", "all");
  }, [details]);

  const updateList = (newValue, dropdownType) => {
    console.log(newValue);

    if (dropdownType === "session") {
      setListType(newValue);
      changeSessionDisplay(dropdownType, newValue);
    }

    if (dropdownType === "course") {
      setCourseType(newValue);
      const courseId = courses.find(
        (course) => course.name.toLowerCase() === newValue
      )?.id;
      changeSessionDisplay(dropdownType, null, courseId);
    }
  };

  const getFilter = (items, dropdownType) => {
    return (
      <TextField
        select
        value={dropdownType === "session" ? listType : courseType}
        onChange={(event) => updateList(event.target.value, dropdownType)}
        classes={{ root: classes.field }}
        variant="outlined"
        SelectProps={{
          classes: {
            root: classes.menuContain,
          },
          MenuProps: {
            classes: {
              paper: classes.menu,
            },
            disableScrollLock: true,
            disablePortal: true,
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            getContentAnchorEl: null,
          },
        }}
      >
        {items.map((item, i) => (
          <MenuItem
            value={item.split(" ")[0].toLowerCase()}
            key={i}
            classes={{
              root: classes.menuItem,
              selected: classes.selectedItem,
            }}
          >
            {item}
          </MenuItem>
        ))}
      </TextField>
    );
  };

  const getDropdownItems = (dropdownType) => {
    const studentAllowedFilter = [
      "All Sessions",
      "College Sponsored",
      "Paid sessions",
      "Free sessions",
    ];

    const general = ["All Sessions", "Paid sessions", "Free sessions"];
    const collegeCourseFilter = [
      "All Courses",
      ...courses.map((course) => course.name),
    ];

    if (type === userTypes.STUDENT) return studentAllowedFilter;
    if (type === userTypes.COLLEGE && dropdownType === "course") {
      return collegeCourseFilter;
    }

    return general;
  };

  return (
    <div className={`${classes.wrapper}`}>
      <div className={`filter-container`}>
        <p className={classes.label}>Filter By Type</p>
        {getFilter(getDropdownItems("session"), "session")}
      </div>
      {type === userTypes.COLLEGE && (
        <div className={`filter-container`}>
          <p className={classes.label}>Filter By Course</p>
          {getFilter(getDropdownItems("course"), "course")}
        </div>
      )}
    </div>
  );
};

export default Filters;
