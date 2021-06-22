import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CourseCard from "../../Components/CourseCard/courseCard";
import {
  addToSelected,
  getClgCourses,
  getUnivCoursesAndSessions,
  uploadCSV,
} from "../../helpers/Apis/college";
import "./myCourses.css";
import Loading from "../../WidgetsUI/Loading/loading";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import { grey } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    backgroundColor: theme.palette.background.paper,
  },
  header: {
    margin: "80px 0 80px",
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  field: {
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "black",
    },
  },
  menuContain: {
    color: "white",
    padding: "10px",
    backgroundColor: `${theme.palette.common.white} !important`,
    color: theme.palette.common.black + " !important",
    fontSize: 17,
    boxShadow: "0 0 5px #000",
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
  loading: {
    marginTop: 60,
  },
}));

const MyCourses = ({ user: { details, type } }) => {
  const classes = useStyles();
  const dropDownItems = [
    { text: "University Courses", value: "univ" },
    { text: "Selected Courses", value: "selected" },
  ];

  const [courses, setCourses] = useState([]);
  const [clgCourses, setClgCourses] = useState([]);
  const [csvCourses, setcsvCourses] = useState(
    JSON.parse(localStorage.getItem("csvCourses"))
  );
  const [display, setDisplay] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayType, setDisplayType] = useState(dropDownItems[1].value);
  const [coursesData, setCoursesData] = useState([]);

  useEffect(() => {
    setLoading(true);
    if (displayType === "univ") {
      getUnivCoursesAndSessions(details.univId, (courses) => {
        if (!courses) {
          alert("Something went wrong!");
          setLoading(false);
          return;
        }
        setCourses([...courses]);
        setDisplay([...courses]);
        setLoading(false);
      });
    } else {
      getClgCourses(details.id, (selectedCourses, coursesData) => {
        setClgCourses([...selectedCourses]);
        setDisplay([...selectedCourses]);
        setCoursesData([...coursesData]);
        setLoading(false);
      });
    }
  }, [displayType]);

  const setCourseCsvMap = (id) => {
    let newMap = { ...(csvCourses ? csvCourses : {}) };
    const idToString = details.id.toString();
    newMap[idToString] = [
      ...(newMap[idToString] ? newMap[idToString] : []),
      id,
    ];

    localStorage.setItem("csvCourses", JSON.stringify(newMap));
    setcsvCourses({ ...newMap });
  };

  const uploadStudents = (data, id) => {
    uploadCSV(data, id, details.id, (err, newEntries) => {
      if (err) {
        alert("Error in uploading");
        return;
      }
      alert("Students uploaded successfully!");

      setCourseCsvMap(id);
      setCoursesData(
        coursesData.map((data) => {
          if (data.courseId === id)
            return {
              ...data,
              studentCount: data.studentCount + newEntries.length,
            };

          return data;
        })
      );
    });
  };

  const renderDropDown = () => {
    return (
      <TextField
        select
        value={displayType}
        onChange={(event) => setDisplayType(event.target.value)}
        classes={{ root: classes.field }}
        variant="outlined"
        SelectProps={{
          classes: { root: classes.menuContain },
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
        {dropDownItems.map((item, i) => (
          <MenuItem
            value={item.value}
            key={i}
            classes={{
              root: classes.menuItem,
              selected: classes.selectedItem,
            }}
          >
            {item.text}
          </MenuItem>
        ))}
      </TextField>
    );
  };

  const selectCourse = (courseId) => {
    setLoading(true);
    addToSelected([courseId], details.id, (response) => {
      if (response) {
        let newCourses = courses.filter((course) => course.id !== courseId);
        setCourses(newCourses);
        setDisplay([...newCourses]);
        setLoading(false);
      }
    });
  };

  return (
    <div className={`padding-alignment ${classes.wrapper}`}>
      <div className={classes.header}>{renderDropDown()}</div>
      {loading ? (
        <Loading loaderStyles={classes.loading} />
      ) : (
        <div className="my-courses-container">
          {display.length > 0 ? (
            display.map((course) => (
              <div key={course.id}>
                <CourseCard
                  course={course}
                  uploadStudents={uploadStudents}
                  csvCourses={csvCourses}
                  userDetails={details}
                  selected={displayType === "selected"}
                  selectCourse={selectCourse}
                  courseData={coursesData.find(
                    (data) => data.courseId === course.id
                  )}
                  selectedCourses={clgCourses}
                />
              </div>
            ))
          ) : (
            <h5>No Courses to display!</h5>
          )}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyCourses);
