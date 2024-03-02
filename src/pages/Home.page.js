import { Button } from '@mui/material';
import { useContext, useState } from 'react';
import { UserContext } from '../contexts/user.context';

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

  // function that set the local storage date to the current date
  const setDateLocalStorage = () => {
    const currentDate = new Date();
    setDate(currentDate); // Update state
    localStorage.setItem('date', currentDate);
  };

  // function that count the number of day between the local storage date and the current date
  const countDays = () => {
    const currentDate = new Date();

    const diffTime = Math.abs(currentDate - date);
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    if (diffHours < 24) {
      return `Hello Lisa! It's good to know that you have found Butterflies today.`;
    }
    
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `Welcome back Lisa! It's been ${diffDays} days since you found Butterflies.`;
  };

  const setDateToFuture = () => {
    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    futureDate.setDate(futureDate.getDate() + 10);
    setDate(futureDate);
    localStorage.setItem('date', futureDate);
  };

  return (
    <>
      <h1>{countDays()}</h1>
      {/* <h2>{date ? date.toString() : 'No date set'}</h2> */}

      <Button variant="contained" onClick={setDateLocalStorage}>
        Update Date
      </Button>
      
    </>
  );
}
