// src/pages/CreateBlog.jsx
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./page_styles/CreateBlog.module.css";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [imgLink, setImgLink] = useState("");
  const navigate = useNavigate();

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start writing your blog here...</p>",
  });

  const handleSubmit = async () => {
    if (!title || !editor) return;

    const newBlog = {
      title: title,
      shortDescription: shortDescription,
      bodyText: editor.getHTML(),
      date: new Date().toISOString(),
      imgLink: imgLink, // optional
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/resources`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newBlog),
        }
      );

      if (!res.ok) throw new Error("Failed to create blog");

      const savedBlog = await res.json(); // The backend should return the saved blog with _id

      navigate(`/blog/${savedBlog._id}`);
    } catch (err) {
      console.error("Error creating blog:", err);
    }
  };

  return (
    <div className={styles.editorPage}>
      <h1>Make a Blog Post</h1>
      <input
        type="text"
        placeholder="Enter blog title"
        className={styles.titleInput}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter short description"
        className={styles.smallerInput}
        value={shortDescription}
        onChange={(e) => setShortDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter an img link (optional)"
        className={styles.smallerInput}
        value={imgLink}
        onChange={(e) => setImgLink(e.target.value)}
      />
      <div className={styles.toolbar}>
        {/* 
        // When clicked, this button executes a TipTap command chain:
        // - `chain()` starts a sequence of editor commands
        // - `focus()` ensures the editor is focused (needed before applying formatting)
        // - `toggleBold()` toggles bold formatting on the selected text
        // - `run()` executes the full chain
        // The optional chaining (`editor?.`) safely checks that the editor is initialized
        */}
        <button onClick={() => editor?.chain().focus().toggleBold().run()}>
          <b>B</b>
        </button>
        <button onClick={() => editor?.chain().focus().toggleItalic().run()}>
          <i>I</i>
        </button>
        <button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          H1
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          • List
        </button>
      </div>

      <div className={styles.editorContainer}>
        <EditorContent editor={editor} />
      </div>

      <button className={styles.submitButton} onClick={handleSubmit}>
        Publish Blog
      </button>
    </div>
  );
}
