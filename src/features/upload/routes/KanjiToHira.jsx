import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../index.scss";
import { CustomSidebar } from "../component/sidebar";

function KanjiToHira() {
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
            <input id="kanji" />
            <input id="hira" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default KanjiToHira;
