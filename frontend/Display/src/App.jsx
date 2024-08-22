// import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
// import axios from 'axios'
// function App() {
//   // const [count, setCount] = useState(0)
//   const [data, setData] = useState([])
//   const [display, setDisplay] = useState(null)
//   const [loader, setLoader] = useState(null)
//   const [messageArray, setMessageArray] = useState([])
//   const fetchdata = async () => {

//     setLoader(1)
//     // console.log("dd")
//     const res = await axios.get("http://127.0.0.1:5000/api/circulars")
//       .then((e) => {
//         setData(e.data)
//         console.log(data)
//         setLoader(null)
//       })


//   }


//   useEffect(() => {
//     fetchdata()
//   }, [])


//   useEffect(() => {
//     console.log(data)
//     data.map((item) => {
//       console.log(item.message)
//       setMessageArray([...messageArray,item.message])
//     })
//     console.log(messageArray)
//   }, [data])

//   return (
//     <>
//       {
//         loader && !display ? (
//           <h1>loading</h1>
//         ) : (
//           // data
//           //   .map((item) => {
//           //     return (
//           //       <h3>{item.message}</h3>
//           //     )
//           //   })
//           <div>
//             {
//               messageArray.map((item)=>{
//                 return(
//                   <h3>{item}</h3>
//                 )
//               })
//             }
//             <h3>ds</h3>
//           </div>
//         )
//       }
//     </>
//   )
// }
// export default App






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
        console.log(response.data)
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
