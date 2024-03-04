// PostForm.js
import React, { useState } from 'react';
import './PostForm.css'; // Import CSS file for styling

function PostForm({ update, setShowPost, darkMode }) { 
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Get current date
  const [showWarning, setShowWarning] = useState(false); // State variable to manage warning message display

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  }; 

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    finalPostSubmit({ text, image, date });
    setText('');
    setImage(null);
    setDate(new Date().toISOString().split('T')[0]); // Reset date to current date
  };

  const finalPostSubmit = ({ text, image, date }) => {
    if (text == '' && !image ) { //if both of them are null   
        setShowWarning(true); // Display the warning message
    } else {
        update({ text, image, date })
        setShowPost(false);
    }
  };

  const handleCloseForm = () => {
    setShowPost(false); // Close the form when the close icon is clicked
  };

  // Apply dark mode styles conditionally
  const formStyle = darkMode ? "darkStyle" : "style";
  const wordsStyle = darkMode ? "dark-color" : "my-color";
  // const cardStyle = darkMode ? "dark-card" : "my-card";


  return (
    <div className={`post-form-container ${formStyle}`}>
      {showWarning && ( // Display the warning message if showWarning is true
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i class="bi bi-exclamation-circle icon"></i>
          <div>
            Please fill in at least one of the fields (text or image).
          </div>
        </div>
      )}
      <i className="bi bi-x-lg close-icon" onClick={handleCloseForm}></i> {/* Close icon */}
      <form onSubmit={handleSubmit} className="post-form">
        <div>
          <label htmlFor="text">Text:</label>
          <input type="text" id="text" value={text} onChange={handleTextChange} />
        </div>
        <div>
          <label htmlFor="image">Image:</label>
          <input type="file" id="image" onChange={handleImageChange} />
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input type="date" id="date" value={date} onChange={handleDateChange} />
        </div>
        <button type="submit">Post</button>
      </form>
    </div>
  );
}

export default PostForm;