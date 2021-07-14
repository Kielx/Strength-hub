import { React } from "react";
import OneRepForm from "../../components/oneRepForm/oneRepForm";

const Workouts = () => {
  return <OneRepForm></OneRepForm>;

  /*   const [oneRepMax, setOneRepMax] = useState(
    JSON.parse(localStorage.getItem("oneRepMax")) || {
      Squat: 0,
      Deadlift: 0,
      "Bench Press": 0,
      "Overhead Press": 0,
      "Current Week": 1,
    }
  );

  const [currentWeek, setCurrentWeek] = useState(
    localStorage.getItem("currentWeek") || 1
  );

  useEffect(() => {
    localStorage.setItem("oneRepMax", JSON.stringify(oneRepMax));
  }, [oneRepMax]);

  const handleChange = (event) => {
    setOneRepMax((prevState) => ({
      ...prevState,
      [event.target.name]: [event.target.value],
    }));
  };

  const createInputsList = (oneRepMax) => {
    const inputList = [];
    for (const lift in oneRepMax) {
      inputList.push(
        <OneRepMaxInput
          key={lift}
          handleChange={handleChange}
          name={lift}
          oneRepMax={oneRepMax[lift]}
        />
      );
    }
    return inputList;
  };

  const createWeightProgressionList = (oneRepMaxObj, numberOfWeeks) => {
    const weightProgressionList = [];
    for (const lift in oneRepMaxObj) {
      weightProgressionList.push(
        <div
          key={lift}
          style={{
            width: "70%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2>{lift}</h2>
          <MapLift
            lift={lift}
            oneRepMax={oneRepMaxObj[lift]}
            numberOfWeeks={numberOfWeeks}
            currentWeek={currentWeek}
            setCurrentWeek={setCurrentWeek}
          />
        </div>
      );
    }
    return weightProgressionList;
  };

  const logAuth = async (auth) => {
    console.log(auth);
    const user = await Auth.currentAuthenticatedUser();
    console.log(user.username);
    console.log(user.attributes.sub);
  };

  //get api call to get weight progression
  const getOneRepMax = async (auth) => {
    const user = await Auth.currentAuthenticatedUser();
    try {
      const oneRepMax = await API.get(
        "strengthworkouts",
        "/api/strengthworkouts/",
        {
          queryStringParameters: {
            id: `${user.attributes.sub}`,
            name: `${auth.user.username}`,
          },
        }
      );
      console.log(oneRepMax);
      return oneRepMax;
    } catch (error) {
      console.log(error);
    }
  };

  //post api call to update weight progression
  const updateOneRepMax = async (auth, oneRepMax) => {
    const user = await Auth.currentAuthenticatedUser();
    const updatedOneRepMax = await API.post(
      "strengthworkouts",
      "/api/strengthworkouts",
      {
        body: {
          id: `${user.attributes.sub}`,
          name: `${user.username}`,
          oneRepMax,
          currentWeek: currentWeek,
        },
      }
    );
    console.log(updatedOneRepMax);
    return updatedOneRepMax;
  };

  //delete oneRepMax
  const deleteOneRepMax = async (auth) => {
    const user = await Auth.currentAuthenticatedUser();
    const deletedOneRepMax = await API.del(
      "strengthworkouts",
      "/api/strengthworkouts",
      {
        body: {
          id: `${user.attributes.sub}`,
          name: `${user.username}`,
          oneRepMax,
        },
      }
    );
    console.log(deletedOneRepMax);
    return deletedOneRepMax;
  };

  return (
    <div>
      <button onClick={() => logAuth(Auth)}> Log in with Auth0</button>
      <button onClick={() => getOneRepMax(Auth)}> GetoneRepMax</button>
      <button onClick={() => updateOneRepMax(Auth, 140)}>
        UpdateOneRepMax
      </button>
      <button onClick={() => deleteOneRepMax(Auth)}>Delete one rep max</button>

      {createInputsList(oneRepMax)}
      <div
        style={{
          display: "flex",
        }}
      >
        {createWeightProgressionList(oneRepMax, 6)}
      </div>
    </div>
  ); */
};

export default Workouts;
