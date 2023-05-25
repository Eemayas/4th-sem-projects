import React, { useState, useRef, useEffect } from "react";
import "./columnToDoBox.css";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import PopUpToDo from "../popUp/toDoPopUp";
import Popup from "reactjs-popup";
import { useLocation } from "react-router-dom";
import { apiAddress } from "../API/api";
import { GetToken } from "../../GlobalVariable";

const ColumnProgessBox = ({
  forcedUpdate,
  selfID,
  title,
  membersList,
  contentInfo,
  changeContentInfo,
  onAddPressed,
  isHead,
}) => {
  const [toWhere, changeToWhere] = useState("");
  const [Projectid, setId] = useState(null);
  const [assignedtoID, setAssignedtoID] = useState(null);
  const onClickChange = (id, toWhere) => {
    const updatedContentInfo = contentInfo.map((element) =>
      element.id === id ? { ...element, title: toWhere } : element
    );
    changeContentInfo(updatedContentInfo);
  };
  const location = useLocation();

  useEffect(() => {
    setAssignedtoID();
    const searchParams = new URLSearchParams(location.search);
    const Id = searchParams.get("id");
    setId(Id);
    // console.log(contentInfo);
  });
  const onClicked = () => {};
  return (
    <div className="columnProgessBox">
    
      <Title
        forcedUpdate={forcedUpdate}
        membersList={membersList}
        isHead={isHead}
        title={title}
        contentInfo={contentInfo}
        changeContentInfo={changeContentInfo}
      />
      {contentInfo.map((content) =>
        content.tag === title ? (
          <Content
            forcedUpdate={forcedUpdate}
            assignedtoName={content.assignedtoName}
            selfID={selfID}
            assignedtoID={content.assignedto}
            isHead={isHead}
            key={content._id}
            taskID={content._id}
            {...content}
            changeToWhere={changeToWhere}
            onClick={() => {
              onClickChange(content.id, toWhere);
            }}
          />
        ) : (
          ""
        )
      )}
    </div>
  );
};

const Title = ({
  forcedUpdate,
  title,
  contentInfo,
  changeContentInfo,
  isHead,
  membersList,
}) => {
  const [open, setOpen] = useState(false);

  const closeModal = () => setOpen(false);

  const location = useLocation();
  const [id, setId] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");
    setId(id);
  }, [location.search]);
  return (
    <div>
      {/* {console.log(contentInfo)} */}
      <div className="title">
        <h5>{title}</h5>
        {isHead ? (
          <AddIcon onClick={() => setOpen((o) => !o)} className="addIcon" />
        ) : (
          ""
        )}
        <Popup open={open} closeOnDocumentClick onClose={closeModal}>
          <PopUpToDo
            forcedUpdate={forcedUpdate}
            membersList={membersList}
            id={id}
            contentInfo={contentInfo}
            changeContentInfo={changeContentInfo}
            onClose={closeModal}
          />
        </Popup>
      </div>
    </div>
  );
};

const Content = ({
  forcedUpdate,
  selfID,
  taskID,
  assignedtoName,
  assignedtoID,
  label,
  title,
  detail,
  deadline,
  onClick,
  onDoubleClick,
  changeToWhere,
  isHead,
}) => {
  // eslint-disable-next-line
  const [isSelf, changeIsSelf] = useState(false);
  const [open, setOpen] = useState(false);
  const [Projectid, setId] = useState(null);
  let menuRef = useRef();

  useEffect(() => {
    var check = selfID === assignedtoID;
    changeIsSelf(check);
    if (isHead) {
      let handler = (e) => {
        if (!menuRef.current.contains(e.target)) {
          setOpen(false);
        }
        document.addEventListener("mousedown", handler);
      };
      return () => {
        document.removeEventListener("mousedown", handler);
      };
    }

    // changeIsSelf(true)

    const searchParams = new URLSearchParams(location.search);
    const Id = searchParams.get("id");
    setId(Id);
  });

  const [title1, migrateWhere] = useState("");
  const location = useLocation();

  const onClick1 = async () => {
    const token = GetToken(),
      data = { tag: title1 };

    console.log(data);
    try {
      const searchParams = new URLSearchParams(location.search);
      const Id = searchParams.get("id");
      const response = await fetch(`${apiAddress}todo/update/${Id}/${taskID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log(result);
      console.log(response.status);
      if (response.status === 200) {
        console.log("sdcsdcdc");
        forcedUpdate()
      } else {
        console.log(result.error);
        // setErrorMsg(result.error);
        // setOpenError((o) => !o);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div
      //self may be needed to change
      style={{ backgroundColor: `${!isSelf ? "white" : "#ccc"}` }}
      className="content"
      onDrag={onDoubleClick}
    >
      {/* {console.log(isSelf)}
      {console.log(selfID,assignedtoID)} */}
      <div className="date_DropDown">
        <div className="label">{label}</div>

        {isSelf || isHead ? (
          <div className="menu-container" ref={menuRef}>
            <div
              className="menu-trigger"
              onClick={() => {
                setOpen(!open);
              }}
            >
              {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </div>
            <div className={`dropdown-menu ${open ? "active" : "inactive"}`}>
              <ul>
                <DropdownItem
                  changeToWhere={migrateWhere}
                  // {changeToWhere}
                  onClick={onClick1}
                  text={"BackLog"}
                />
                <DropdownItem
                  changeToWhere={migrateWhere}
                  // {changeToWhere}
                  onClick={onClick1}
                  text={"To Do"}
                />
                <DropdownItem
                  changeToWhere={migrateWhere}
                  // {changeToWhere}
                  onClick={onClick1}
                  text={"In Progress"}
                />
                <DropdownItem
                  changeToWhere={migrateWhere}
                  // {changeToWhere}
                  onClick={onClick1}
                  text={"Review"}
                />
                {isHead ? (
                  <DropdownItem
                    changeToWhere={migrateWhere}
                    onClick={onClick1}
                    text={"Completed"}
                  />
                ) : (
                  ""
                )}
              </ul>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>

      <div className="projectTitle">{title}</div>
      <div className="projectSubTitle">{detail}</div>
      <div className="datebox">{deadline.toString().slice(0,10)}</div>
      <br></br>
      <div>Assign to: {assignedtoName}</div>
    </div>
  );
};
function DropdownItem({ changeToWhere, onClick, text }) {
  const [d, cd] = useState(false);
  async function handleClicked() {
    changeToWhere(text);
    cd(true);
    console.log(d);
  }
  useEffect(() => {
    if (d) {
      onClick();
    }
    // eslint-disable-next-line
  }, [d]);
  return (
    // eslint-disable-next-line
    <li className="dropdownItem" onClick={handleClicked}>
      <div> {text} </div>
    </li>
  );
}

export default ColumnProgessBox;
