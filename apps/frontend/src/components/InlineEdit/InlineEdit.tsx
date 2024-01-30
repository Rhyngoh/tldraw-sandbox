import React, { useEffect, useState } from 'react';

interface Props {
  text: string;
  onTextChange: (text: string) => void;
  validationRule?: (text: string) => string;
}
const InlineEdit = (props: Props) => {
  const { text, onTextChange, validationRule } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(text);
  const [validationMessage, setValidationMessage] = useState('');
  useEffect(() => {
    setInputValue(text);
  }, [text]);
  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
    if (validationRule) {
      if (text === e.target.value) {
        // If changed back to previous layer name, reset validation message
        setValidationMessage('');
      } else {
        setValidationMessage(validationRule(e.target.value));
      }
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (inputValue.trim() === '') {
      setInputValue(text);
    } else {
      onTextChange(inputValue);
    }
  };
  const handleKeyDown = (e: any) => {
    if (e.code === 'Enter') handleBlur();
  };
  const hasValidationMessage = validationMessage !== '';
  return (
    <div
      onClick={() => setIsEditing(true)}
      style={{ width: '100%' }}
      title={hasValidationMessage ? validationMessage : undefined}
    >
      {isEditing ? (
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          width={'100%'}
          autoComplete="off"
        />
      ) : (
        <span
          style={{ border: hasValidationMessage ? '1px solid red' : 'inherit' }}
        >
          {inputValue}
        </span>
      )}
    </div>
  );
};

export default InlineEdit;
