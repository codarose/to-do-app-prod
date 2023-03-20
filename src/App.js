import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import "./mode.css";
import addItemButton from "./images/icon-cross.svg";
import toggleButtonDarkIcon from "./images/icon-sun.svg";
import toggleButtonLightIcon from "./images/icon-moon.svg";
const sampleData = [
  { name: "Complete online Javascript Course", isActive: false },
  { name: "Jog around the park 3x", isActive: true },
  { name: "10 minutes meditation", isActive: true },
  { name: "Read for 1 hour", isActive: true },
  { name: "Pick up groceries", isActive: true },
  { name: "Complete Todo App on Frontend Mentor", isActive: true },
];
const App = () => {
  const dragActivity = useRef();
  const dragOverActivity = useRef();
  const [activityList, setActivityList] = useState(() => {
    const storedActivityList = JSON.parse(localStorage.getItem("todo-list"));
    return storedActivityList || sampleData;
  });
  const [theme, setTheme] = useState("dark");
  const [newActivity, setNewActivity] = useState({
    name: "Create a new todo...",
    isActive: true,
  });
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };
  const [showActivities, setShowActivities] = useState("All");
  // const handleIsCompleted = (index) => {
  //   const currentIndex = completedIndices.indexOf(index);
  //   if (currentIndex === -1) {
  //     setCompletedIndices([...completedIndices, index]);
  //   } else {
  //     setCompletedIndices(completedIndices.filter((i) => i !== index));
  //   }
  // };

  const handleIsComplete = (index) => {
    if (index >= 0 && index < activityList.length) {
      const updatedActivityList = [...activityList];
      const activeState = updatedActivityList[index].isActive;
      updatedActivityList[index].isActive = !activeState;
      setActivityList(updatedActivityList);
    }
  };

  const handleDeleteCompletedActivities = (activityList) => {
    const filteredItems = activityList.filter((item) => item.isActive === true);
    setActivityList(filteredItems);
  };

  const handleAddActivity = () => {
    setNewActivity({ name: "Create a new todo...", isActive: true });
    if (newActivity.name !== "") {
      setActivityList([...activityList, newActivity]);
    } else {
      setActivityList([...activityList, { name: "untitled", isActive: true }]);
    }
  };

  const handleDeleteActivity = (removeIndex) => {
    const activityListCopy = activityList.filter(
      (item, index) => index !== removeIndex
    );
    setActivityList(activityListCopy);
  };

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("todo-list", JSON.stringify(activityList));
  }, [theme, activityList]);

  const dragActivityStart = (e, position) => {
    dragActivity.current = position;

    console.log(e.target.innerHTML);
  };

  const dragActivityEnter = (e, position) => {
    dragOverActivity.current = position;
    console.log(e.target.innerHTML);
  };

  const drop = (e) => {
    const copyListItems = [...activityList];
    const dragActivityContent = copyListItems[dragActivity.current];
    copyListItems.splice(dragActivity.current, 1);
    copyListItems.splice(dragOverActivity.current, 0, dragActivityContent);
    dragActivity.current = null;
    dragOverActivity.current = null;
    setActivityList(copyListItems);
  };

  return (
    <>
      <div className={`${theme}`}>
        <div className={`app-container`}>
          <header className="app-header">
            <h1 className="todo-heading">TODO</h1>
            {theme === "dark" ? (
              <button className="mode-button" onClick={toggleTheme}>
                <img src={toggleButtonDarkIcon} alt="Switch to Light Mode" />
              </button>
            ) : (
              <button className="mode-button" onClick={toggleTheme}>
                <img src={toggleButtonLightIcon} alt="Switch to Dark Mode" />
              </button>
            )}
          </header>
          <main>
            <div className={`new-activity-${theme}`}>
              <div className={`empty-check-${theme}`}>
                <div className={`empty-check-circle-${theme}`}></div>
              </div>
              <input
                defaultValue="create a new todo..."
                value={newActivity.name}
                onChange={(e) =>
                  setNewActivity({ name: e.target.value, isActive: true })
                }
              />
              {{ newActivity } && (
                <div
                  className="add-activity-button"
                  onClick={handleAddActivity}
                >
                  <img src={addItemButton} alt="add new activity" />
                </div>
              )}
            </div>

            <div className={`card-list-${theme}`}>
              {activityList &&
                activityList
                  .filter((item) => {
                    if (showActivities === "Active") {
                      return item.isActive === true;
                    } else if (showActivities === "Completed") {
                      return item.isActive === false;
                    } else {
                      return true;
                    }
                  })
                  .map((item, index) => (
                    <div
                      className={`activity-list-${theme}`}
                      onDragStart={(e) => dragActivityStart(e, index)}
                      onDragEnter={(e) => dragActivityEnter(e, index)}
                      onDragEnd={drop}
                      key={index}
                      draggable
                    >
                      {item.isActive === true ? (
                        <div className="activity-item">
                          <div
                            className="flex"
                            onClick={() => handleIsComplete(index)}
                          >
                            <div
                              className={`empty-check-circle-${theme}`}
                            ></div>

                            <div className={`activity-list-item-${theme}`}>
                              {item.name}
                            </div>
                          </div>
                          <div
                            className="delete-activity"
                            onClick={() => handleDeleteActivity(index)}
                          ></div>
                        </div>
                      ) : (
                        <div className="activity-item">
                          <div
                            className="flex"
                            onClick={() => handleIsComplete(index)}
                          >
                            <div
                              className={`check-circle-complete empty-check-circle-${theme}`}
                            ></div>
                            <div
                              className={`activity-complete-${theme} activity-list-item-${theme}`}
                              // onClick={() => handleIsComplete(index)}
                            >
                              {item.name}
                            </div>
                          </div>
                          <div
                            className="delete-activity"
                            onClick={() => handleDeleteActivity(index)}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
              <div className={`display-small-only card-buttons-${theme}`}>
                <button class="list-all-button-small">
                  {
                    activityList.filter((item) => {
                      if (showActivities === "Active") {
                        return item.isActive === true;
                      } else if (showActivities === "Completed") {
                        return item.isActive === false;
                      } else {
                        return true;
                      }
                    }).length
                  }{" "}
                  items left
                </button>
                <button
                  class="delete-completed-button-small"
                  onClick={() => {
                    handleDeleteCompletedActivities(activityList);
                  }}
                >
                  Clear Completed
                </button>
              </div>
            </div>
            <div className={`card-buttons card-buttons-${theme}`}>
              <button class="list-all-button">
                {
                  activityList.filter((item) => {
                    if (showActivities === "Active") {
                      return item.isActive === true;
                    } else if (showActivities === "Completed") {
                      return item.isActive === false;
                    } else {
                      return true;
                    }
                  }).length
                }{" "}
                items left
              </button>
              <div className="center-crud-buttons">
                <button onClick={() => setShowActivities("All")}>
                  <span
                    className={
                      showActivities === "All" ? "button-selected" : ""
                    }
                  >
                    All
                  </span>
                </button>
                <button onClick={() => setShowActivities("Active")}>
                  <span
                    className={
                      showActivities === "Active" ? "button-selected" : ""
                    }
                  >
                    Active
                  </span>
                </button>
                <button onClick={() => setShowActivities("Completed")}>
                  <div
                    className={
                      showActivities === "Completed" ? "button-selected" : ""
                    }
                  >
                    Completed
                  </div>
                </button>
              </div>
              <button
                class="delete-completed-button"
                onClick={() => {
                  handleDeleteCompletedActivities(activityList);
                }}
              >
                Clear Completed
              </button>
            </div>
            <p className={`${theme}-paragraph`}>
              Drag and drop to reorder list
            </p>
          </main>
        </div>
      </div>
    </>
  );
};

export default App;
