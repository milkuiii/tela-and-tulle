'use client';

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './RentalCalendar.module.css';

export default function RentalCalendar({ occupiedDatesMap }) {
  const [hoveredDate, setHoveredDate] = useState(null);
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  // Format date to YYYY-MM-DD
  const formatDateString = (date) => {
    const offset = date.getTimezoneOffset();
    const mappedDate = new Date(date.getTime() - (offset * 60 * 1000));
    return mappedDate.toISOString().split('T')[0];
  };

  const goToToday = () => {
    setActiveStartDate(new Date());
    setHoveredDate(null);
  };

  const handleMouseOut = () => {
    setHoveredDate(null);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = formatDateString(date);
      const bookedDresses = occupiedDatesMap[dateStr];
      
      if (bookedDresses && bookedDresses.length > 0) {
        return (
          <div className={styles.tileIndicator}>
             <span className={styles.indicatorNumber}>{bookedDresses.length}</span>
             <span className={styles.indicatorText}> Booked</span>
          </div>
        );
      }
    }
    return null;
  };

  // Add event listeners directly to tiles
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = formatDateString(date);
      if (occupiedDatesMap[dateStr]) {
        return styles.occupiedTile;
      }
    }
    return null;
  };

  return (
    <div className={`${styles.calendarContainer} glass-panel`} onMouseLeave={handleMouseOut}>
      <div className={styles.calendarHeader}>
        <button className={styles.todayButton} onClick={goToToday}>TODAY</button>
      </div>
      
      <Calendar 
        activeStartDate={activeStartDate}
        onActiveStartDateChange={({ activeStartDate }) => {
          setActiveStartDate(activeStartDate);
          setHoveredDate(null);
        }}
        tileContent={tileContent}
        tileClassName={tileClassName}
        onClickDay={(value) => {
          const dateStr = formatDateString(value);
          const dresses = occupiedDatesMap[dateStr];
          if (dresses && dresses.length > 0) {
            setHoveredDate({ date: dateStr, dresses });
          } else {
            setHoveredDate(null);
          }
        }}
      />
      
      {/* Click-based Info Panel */}
      {hoveredDate && (
        <div className={`${styles.tooltip} glass-panel`} style={{ position: 'relative', marginTop: '16px', opacity: 1, animation: 'none', pointerEvents: 'auto' }}>
          <h4>Bookings for {hoveredDate.date}</h4>
          <ul>
            {hoveredDate.dresses.map((dress, i) => (
              <li key={i}>{dress}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
