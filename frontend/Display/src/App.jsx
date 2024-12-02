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





import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Form from './component/Form'
import MessageDisplay from './component/MessageDisplay'
import Weather from './component/Weather/Weather'
import Login from './component/INPUTFORM/Login'
import NewInput from './component/NewInput/NewInput'
import Notice from './component/Carousel/Notice'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MessageDisplay />} />
        <Route path='/input' element={<Form />} />
        {/* <Route path='/we' element={<Weather />} /> */}
        <Route path='/login' element={<Login />} />
        <Route path='/newinput' element={<NewInput />} />
        <Route path='/display' element={<Notice />} />
      </Routes>
    </BrowserRouter>
  )
}
