import './App.css';
import React from 'react';
import TableComponent from './TableComponent';
import TimerComponent from './TimerComponent';
import DescriptionRecommendationComponent from './DescriptionRecommendationComponent';
import AddRowComponent from './AddRowComponent';

function App() {
  return (
    <div className="App">
       <TableComponent />
      <TimerComponent />
      <DescriptionRecommendationComponent />
      <AddRowComponent />
    </div>
  );
}

export default App;
