import React, { useRef } from "react";
import img1 from "../..//assets/images/img1.png";
import Button from "@material-ui/core/Button";
import { CSVReader } from "react-papaparse";
import "./courseCard.css";
import { makeStyles } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  action: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white + " !important",
    "&:hover": {
      backgroundColor: theme.palette.secondary.dark,
    },
    padding: "6px 10px 6px",
    marginTop: 10,
  },
  disabled: {
    backgroundColor: grey[700],
    color: theme.palette.common.black,
  },
}));

const CourseCard = ({
  userDetails,
  course,
  csvCourses,
  uploadStudents,
  selected,
  selectCourse,
  courseData,
  selectedCourses,
}) => {
  const { id, name, thumbnail_img } = course;

  const classes = useStyles();
  const buttonRef = useRef();

  const handleOpenDialog = (e) => {
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  const getUploadText = () => {
    if (!csvCourses) return "Upload Students";
    return csvCourses[userDetails?.id?.toString()]?.includes(id)
      ? "Reupload Students"
      : "Upload Students";
  };

  const isSelected = () => {
    if (selectedCourses.find((course) => course.id === id)) return true;
    return false;
  };

  return (
    <div className="card">
      <img src={img1} className="card-img-top" alt={name + id + " image"} />
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <p>Students Uploaded : {courseData.studentCount}</p>
        <p>Sessions Subscribed : {courseData.sessionCount}</p>
        {selected ? (
          <CSVReader
            ref={buttonRef}
            onFileLoad={(data) => {
              data = data.map((data) => data.data);
              uploadStudents(data, id);
            }}
            config={{
              header: true,
              dynamicTyping: true,
              skipEmptyLines: true,
            }}
          >
            {({ file }) => (
              <Button onClick={handleOpenDialog} className={classes.action}>
                {getUploadText()}
              </Button>
            )}
          </CSVReader>
        ) : (
          <Button
            onClick={() => selectCourse(id)}
            classes={{ root: classes.action, disabled: classes.disabled }}
            disabled={isSelected()}
          >
            {isSelected() ? "Already Added" : "ADD to Courses"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
