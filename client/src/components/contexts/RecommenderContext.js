import React, { useState, createContext } from 'react'

const RecommenderContext = createContext();
const RecommenderContextProvider = props => {
   let [seeds, setSeeds] = useState({})
   const [filters, setFilters] = useState({})

   let calcNumSeeds = () => {
      return Object.keys(seeds).reduce((acc, field) => acc + (seeds[field] ? seeds[field].length : 0), 0)
   }

   return (
      <RecommenderContext.Provider value={[seeds, setSeeds, filters, setFilters, calcNumSeeds]}>
         {props.children}
      </RecommenderContext.Provider>
   )
}

export { RecommenderContext, RecommenderContextProvider }