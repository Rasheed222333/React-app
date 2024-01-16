import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import "./AutocompleteChips.css";

const AutocompleteChips = () => {
  const [inputValue, setInputValue] = useState("");
  const [selectedChips, setSelectedChips] = useState([]);
  const [chipOrder, setChipOrder] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [highlightLastChip, setHighlightLastChip] = useState(false);
  const [backspaceCount, setBackspaceCount] = useState(0);
  const [isMouseOverSuggestions, setIsMouseOverSuggestions] = useState(false);

  const allUsers = [
    { id: 1, name: "Nick", email: "nick@example.com" },
    { id: 2, name: "Rahul", email: "rahul@example.com" },
    { id: 3, name: "Rasheed", email: "rasheed@example.com" },
    { id: 4, name: "Jenny", email: "jenny@example.com" },
    { id: 5, name: "Bob", email: "bob@example.com" },
  ];

  const filteredNames = allUsers.filter(
    (user) =>
      (inputValue.trim() === "" ||
        user.name.toLowerCase().includes(inputValue.toLowerCase())) &&
      !selectedChips.includes(user.name)
  );

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddChip = (user) => {
    const { name, email } = user;

    if (!selectedChips.includes(name)) {
      const newChips = [...selectedChips, name];
      setSelectedChips(newChips);
      setChipOrder([...chipOrder, name]);
      setInputValue("");
      setIsInputFocused(false);
      setHighlightLastChip(false);
      setBackspaceCount(0);
    }
  };

  const handleRemoveChip = (name) => {
    const updatedChips = selectedChips.filter((chip) => chip !== name);
    setSelectedChips(updatedChips);
    setChipOrder(chipOrder.filter((chip) => chip !== name));
    setHighlightLastChip(false);
    setBackspaceCount(0);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleMouseEnterSuggestions = () => {
    setIsMouseOverSuggestions(true);
  };

  const handleMouseLeaveSuggestions = () => {
    setIsMouseOverSuggestions(false);
  };

  const handleInputBlur = () => {
    if (!isMouseOverSuggestions) {
      setIsInputFocused(false);
    }
  };


  const handleKeyDown = (e) => {
    if (e.key === "Backspace" && inputValue.trim() === "") {
      // Backspace pressed on an empty input field
      setBackspaceCount(backspaceCount + 1);
      if (backspaceCount === 1 && chipOrder.length > 0) {
        // Second consecutive backspace, remove the last added chip
        const lastAddedChip = chipOrder[chipOrder.length - 1];
        handleRemoveChip(lastAddedChip);
      }
      else if (backspaceCount === 0 && chipOrder.length > 0) {
        setHighlightLastChip(true);
      }
    } else {
      // Reset backspace count for other keys
      setBackspaceCount(0);
      setHighlightLastChip(false);
    }
  };

  return (
    <Row className="autocomplete-chips-container">
      <Col xs={8} className="selected-chips-container">
        {selectedChips.map((chip, index) => (
          <span
            key={chip}
            className={`chip ${highlightLastChip && index === selectedChips.length - 1
                ? "highlighted"
                : ""
              }`}
          >
            <span className="chip-icon">&#128100;</span> {chip}
            <span
              className="chip-remove"
              onClick={() => handleRemoveChip(chip)}
            >
              &#10006;
            </span>
          </span>
        ))}
      </Col>
      <Col xs={4} className="input-container">
        <Form.Control
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder="Type to search..."
          className="invisible-border"
        />
        {(isInputFocused || inputValue.trim() !== "") && (
          <div className="autocomplete-list"

            onMouseEnter={handleMouseEnterSuggestions}
            onMouseLeave={handleMouseLeaveSuggestions}>
            {filteredNames.map((user) => (
              <div
                key={user.id}
                className="autocomplete-item"
                onClick={() => handleAddChip(user)}
              >
                {/* <div className="list-item"> */}
                <span className="chip-icon">&#128100;</span> <span>{user.name} </span> <span className='autocomplete-email'>{user.email}</span>
              </div>
            ))}
          </div>
        )}
      </Col>
    </Row>
  );

};

export default AutocompleteChips;