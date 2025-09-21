import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const DoctorCalendar = () => {
  const [events, setEvents] = useState([]);
  const [newEventTitle, setNewEventTitle] = useState("");

  // Function to handle date selection on the calendar
  const handleSelectSlot = ({ start, end }) => {
    const title = window.prompt("Enter the event title:");
    if (title) {
      const newEvent = {
        title,
        start,
        end,
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Doctor's Schedule</h2>

      <Calendar
        localizer={localizer}
        events={events} // Pass the events state
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable // Allows selecting dates to create events
        onSelectSlot={handleSelectSlot} // Handle when a user selects a date
      />
    </div>
  );
};

export default DoctorCalendar;
