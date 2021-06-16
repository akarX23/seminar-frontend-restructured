import React, { useRef } from "react";
import img1 from "../..//assets/images/img1.png";
import Button from "@material-ui/core/Button";
import { CSVReader } from "react-papaparse";
import "./courseCard.css";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  upload: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white + " !important",
    "&:hover": {
      backgroundColor: theme.palette.secondary.dark,
    },
    padding: "6px 10px 6px",
    marginTop: 10,
  },
}));

const CourseCard = ({ userDetails, course, csvCourses, uploadStudents }) => {
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

  return (
    <div className="card">
      <img src={img1} className="card-img-top" alt={name + id + " image"} />
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
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
            <Button onClick={handleOpenDialog} className={classes.upload}>
              {getUploadText()}
            </Button>
          )}
        </CSVReader>
      </div>
    </div>
  );
};

export default CourseCard;
