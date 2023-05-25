import React from "react";
import "./slideBar.css";

const SlideBar = ({ isSignup, changeSignup }) => {

  return (
    <div className="top_slidebar">
      <div
        onClick={() => changeSignup(false)}
        className="top_slidebar_content"
        style={{
          background: !isSignup ? "black" : "white",
          color: !isSignup ? "white" : "black",
        }}
      >
        Log In
      </div>{" "}
      <div
        onClick={() => changeSignup(true)}
        className="top_slidebar_content"
        style={{
          background: isSignup ? "black" : "white",
          color: isSignup ? "white" : "black",
        }}
      >
        Sign Up
      </div>
    </div>
  );
};
export default SlideBar;
