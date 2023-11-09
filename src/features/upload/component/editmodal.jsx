import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { RubyField } from "./rubyfield";
import { TextField } from "@mui/material";
import useStateEx from "../../../utils/useStateEx";

import "./editmodal.scss";

export const EditModal = ({
  showModal,
  onClose,
  onSave,
  videoTitle,
  videoContent,
}) => {
  console.log(videoContent, "dsfdsda", videoTitle);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  console.log("title: ", title, "content: ", content);
  const [selectionStart, setSelectionStart, getSelectionStart] = useStateEx(0);
  const [selectionEnd, setSelectionEnd, getSelectionEnd] = useStateEx(0);

  useEffect(() => {
    setTitle(videoTitle);
    setContent(videoContent);
  }, [videoTitle, videoContent]);
  const _onBlur = (e) => {
    if (e) {
      e.preventDefault();
      setSelectionStart(e.currentTarget.selectionStart ?? 0);
      setSelectionEnd(e.currentTarget.selectionEnd ?? 0);
    }
  };

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
          setContent(a + b + c);
          setSelectionStart(selectionStart_ + b.length);
          setSelectionEnd(selectionEnd_ + b.length);
        }
      });
    }
  };
  const _onChangeCategoryName = (e) => {
    if (e) {
      setContent(e.currentTarget.value);
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
          setTitle(a + b + c);
          setSelectionStart(selectionStart_ + b.length);
          setSelectionEnd(selectionEnd_ + b.length);
        }
      });
    }
  };
  const _onChangeTitle = (e) => {
    if (e) {
      setTitle(e.currentTarget.value);
    }
  };
  return (
    <Modal
      show={showModal}
      onHide={onClose}
      dialogClassName="modal-stamp"
      size="lg"
      centered
    >
      <Modal.Header>
        <span
          className="edit-modal-header"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          編集画面
        </span>
      </Modal.Header>
      <Modal.Body>
        <div className="edit-modal-title">
          <label>映像のタイトル</label>
          <div>
            <RubyField
              id="video-title-temp"
              onConfirmed={_onConfirmedTitle}
              inputProps={{ maxLength: 32 }}
              fullWidth
            />
            <TextField
              id="video-title"
              value={title}
              onChange={_onChangeTitle}
              onBlur={_onBlur}
              multiline
              fullWidth
            />
          </div>
        </div>
        <div className="edit-modal-content">
          <label>映像の説明文</label>
          <div>
            <RubyField
              id="video-content-temp"
              onConfirmed={_onConfirmed}
              inputProps={{ maxLength: 32 }}
              fullWidth
            />
            <TextField
              id="video-content"
              value={content}
              onChange={_onChangeCategoryName}
              onBlur={_onBlur}
              multiline
              fullWidth
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="edit-modal-footer">
          <Button onClick={onClose}>いいえ</Button>
          <Button onClick={() => onSave(title, content)}>はい</Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
