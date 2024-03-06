import { useContext, useState } from 'react';
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

  // This function is called when the user clicks the "Logout" button.
  const logOut = async () => {
    try {
      const loggedOut = await logOutUser();
      if (loggedOut) {
        window.location.reload(true);
      }
    } catch (error) {
      alert(error);
    }
  };

  const [rotation, setRotation] = useState(0);

  const setDateLocalStorage = () => {
    const currentDate = new Date();
    setDate(currentDate); // Mettre à jour l'état date
    localStorage.setItem('date', currentDate);
  
    // Mise à jour de la rotation en utilisant la fonction de mise à jour de l'état
    setRotation(prevRotation => prevRotation + 360 * 5);
  
    
  };
  

  // function that count the number of day between the local storage date and the current date
  const countDays = () => {
    const currentDate = new Date();

    const diffTime = currentDate - date;
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (Math.abs(diffHours) < 24) {
      return `${diffHours} hours since you found Butterflies!`;
    }
    
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days since you found Butterflies!`;
  };

  const setDateToFuture = () => {
    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    futureDate.setDate(futureDate.getDate() + 10);
    setDate(futureDate);
    localStorage.setItem('date', futureDate);
  };

  return (
    <div className='home'>
      <div className="round-button-container">
        <button className="round-button" onClick={setDateLocalStorage} style={{ transform: `rotateY(${rotation}deg)` }}>
          <span className="button-text">{countDays()}</span>
        </button>
      </div>
      {/* <div className="round-button-container">
        <button className="round-button" onClick={setDateToFuture}>
          <span className="button-text">Set Date to Future</span>
        </button>
      </div> */}
    </div>
  );
}
