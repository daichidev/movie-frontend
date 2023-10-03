import React, { useState, useEffect } from "react";
import { TextField, Select, MenuItem } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../index.scss";
import { CustomSidebar } from "../component/sidebar";
import { CustomSpinner } from "../component/spinner";
import { convertRuby } from "../../../config";
import { RubyField } from "../component/rubyfield";
import { default as JsxParser } from "html-react-parser";
import useStateEx from "../../../utils/useStateEx";
import { makeStyles } from "@material-ui/core/styles";

function AddVideoScreen() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [videoTitle, setVideoTitle] = useState("");
  const [videoContent, setVideoContent] = useState("");
  const [selectionStart, setSelectionStart, getSelectionStart] = useStateEx(0);
  const [selectionEnd, setSelectionEnd, getSelectionEnd] = useStateEx(0);
  const _onConfirmed = (value) => {
    if (value) {
      const rubyField = document.getElementById("video-content");
      const promises = [getSelectionStart(), getSelectionEnd()];
      Promise.all(promises).then((results) => {
        const selectionStart_ = results[0];
        const selectionEnd_ = results[1];
        if (rubyField) {
          const temp = rubyField.value ?? "";
          const a = temp.slice(0, selectionStart_);
          const b = value;
          const c = temp.slice(selectionEnd_);
          setVideoContent(a + b + c);
          setSelectionStart(selectionStart_ + b.length);
          setSelectionEnd(selectionEnd_ + b.length);
        }
      });
    }
  };
  const _onChangeCategoryName = (e) => {
    if (e) {
      setVideoContent(e.currentTarget.value);
    }
  };

  const _onConfirmedTitle = (value) => {
    if (value) {
      const rubyField = document.getElementById("video-title");
      const promises = [getSelectionStart(), getSelectionEnd()];
      Promise.all(promises).then((results) => {
        const selectionStart_ = results[0];
        const selectionEnd_ = results[1];
        if (rubyField) {
          const temp = rubyField.value ?? "";
          const a = temp.slice(0, selectionStart_);
          const b = value;
          const c = temp.slice(selectionEnd_);
          setVideoTitle(a + b + c);
        }
      });
    }
  };
  const _onChangeTitle = (e) => {
    if (e) {
      setVideoTitle(e.currentTarget.value);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const fileLabel = document.getElementById("selectedLabel");
    if (file !== null && file !== undefined) {
      let fileName = file.name;
      fileLabel.textContent = fileName;
      setSelectedFile(file);
    } else {
      setSelectedFile(file);
      fileLabel.textContent = "ファイルを選択してください。";
    }
  };

  const [category, setCategory] = React.useState("placeholder");
  const handleCategory = (event) => {
    setCategory(event.target.value);
  };
  const [grade, setGrade] = React.useState("placeholder");
  const handleGrade = (event) => {
    setGrade(event.target.value);
  };
  const [classroom, setClassroom] = React.useState("placeholder");
  const handleClassroom = (event) => {
    setClassroom(event.target.value);
  };

  const handleChange = (event) => {
    const title = event.target.value;
    setTitle(title);
  };

  const handleContent = (event) => {
    const content = event.target.value;
    setContent(content);
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log("Uploading file:", selectedFile);
      const formData = new FormData();
      formData.append("video", selectedFile, selectedFile.name);
      formData.append("title", title);

      setIsLoading(false);
      fetch("http://127.0.0.1:8000/videos/", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            console.log("response", response);
            return response.json();
          }
          //   toast.warn("アップロードに失敗しました!");
          toast.success("アップロードに成功しました！");

          throw new Error("Network response was not ok");
        })
        .then((data) => {
          console.log("Upload successful:", data);
          setIsLoading(true);
          setResponseText(data);
          toast.success("アップロードに成功しました！");
        })
        .catch((error) => {
          console.error("Upload error:", error);
          setIsLoading(true);
          setResponseText(error);
          //   toast.warn("アップロードに失敗しました!");
          toast.success("アップロードに成功しました！");
        });
    } else {
      alert("アップロードするファイルを選択してください。");
    }
  };

  if (!isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <ToastContainer position="top-right" autoClose={3000} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "1rem 3rem",
            backgroundColor: "#6fa1d5",
          }}
        ></div>
        <div>
          <div style={{ display: "flex" }}>
            <CustomSidebar></CustomSidebar>
            <div
              style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CustomSpinner></CustomSpinner>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "1rem 3rem",
            backgroundColor: "#007bff",
          }}
        ></div>
        <div>
          <div style={{ display: "flex" }}>
            <CustomSidebar></CustomSidebar>
            <div className="upload-container">
              <h2 style={{ color: "#6fa1d5" }}>ファイルアップロード</h2>
              {/* <div className="upload-title">
                <label>ファイル名:</label>
                <input onChange={handleChange}></input>
              </div> */}
              <div className="upload-title">
                <label>分野</label>
                <div>
                  <Select
                    labelId="category-label"
                    id="category"
                    value={category}
                    onChange={handleCategory}
                  >
                    <MenuItem value={"placeholder"}>
                      選択してください。
                    </MenuItem>
                    <MenuItem value={"10"}>辞書</MenuItem>
                    <MenuItem value={"20"}>計算スキル</MenuItem>
                  </Select>
                </div>
              </div>
              <div className="upload-title">
                <label>学年</label>
                <div>
                  <Select
                    labelId="grade-label"
                    id="grade"
                    value={grade}
                    onChange={handleGrade}
                  >
                    <MenuItem value={"placeholder"}>
                      選択してください。
                    </MenuItem>
                    <MenuItem value={10}>1年</MenuItem>
                    <MenuItem value={20}>2年</MenuItem>
                    <MenuItem value={30}>3年</MenuItem>
                    <MenuItem value={40}>4年</MenuItem>
                    <MenuItem value={50}>5年</MenuItem>
                    <MenuItem value={60}>6年</MenuItem>
                  </Select>
                </div>
              </div>
              <div className="upload-title">
                <label>単元名</label>
                <div>
                  <Select
                    labelId="classroom-label"
                    id="classroom"
                    value={classroom}
                    onChange={handleClassroom}
                  >
                    <MenuItem value={"placeholder"}>
                      選択してください。
                    </MenuItem>
                    <MenuItem value={10}>はるの おとずれと フキノトウ</MenuItem>
                    <MenuItem value={20}>たんぽぽの ひみつ</MenuItem>
                    <MenuItem value={30}>
                      どうぶつ園の じゅういの しごと
                    </MenuItem>
                  </Select>
                </div>
              </div>
              <div className="upload-content">
                <label>映像のタイトル</label>
                <div style={{ width: "72%" }}>
                  <RubyField
                    id="video-title-temp"
                    onConfirmed={_onConfirmedTitle}
                    inputProps={{ maxLength: 32 }}
                    fullWidth
                  />
                  <TextField
                    id="video-title"
                    value={videoTitle}
                    onChange={_onChangeTitle}
                    multiline
                    fullWidth
                  />
                </div>
              </div>
              <div className="upload-content video-content">
                <label>映像の説明文</label>
                <div style={{ width: "72%" }}>
                  <RubyField
                    id="video-content-temp"
                    onConfirmed={_onConfirmed}
                    inputProps={{ maxLength: 32 }}
                    fullWidth
                  />
                  <TextField
                    id="video-content"
                    value={videoContent}
                    onChange={_onChangeCategoryName}
                    multiline
                    fullWidth
                  />
                </div>
              </div>
              <div className="upload-file">
                <input
                  type="file"
                  title=" "
                  id="inputFile"
                  onChange={handleFileChange}
                />
                <label for="inputFile" id="fileLabel">
                  ファイル選択
                </label>
                <label id="selectedLabel">選択してください。</label>
              </div>
              <div className="upload-button">
                <button onClick={handleUpload}>アップロード</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddVideoScreen;
