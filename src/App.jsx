import React from 'react'
import './App.css'
import ReactLeaflet from './components/Maps/ReactLeaflet'
import SearchBar from './components/SearchBar/SearchBar'
import { SearchProvider } from './context/SearchContext'

function App() {

  return (
    <>
      <ReactLeaflet/>
    </>
  )
}

export default App
