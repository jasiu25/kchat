/* 
  TO DO:
  - File upload (attachments) visuals [WiP]
*/

import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import type { AttachmentPreview } from "../types/AttachmentPreview";
import type { SendMessageProps } from "../types/SendMessageProps";
import add from "../assets/add-circle-svgrepo-com.png";
import send from "../assets/send-svgrepo-com.png";
import "./SendForm.css";

export default function SendForm(props: SendMessageProps) {
  const [message, setMessage] = useState<string>("");
  const [formDisabled, setFormDisabled] = useState<boolean>(false);
  const [attachmentsPaths, setAttachmentsPaths] = useState<string[] | null>(
    null,
  );
  const [attachmentsPreview, setAttachmentsPreview] = useState<
    AttachmentPreview[]
  >([]);

  const attachmentRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      attachmentsPreview.forEach(({ preview }) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [attachmentsPreview]);

  // Send a message
  function submitHandler(e: SyntheticEvent) {
    e.preventDefault();
    if (!props.socket) return;
    if (!attachmentsPaths && message.trim() === "") return;

    props.socket.emit("message", {
      username: props.username,
      content: message,
      attachmentsPaths,
    });

    setMessage("");
    setFormDisabled(true);
    setAttachmentsPaths(null);
    setTimeout(() => {
      setFormDisabled(false);
      inputRef.current?.focus();
    }, 1000);
  }

  const handleAttachmentUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files) {
      const files = [...event.target.files];
      const formData = new FormData();

      const previews = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setAttachmentsPreview(previews);

      files.forEach((file) => {
        formData.append("attachment", file);
      });

      const response = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      setAttachmentsPaths(result);
    }
  };

  return (
    <form onSubmit={submitHandler}>
      {attachmentsPreview && (
        <div id="attachmentsPreview">
          {attachmentsPreview?.map(({ file, preview }) => {
            return (
              <img
                src={preview}
                key={preview}
                alt={file.name}
                className="preview"
              />
            );
          })}
        </div>
      )}
      <div id="inputs">
        <input
          type="text"
          placeholder="Aa"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          disabled={formDisabled}
          ref={inputRef}
          autoFocus
        />
        <input
          type="file"
          name="attachment"
          accept="image/*"
          id="addInput"
          onChange={handleAttachmentUpload}
          ref={attachmentRef}
          multiple
        ></input>
        <label htmlFor="addInput" id="add">
          <img src={add} alt="Attach" />
        </label>
        <button type="submit" disabled={formDisabled} id="send">
          <img src={send} alt="Send" />
        </button>
      </div>
    </form>
  );
}
