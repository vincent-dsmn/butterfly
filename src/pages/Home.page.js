import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../contexts/user.context';
import '../realm/Home.css';
import React from 'react';


export default function Home() {

  const { logOutUser } = useContext(UserContext);

  // useState hook to manage the date state
  const [date, setDate] = useState(() => {
    // Initialize date from local storage or set it to null if not present
    const storedDate = localStorage.getItem('date');
    return storedDate ? new Date(storedDate) : null;
  });

  const [rotation, setRotation] = useState(0);

  // Send date to Service Worker for background notifications
  const sendToServiceWorker = (dateToSend) => {
    if (navigator.serviceWorker?.controller) {
      const messagePromise = navigator.serviceWorker.controller.postMessage({
        type: 'SET_DATE',
        date: dateToSend.toISOString()
      });
      
      // Only add catch if postMessage returns a Promise
      if (messagePromise?.catch) {
        messagePromise.catch(() => {});
      }
    }
  };

  const setDateLocalStorage = () => {
    const currentDate = new Date();
    setDate(currentDate);
    localStorage.setItem('date', currentDate);
    setRotation(prevRotation => prevRotation + 360 * 5);
    sendToServiceWorker(currentDate);
  };

  // Function that counts the number of days between the stored date and current date
  const countDays = () => {
    if (!date) return "Click to find Butterflies!";
    
    const currentDate = new Date();
    const diffTime = currentDate - date;

    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours < 24) {
      return `${diffHours} hours since you found Butterflies!`;
    }
    
    const diffDays = Math.floor(diffHours / 24);
    const remainingHours = diffHours - (diffDays * 24);
    if (remainingHours === 0) {
      return `${diffDays} day(s) since you found Butterflies!`;
    }
    
    return `${diffDays} day(s) and ${remainingHours} hour(s) since you found Butterflies!`;
  };

  const setDateToFuture = () => {
    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    futureDate.setDate(futureDate.getDate() + 10);
    setDate(futureDate);
    localStorage.setItem('date', futureDate);
    sendToServiceWorker(futureDate);
  };

  return (
    <div className='home'>
      <div className="round-button-container">
        <button className="round-button" onClick={setDateLocalStorage} style={{ transform: `rotateY(${rotation}deg)` }}>
          <span className="button-text">{countDays()}</span>
        </button>
      </div>
    </div>
  );
}
