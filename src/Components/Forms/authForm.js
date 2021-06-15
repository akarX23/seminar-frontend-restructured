import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { userTypes } from "../../helpers/utils";
import "./authForm.css";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import { grey } from "@material-ui/core/colors";
import { getAllUnivs, getAllColleges } from "../../helpers/Apis/college";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import BookIcon from "@material-ui/icons/Book";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import { signUp } from "../../helpers/Apis/user";
import { signInAction } from "../../actions/user_actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.common.white,
    padding: "80px 50px",
    width: 650,
    boxShadow: "0 0 20px #000",
  },
  dropdownWrapper: {
    display: "flex",
    alignItems: "center",
  },
  menu: {
    backgroundColor: theme.palette.common.white,
    paddingLeft: "2px",
    paddingRight: "2px",
    boxShadow: "0 0 10px #000",
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
    marginRight: 20,
  },
  inputWrapper: {
    display: "flex",
    flexDirection: "column",
    "& p": {
      fontWeight: 600,
      marginBottom: 5,
      fontSize: 17,
    },
    width: "100%",
  },
  input: {
    "&::placeholder": {
      textOverflow: "ellipsis !important",
      color: grey,
    },
    color: theme.palette.common.black,
    fontSize: 18,
  },
  inputField: {
    border: "none",
  },
  action: {
    backgroundColor: theme.palette.secondary.main,
    "&:hover": {
      backgroundColor: theme.palette.secondary.dark,
    },
    color: theme.palette.getContrastText(theme.palette.secondary.dark),
    float: "right",
    marginTop: 40,
  },
}));

const AuthForm = ({ loginActive, signInAction }) => {
  const classes = useStyles();

  // DATA
  const [univs, setUnivs] = useState([]);
  const [colleges, setColleges] = useState([]);

  //USER INPUT
  const [userType, setUserType] = useState(userTypes.COLLEGE);
  const [user, setUser] = useState({
    email: "",
    password: "",
    univId: -1,
    name: "",
    collegeId: -1,
    phone: "",
    branch: "",
    year: "",
  });

  useEffect(() => {
    if (userType === userTypes.COLLEGE) {
      getAllUnivs((data) => {
        if (data === null) alert("Somehitng went wrong!");
        else {
          setUnivs(data);
        }
      });
    } else if (userType === userTypes.STUDENT) {
      getAllColleges((data) => {
        console.log(data);
        if (data === null) alert("Somehitng went wrong!");
        else {
          setColleges(data);
        }
      });
    }
  }, [userType]);

  const getDropdownItems = (type) => {
    if (type === "user") return ["College", "Student", "Admin"];
    if (type === "associated") {
      if (userType === userTypes.COLLEGE)
        return [{ name: "No University", id: -1 }, ...univs];
      else if (userType === userTypes.STUDENT)
        return [{ name: "No College", id: -1 }, ...colleges];
    }

    return [];
  };

  const handleInputChange = (inputName, value) => {
    setUser({ ...user, [inputName]: value });
  };

  const renderMenu = (items, value, onChange) => {
    return (
      <TextField
        select
        value={value}
        onChange={(event) => onChange(event.target.value)}
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
            value={item.id ? item.id : item.toLowerCase()}
            key={i}
            classes={{
              root: classes.menuItem,
              selected: classes.selectedItem,
            }}
          >
            {item.id ? item.name : item}
          </MenuItem>
        ))}
      </TextField>
    );
  };

  const renderInput = (
    label,
    type,
    inputName,
    placeholder,
    StartIcon,
    EndIcon
  ) => (
    <div className={classes.inputWrapper}>
      <p>{label}</p>
      <TextField
        placeholder={placeholder}
        type={type}
        name={inputName}
        variant="standard"
        value={user[inputName]}
        classes={{ root: classes.inputField }}
        onChange={(event) => handleInputChange(inputName, event.target.value)}
        InputProps={{
          //   disableUnderline: true,
          className: classes.input,
          startAdornment: StartIcon ? (
            <InputAdornment position="start">
              <StartIcon size="small" />
            </InputAdornment>
          ) : null,
          endAdornment: EndIcon ? (
            <InputAdornment position="end">
              <IconButton>
                <EndIcon size="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
    </div>
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    user.univId = user.univId === -1 ? null : user.univId;
    user.collegeId = user.collegeId === -1 ? null : user.collegeId;

    if (!loginActive) {
      signUp(userType, user, (err) => {
        if (!err) alert("Verify Email!");
        else alert("Something went wrong!");
      });
    } else {
      signInAction(userType, user);
    }
  };

  return (
    <form className={classes.container} onSubmit={handleSubmit}>
      <div className={classes.dropdownWrapper}>
        {renderMenu(getDropdownItems("user"), userType, setUserType)}
        {!loginActive &&
          userType === userTypes.COLLEGE &&
          renderMenu(getDropdownItems("associated"), user.univId, (value) =>
            handleInputChange("univId", value)
          )}
        {!loginActive &&
          userType === userTypes.STUDENT &&
          renderMenu(getDropdownItems("associated"), user.collegeId, (value) =>
            handleInputChange("collegeId", value)
          )}
      </div>
      <div className="fields-wrapper">
        {!loginActive &&
          renderInput("Full Name", "text", "name", "Name", PersonIcon)}
        {renderInput(
          "Email ID",
          "email",
          "email",
          "someone@some.com",
          AlternateEmailIcon
        )}

        {!loginActive &&
          renderInput("Phone Number", "text", "phone", "1234567890", PhoneIcon)}
        {renderInput(
          "Password",
          "password",
          "password",
          "vrgt123",
          VpnKeyIcon,
          VisibilityOffIcon
        )}
        {userType === userTypes.STUDENT &&
          !loginActive &&
          renderInput("Course", "text", "branch", "Mechanical", BookIcon)}
        {userType === userTypes.STUDENT &&
          !loginActive &&
          renderInput("Year", "text", "year", "1", AccessTimeIcon)}
      </div>
      <Button variant="contained" type="submit" className={classes.action}>
        {loginActive ? "Sign In" : "Sign Up"}
      </Button>
    </form>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({ signInAction }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthForm);
