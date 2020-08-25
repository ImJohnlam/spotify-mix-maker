import React, { useState, createContext } from 'react'

const RecommenderContext = createContext();
const RecommenderContextProvider = props => {
   const [seeds, setSeeds] = useState({})
   const [filters, setFilters] = useState({})

   return (
      <RecommenderContext.Provider value={[seeds, setSeeds, filters, setFilters]}>
         {props.children}
      </RecommenderContext.Provider>
   )
}

export { RecommenderContext, RecommenderContextProvider }