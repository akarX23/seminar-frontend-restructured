import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CourseCard from "../../Components/CourseCard/courseCard";
import {
  getUnivCoursesAndSessions,
  uploadCSV,
} from "../../helpers/Apis/college";
import "./myCourses.css";
import Loading from "../../WidgetsUI/Loading/loading";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    backgroundColor: theme.palette.background.paper,
  },
  heading: {
    fontSize: 40,
    margin: "80px 0 80px",
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

const MyCourses = ({ user: { details, type } }) => {
  const classes = useStyles();
  const [courses, setCourses] = useState([]);
  const [csvCourses, setcsvCourses] = useState(
    JSON.parse(localStorage.getItem("csvCourses"))
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUnivCoursesAndSessions(details.univId, (courses, _) => {
      if (!courses) {
        alert("Something went wrong!");
        setLoading(false);
        return;
      }
      setCourses([...courses]);
      setLoading(false);
    });
  }, []);

  const setCourseCsvMap = (id) => {
    let newMap = { ...(csvCourses ? csvCourses : {}) };
    const idToString = details.id.toString();
    newMap[idToString] = [
      ...(newMap[idToString] ? newMap[idToString] : []),
      id,
    ];

    console.log(newMap);

    localStorage.setItem("csvCourses", JSON.stringify(newMap));
    setcsvCourses({ ...newMap });
  };

  const uploadStudents = (data, id) => {
    setCourseCsvMap(id);
    uploadCSV(data, id, details.id, (err) => {
      if (!err) {
        alert("Students uploaded successfully!");
      }
    });
  };

  if (loading) return <Loading fullPage />;

  return (
    <div className={`padding-alignment ${classes.wrapper}`}>
      <h1 className={classes.heading}>
        You have the following courses from your university
      </h1>
      <div className="my-courses-container">
        {courses.map((course) => (
          <div key={course.id}>
            <CourseCard
              course={course}
              uploadStudents={uploadStudents}
              csvCourses={csvCourses}
              userDetails={details}
            />
          </div>
        ))}
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
  ...bindActionCreators({}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyCourses);
