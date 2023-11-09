import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../index.scss";
import { CustomSidebar } from "../component/sidebar";
import { CustomSpinner } from "../component/spinner";
import { CustomTable } from "../component/table";
import { useGetVideosQuery } from "../../api/api-slice";
import { convertRuby } from "../../../config";
import { default as JsxParser } from "html-react-parser";

function UploadListScreen() {
  const { data: videosData } = useGetVideosQuery();
  console.log("videosData", videosData);

  const keyToKeep = [
    "id",
    "title",
    "content",
    "media",
    "caption",
    "grade",
    "unit",
    "category",
  ];
  let tableData = [];
  if (videosData) {
    tableData = videosData.map((element) =>
      Object.fromEntries(
        Object.entries(element).filter(([key]) => keyToKeep.includes(key))
      )
    );
  }
  tableData.forEach((element) => {
    element.title = JsxParser(convertRuby(element.title));
    element.content = JsxParser(convertRuby(element.content));
    let decodedStr = decodeURIComponent(element.media);
    element.media = decodedStr.substring(decodedStr.lastIndexOf("/") + 1);
    let decodedCaptionStr = decodeURIComponent(element.caption);
    element.caption = decodedCaptionStr.substring(
      decodedCaptionStr.lastIndexOf("/") + 1
    );
  });
  console.log("tableData", tableData);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
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
          <div className="custom-table">
            <CustomTable data={tableData} originData={videosData}></CustomTable>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadListScreen;
