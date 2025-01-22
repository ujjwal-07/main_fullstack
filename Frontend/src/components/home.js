import React from 'react'
import Navbar from './Navbar'
import Posts from './Posts'
import Profile from './Profile'
export default function home() {
  return (

    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <div className="w-1/4 p-4 bg-gray-200 flex items-start justify-center">
          <Profile />
        </div>
        <div className="w-3/4">
          <Posts />
        </div>
      </div>
    </div>

  )
}
