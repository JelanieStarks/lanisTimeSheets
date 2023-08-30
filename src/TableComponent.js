// TableComponent.js

import React, { useState } from 'react';
import _ from 'lodash'; // import lodash
import TimerComponent from './TimerComponent';
import useLocalStorage from './useLocalStorage';


const TableComponent = () => {
  // Define initial state
  const [descriptions, setDescriptions] = useLocalStorage('descriptions', {});
  const [rows, setRows] = useLocalStorage('rows', [
    // Example of how a row might look
    {
      repairOrder: '',
      make: '',
      model: '',
      year: '',
      originalTime: '',
      soldTime: '',
      cause: '',
      concern: '',
      correction: '',
      timer: { status: 'stopped', time: '' },
    },
  ]);

  const [runningTimers, setRunningTimers] = useLocalStorage('runningTimers', []); 

  // A method to add a new row
  const addRow = () => {
    const newRow = {
      repairOrder: '',
      make: '',
      model: '',
      year: '',
      originalTime: '',
      soldTime: '',
      cause: '',
      concern: '',
      correction: '',
      timer: { status: 'stopped', time: '' },
    };
    setRows([...rows, newRow]);
  };

  // A method to delete a row
  const deleteRow = (index) => {
    const newRows = _.cloneDeep(rows); // Create a deep clone of the rows array
    newRows.splice(index, 1); // Remove the row at the specified index
    setRows(newRows); // Update the state
  };

  // A method to update a row
  const updateRow = (index, updatedRow) => {
    const newRows = _.cloneDeep(rows); // Create a deep clone of the rows array
    // Add up original and sold time
    const timeValues = updatedRow.originalTime.split(',').concat(updatedRow.soldTime.split(','));
    let totalTime = 0;
    timeValues.forEach(value => {
      totalTime += parseFloat(value);
    });
    updatedRow.totalTime = totalTime;
    // Check if total time is less than timer time
    if (updatedRow.timer.time > updatedRow.totalTime) {
      alert(`Exceeded expected time for row ${index + 1}`);
    }
    newRows[index] = updatedRow; // Replace the row at the specified index with the updated row
    setRows(newRows); // Update the state
  };
  

  // A method to toggle a timer
  const toggleTimer = (index) => {
    const newRunningTimers = _.cloneDeep(runningTimers);
    if (newRunningTimers.includes(index)) {
      newRunningTimers.splice(newRunningTimers.indexOf(index), 1);
    } else {
      newRunningTimers.push(index);
    }
    setRunningTimers(newRunningTimers);
  };

  return (
    <div>
      <button onClick={addRow}>Add Row</button>
      <table>
        {/* Table Header */}
        <thead>
        <tr>
  <th>Repair Order</th>
  <th>Make</th>
  <th>Model</th>
  <th>Year</th>
  <th>Original Time</th>
  <th>Sold Time</th>
  <th>Total Time</th>
  <th>Cause</th>
  <th>Concern</th>
  <th>Correction</th>
  <th>Timer</th>
  <th>Delete</th>
</tr>

        </thead>

        {/* Table Body */}
        <tbody>
        {rows.map((row, index) => (
  <tr key={index}>
    {Object.keys(row).map((property) => {
  if (property === 'totalTime') return null; // skip rendering totalTime

  if (property === 'timer') {
    return (
      <>
        {/* Insert the total time cell here */}
        <td>{row.totalTime ? row.totalTime.toFixed(1) : ''}</td>

        {/* Timer cell */}
        <td key={property}>
          <TimerComponent
            status={runningTimers.includes(index) ? 'started' : 'stopped'}
            onTimeChange={(time) => {
              const updatedRow = _.cloneDeep(row); // Create a deep clone of the row
              updatedRow.timer.time = time; // Update the time in the timer
                
              // Parse the original time and sold time into numbers
              const originalTime = parseFloat(updatedRow.originalTime) || 0;
              const soldTime = parseFloat(updatedRow.soldTime) || 0;
                
              // Compute the total time and update the row
              updatedRow.totalTime = originalTime + soldTime + parseFloat(time);
                
              updateRow(index, updatedRow); // Update the row
            }}
          />
          <button onClick={() => toggleTimer(index)}>
            {runningTimers.includes(index) ? 'Stop' : 'Start'}
          </button>
        </td>
      </>
    );
  }
  // rendering the input fields
  return (
    <td key={property}>
      <input
        type="text"
        value={row[property]}
        onChange={(e) => {
          const updatedRow = _.cloneDeep(row); // Create a deep clone of the row
          updatedRow[property] = e.target.value; // Update the changed property in the row
          updateRow(index, updatedRow); // Update the row
              
          if (property === 'cause' || property === 'concern' || property === 'correction') {
            const words = e.target.value.split(' '); // Split the description into words
            const newDescriptions = { ...descriptions }; // Create a copy of the descriptions state
            for (const word of words) {
              if (!newDescriptions[word]) {
                newDescriptions[word] = [];
              }
              newDescriptions[word].push(e.target.value); // Add the description to the list for each keyword
            }
            setDescriptions(newDescriptions); // Update the descriptions state
          }
        }}
        list={`${property}Descriptions`}
      />
      <datalist id={`${property}Descriptions`}>
        {descriptions[row[property]] &&
          descriptions[row[property]].map((description, i) => (
            <option key={i} value={description} />
          ))}
      </datalist>
    </td>
  );
})}

    <td>
      <button onClick={() => deleteRow(index)}>Delete</button>
    </td>
  </tr>
))}

</tbody>

      </table>
    </div>
  );
};

export default TableComponent;
