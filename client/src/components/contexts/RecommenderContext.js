import React, { useState, createContext } from 'react'

const RecommenderContext = createContext();
const RecommenderContextProvider = props => {
   const [seeds, setSeeds] = useState({})
   const [filters, setFilters] = useState({})
   const [curPlaylistID, setCurPlaylistID] = useState('')
   const [playlistUpdate, setPlaylistUpdate] = useState('')

   let calcNumSeeds = () => {
      return Object.keys(seeds).reduce((acc, field) => acc + (seeds[field] ? seeds[field].length : 0), 0)
   }

   return (
      <RecommenderContext.Provider value={[seeds, setSeeds, calcNumSeeds, filters, setFilters, curPlaylistID, setCurPlaylistID, playlistUpdate, setPlaylistUpdate]}>
         {props.children}
      </RecommenderContext.Provider>
   )
}

export { RecommenderContext, RecommenderContextProvider }