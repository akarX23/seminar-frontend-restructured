import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import "./sessionDetails.css";
import { makeStyles } from "@material-ui/core";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { grey } from "@material-ui/core/colors";
import ScheduleIcon from "@material-ui/icons/Schedule";
import EuroIcon from "@material-ui/icons/Euro";
import { useParams } from "react-router-dom";
import { getSessionData } from "../../helpers/Apis/sessions";

// Test images
import test1 from "../../assets/images/test1.png";
import test2 from "../../assets/images/test2.png";
import test3 from "../../assets/images/test3.png";
import test4 from "../../assets/images/test4.png";
import Loading from "../../WidgetsUI/Loading/loading";

const images = [test1, test2, test3, test4, test1, test2, test3, test4];

const useStyles = makeStyles((theme) => ({
  topic: {
    ...theme.typography.h2,
    margin: "50px 0 30px",
  },
  details: {
    marginLeft: 30,
    flex: 1,
    "& h2": {
      margin: 0,
      fontSize: 24,
      color: grey[800],
      marginBottom: 20,
    },
    wordWrap: "break-word",
    minWidth: 400,
  },
  schedule_info: {
    ...theme.typography.body2,
    fontSize: 20,
    marginLeft: 30,
  },
  price_info: {
    ...theme.typography.body2,
    fontSize: 20,
    marginLeft: 30,
  },
  subject: {
    ...theme.typography.body1,
    fontSize: 20,
  },
  speaker: {
    ...theme.typography.body1,
    fontSize: 20,
  },
}));

const SessionDetails = ({ user: { details, type } }) => {
  const classes = useStyles();

  const [sessionDetails, setsessionDetails] = useState({
    id: "",
    desc: "",
    start_time: "",
    schedule_info: "",
    price: "",
    topic: "",
    speaker: "",
    subject: "",
    price_info: "",
  });

  const [loading, setLoading] = useState(true);

  const { sesId } = useParams();

  useEffect(() => {
    getSessionData(sesId, (session) => {
      setsessionDetails({ ...session });
      setLoading(false);
    });
  }, []);

  const combineDescription = () => {
    let descString = "";
    if (desc.some((item) => item !== null)) {
      desc.forEach((item) => {
        if (item) descString = descString + item + " ";
      });
    }

    return descString;
  };

  if (loading) return <Loading fullPage />;

  const {
    id,
    desc,
    start_time,
    schedule_info,
    price,
    topic,
    speaker,
    subject,
    price_info,
  } = sessionDetails;

  return (
    <div className="padding-alignment">
      <h2 className={classes.topic}>
        {topic ? topic : "The session topic goes here bro"}
      </h2>
      <div className="details-container">
        <Carousel
          dynamicHeight={true}
          infiniteLoop={true}
          autoPlay={true}
          interval={3000}
          swipeable={true}
          showStatus={false}
          emulateTouch={true}
          className="carousel"
        >
          {images.map((image, i) => (
            <div key={i}>
              <img src={image} />
            </div>
          ))}
        </Carousel>
        <div className={classes.details}>
          <h2>
            {desc
              ? combineDescription()
              : "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content."}
          </h2>
          <p className={classes.subject}>
            {subject ? subject : "Advanced Fluid Dynamics"}
          </p>
          <p className={classes.speaker}>
            {speaker ? speaker : "Dr. Ramanujan Mahajan"}
          </p>
          <div className="schedule">
            <div className="date">
              <ScheduleIcon />
              <p>{start_time ? start_time : "21/7/2021"}</p>
            </div>
            <p className={classes.schedule_info}>
              {schedule_info ? schedule_info : "Please join on time!"}
            </p>
          </div>
          <div className="price-container">
            <div className="price">
              <EuroIcon />
              <p>{price ? price : "Free"}</p>
            </div>
            <p className={classes.price_info}>
              {price_info ? price_info : "(Incl. of GST)"}
            </p>
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SessionDetails);
