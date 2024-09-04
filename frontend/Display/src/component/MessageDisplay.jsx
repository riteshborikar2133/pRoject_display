
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MessageDisplay = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [loader, setLoader] = useState(null)

  useEffect(() => {
    setLoader(1)
    // Fetch messages from the API
    axios.get('http://127.0.0.1:5000/api/circulars')
      .then(response => {
        setMessages(response.data);  // Assuming response.data is an array of message objects
        console.log(response.data);
        setLoader(null)
      })
      .catch(error => {
        console.error('Error fetching messages:', error);
      });
  }, []);

  useEffect(() => {
    // Display messages one by one at a certain interval
    if (messages.length > 0) {
      const intervalId = setInterval(() => {
        // Display the current message
        setCurrentMessage([messages[messageIndex].message, messages[messageIndex].title]);
        console.log(currentMessage)
        // Move to the next message, and loop back to the first if at the end
        setMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
      }, 5000); // Change interval time as needed

      return () => clearInterval(intervalId);
    }
  }, [messages, messageIndex]);

  return (
    <div className='context'>
      {
        loader ? (
          <h3>Loading</h3>
        ) : (
          <div>
            <h2>Message Display</h2>
            <h3>{currentMessage[1]}</h3>
            <p>{currentMessage[0]}</p>
          </div>
        )
      }
    </div>
  );
};

export default MessageDisplay;
