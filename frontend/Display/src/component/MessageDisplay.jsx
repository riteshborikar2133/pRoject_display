
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Clock from './Clock/Clock';

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
        setCurrentMessage([messages[messageIndex].message, messages[messageIndex].title, messages[messageIndex].type]);
        console.log(currentMessage)
        // Move to the next message, and loop back to the first if at the end
        setMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
      }, 8000); // Change interval time as needed

      return () => clearInterval(intervalId);
    }
  }, [messages, messageIndex]);

  return (
    <>
      <video autoPlay muted loop id="myVideo" >
        <source src="Background (1).mp4" type="video/mp4" />
      </video>
      <Clock />
      <div className='context'>
        {
          loader ? (
            <div>
              {/* <h3>Loading</h3> */}
              <img src="sbj.png" alt="" height={"500px"} />
            </div>
          ) : (
            <div>
              {/* <h2>Message Display</h2> */}
              {
                currentMessage[2] == null && <div>
                  <img src="sbj.png" alt="" height={"500px"} />
                </div>
              }
              {
                currentMessage[2] == "text" && <div>
                  <h3>{currentMessage[1]}</h3>
                  <p>{currentMessage[0]}</p>
                </div>
              }
              {
                currentMessage[2] == "img" && <div>
                  <h3>{currentMessage[1]}</h3>
                  <img src={currentMessage[0]} />
                </div>
              }

              {/* <p>{currentMessage[2]}</p> */}
            </div>
          )
        }
      </div>
    </>
  );
};

export default MessageDisplay;
