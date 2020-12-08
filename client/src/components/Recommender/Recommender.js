import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { FilterBar, Seeder, RecResults, PlaylistTracker } from '../components';
import { RecommenderContextProvider } from '../contexts';

export default function Recommender(props) {
   return (
      <section className='container'>
         <h1>Track Recommendation System and Playlist Editor</h1>
         <h2>Usage:</h2>
         <div className='border border-secondary'>
            <ol>
               <div><b>Recommendations:</b></div>
               <li>Select a seed type</li>
               <li>Select up to 5 seeds</li>
                  <div>Seeds are artists, tracks, or genres that the recommendation will be based on</div>
               <li>Click on image of the search result to add seed</li>
               <li>(Optional) Filter recommendations by song characteristics</li>
                  <div>"min" and "max" allows you define a hard range, "target" allows you to favor a certain value of a characteristic</div>
               <li>(Repeatable) Click on "Get Recommendations" to get related tracks</li>
            </ol>
            <ol>
               <div><b>Playlist Editor:</b></div>
               <li>Log in if you have not already</li>
               <li>Select or create a new playlist</li>
               <li>Add tracks to the selected playlist by clicking on the track images in the recommendations column</li>
               <li>Delete tracks from the selected playlist by clicking on the track images in the playlist editor column</li>
            </ol>
         </div>
         <RecommenderContextProvider>
            <FilterBar/>
            <Row>
               <Col>
                  <Seeder/>
               </Col>
               <Col>
                  <RecResults/>
               </Col>
               <Col>
                  <PlaylistTracker/>
               </Col>
            </Row>
         </RecommenderContextProvider>
      </section>
   );
}