import React from 'react'
import { Link } from 'react-router-dom'
const MainPage = () => {
  return (
    <>
    <div className='main-container'>
          <Link to={"/hospitalLogin"}><button>Hospital</button></Link>
          <Link to={"/officeLogin"}><button>Office</button></Link>
        </div>
        </>
  )
}

export default MainPage