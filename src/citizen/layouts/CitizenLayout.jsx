import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const CitizenLayout = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  )
}

export default CitizenLayout