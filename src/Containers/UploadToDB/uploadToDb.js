import React from "react";
import CSVReader from "react-csv-reader";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:4000" });

const UploadToDb = () => {
  //Uploading and getting the university ids

  const getUnivIds = async (univs) => {
    const upsertUniv = (univ) => {
      return new Promise((resolve, reject) => {
        api
          .get(`/univ/get_one?name=${univ}`)
          .then(async (result) => {
            // console.log(result.data);
            if (result.data) {
              resolve(result.data.id);
            } else {
              api
                .post(`/admin/create_univ`, { name: univ })
                .then((result) => {
                  resolve(result.data.id);
                })
                .catch((error) => {
                  console.log(error);
                  alert("Couldn't upload university with the name " + univ);
                  reject(error);
                });
            }
          })
          .catch((error) => {
            console.log(error);
            alert("Couldn't upload university with the name " + univ);
            reject(error);
          });
      });
    };

    let ids = [];
    for (let univ of univs) {
      const univId = await upsertUniv(univ);
      ids.push(univId);
    }

    return ids;
  };

  const getCourseId = async (course) => {
    return await new Promise((resolve, reject) => {
      api
        .get(`/course/get_one?name=${course}`)
        .then((result) => {
          if (result.data) {
            resolve(result.data.id);
          } else {
            api
              .post(`/admin/create_course`, { name: course })
              .then((result) => resolve(result.data.id));
          }
        })
        .catch((error) => reject(error));
    });
  };

  const mapCourseWithUniv = async (course, univId) => {
    return getCourseId(course).then(async (courseId) => {
      console.log(courseId);
      return await new Promise(async (resolve, reject) => {
        await api
          .get(`/admin/map_course_univ?courseId=${courseId}&univId=${univId}`)
          .then((result) => resolve(result.data))
          .catch((err) => reject(err));
      });
    });
  };

  const createUnivMapCourse = async (data) => {
    let univIds = await getUnivIds(data[0]);
    data = data.slice(1, data.length);

    for (let courses of data) {
      for (let [univIndex, course] of courses.entries()) {
        let unicos = await mapCourseWithUniv(course, univIds[univIndex]);
        // console.log(unicos);
      }
    }
    alert("Done");
  };

  const createSessions = async (data) => {
    const formatSessionData = (session) => {
      let formatted = {};
      let desc = [];

      for (let [key, value] of Object.entries(session)) {
        if (key.includes("desc")) {
          desc.push(value);
        } else formatted[key] = value;
      }
      formatted.desc = desc;
      return formatted;
    };

    for (const session of data) {
      let formattedSession = formatSessionData(session);
      await api
        .post(`/admin/create_session`, formattedSession)
        .then((result) => {
          console.log(result.data);
        });
    }
    alert("Done");
  };

  const mapSessionAndCourse = async (data) => {
    const univIds = await getUnivIds(data[0]);
    const courseIds = [];
    for (let course of data[1]) {
      let id = await getCourseId(course);
      courseIds.push(id);
    }
    data = data.splice(2, data.length);

    for (const sessionList of data) {
      for (const [i, session] of sessionList.entries()) {
        if (!session) return;
        const encodedURI = encodeURIComponent(session);

        const sessionId = await api
          .get(`/session/get_one?topic=${encodedURI}`)
          .then((result) => {
            return result.data?.id;
          });

        if (!sessionId) continue;
        await api
          .put(
            `/admin/map_session_course?courseId=${courseIds[i]}&univId=${univIds[i]}`,
            { sesId: sessionId }
          )
          .then((result) => {
            console.log(result.data);
          });
      }
    }
    alert("Done");
  };

  return (
    <div>
      <p>Upload universities and courses map</p>
      <CSVReader
        onFileLoaded={createUnivMapCourse}
        parserOptions={{
          dynamicTyping: true,
          skipEmptyLines: true,
        }}
      />
      <p>List of sessions</p>
      <CSVReader
        onFileLoaded={createSessions}
        parserOptions={{
          dynamicTyping: true,
          skipEmptyLines: true,
          header: true,
          transformHeader: (header) => {
            header = header.toLowerCase();
            if (header.includes("key")) {
              header = "desc" + header.charAt(header.length - 1);
            }
            return header;
          },
        }}
      />
      <p>Upload course and session mapping</p>
      <CSVReader
        onFileLoaded={mapSessionAndCourse}
        parserOptions={{
          dynamicTyping: true,
          skipEmptyLines: true,
        }}
      />
    </div>
  );
};

export default UploadToDb;
