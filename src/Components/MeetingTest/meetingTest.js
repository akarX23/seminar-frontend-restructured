import React, { useState } from "react";
import Jitsi from "react-jitsi";
import "./meetingTest.css";

const MeetingTest = () => {
  const [dataReceived, setDataReceived] = useState(false);
  const [participants, setParticipants] = useState("");

  let roomName = "TestSeminarRooms";
  let roomPass = "1223344";

  let MeetApis = [];
  let userIds = [];

  function makeid() {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 5; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const startMeeting = (event) => {
    event.preventDefault();
    if (parseInt(participants) >= 1) {
      setDataReceived(true);
    }
  };

  const handleAPI = (JitsiMeetAPI) => {
    JitsiMeetAPI.on("passwordRequired", () => {
      JitsiMeetAPI.executeCommand("password", roomPass);
    });

    JitsiMeetAPI.addEventListener("participantJoined", (response) => {
      console.log(response);
      userIds.push(response.id);
    });

    JitsiMeetAPI.addEventListener("participantLeft", (response) => {
      console.log(response);
      let newParticipants = userIds.filter((id) => id !== response.id);
      userIds = [...newParticipants];
    });

    JitsiMeetAPI.addEventListener("passwordRequired", () => {});
  };

  const joinMeeting = (key) => {
    let userId = makeid();
    MeetApis.push(handleAPI);

    if (userIds.length === 0) console.log("Moderator");

    return (
      <Jitsi
        roomName={roomName}
        displayName={userId}
        config={{
          startWithAudioMuted: true,
          startWithVideoMuted: true,
        }}
        interfaceConfig={{ filmStripOnly: true }}
        password={roomPass}
        userInfo={{ displayName: userId }}
        onAPILoad={MeetApis[MeetApis.length - 1]}
        domain={process.env.REACT_APP_JITSI_SERVER}
        key={key}
        containerStyle={{ width: "100%", height: "100%" }}
      />
    );
  };

  const initiateTest = () => {
    let usersArray = [];
    let size = participants;
    while (size--) usersArray.push(1);

    return usersArray.map((_, i) => joinMeeting(i));
  };

  if (!dataReceived)
    return (
      <form onSubmit={startMeeting}>
        <p>Enter number of participants :</p>
        <input
          value={participants}
          onChange={(event) => setParticipants(event.target.value)}
        />
        <button onSubmit={startMeeting}>Start Meet</button>
      </form>
    );
  else return <div className="test-container">{initiateTest()}</div>;
};

export default MeetingTest;
