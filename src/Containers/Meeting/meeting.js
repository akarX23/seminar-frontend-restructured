import React, { Component } from "react";
import Jitsi from "react-jitsi";
import axios from "axios";
import { verify } from "jsonwebtoken";

export default class Meeting extends Component {
  state = {
    authorised: false,
    roomName: "",
    roomPass: "",
    userId: "",
    type: "",
    participantList: [],
  };

  async componentDidMount() {
    await axios
      .get(
        `${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_PORT}/meeting/join?token=${this.props.match.params.token}`
      )
      .then((response) => {
        console.log(response.data);

        if (response.data.allow) {
          verify(
            this.props.match.params.token,
            "culture_place_admin_453864",
            (err, decode) => {
              console.log(decode);
              console.log(err);

              if (!err) {
                return this.setState({
                  authorised: true,
                  roomName: decode.roomName,
                  roomPass: decode.roomPass,
                  userId: decode.userId,
                  type: decode.type,
                });
              }
            }
          );
        }
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
      });
  }

  handleAPI = (JitsiMeetAPI) => {
    console.log(JitsiMeetAPI);
    JitsiMeetAPI.on("passwordRequired", () => {
      JitsiMeetAPI.executeCommand("password", this.state.roomPass);
    });

    JitsiMeetAPI.addEventListener("participantJoined", (response) => {
      console.log(response);
      this.setState({
        participantList: [...this.state.participantList, response.id],
      });
    });

    JitsiMeetAPI.addEventListener("participantLeft", (response) => {
      console.log(response);
      let newParticipants = this.state.participantList.filter(
        (id) => id !== response.id
      );
      this.setState({
        participantList: [...newParticipants],
      });
    });

    JitsiMeetAPI.addEventListener("passwordRequired", (response) => {
      console.log(response);
    });
  };

  render() {
    console.log(this.state);
    if (this.state.authorised)
      return (
        <Jitsi
          roomName={this.state.roomName}
          displayName={this.state.userId}
          config={{
            startWithAudioMuted: true,
            startWithVideoMuted: true,
          }}
          interfaceConfig={{ filmStripOnly: true }}
          password={this.state.roomPass}
          userInfo={{ displayName: this.state.userId, role: this.state.type }}
          onAPILoad={this.handleAPI}
        />
      );

    return <h4>Your meeting is loading!!</h4>;
  }
}
