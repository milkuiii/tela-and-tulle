"use client";

import React, { useState, useMemo } from "react";
import Calendar from 'react-calendar';
import { useAppStore } from "@/lib/store";
import { Rental } from "@/types/database";
import { format } from "date-fns";
import styles from "./CalendarView.module.css";

export function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  const { rentals } = useAppStore();

  const occupiedDatesMap = useMemo(() => {
    const map: Record<string, Rental[]> = {};
    rentals.forEach(rental => {
      if (rental.status === 'cancelled' || rental.status === 'returned') return;
      
      let curr = new Date(rental.start_date + 'T00:00:00');
      const end = new Date(rental.end_date + 'T00:00:00');
      
      while (curr <= end) {
        const offset = curr.getTimezoneOffset();
        const mappedDate = new Date(curr.getTime() - (offset * 60 * 1000));
        const dateStr = mappedDate.toISOString().split('T')[0];
        
        if (!map[dateStr]) {
          map[dateStr] = [];
        }
        map[dateStr].push(rental);
        
        curr.setDate(curr.getDate() + 1);
      }
    });
    return map;
  }, [rentals]);

  const formatDateString = (date : Date) => {
    const offset = date.getTimezoneOffset();
    const mappedDate = new Date(date.getTime() - (offset * 60 * 1000));
    return mappedDate.toISOString().split('T')[0];
  };

  const goToToday = () => {
    const today = new Date();
    setActiveStartDate(today);
    setSelectedDate(formatDateString(today));
  };

  const tileContent = ({ date, view } : { date : Date, view : string }) => {
    if (view === 'month') {
      const dateStr = formatDateString(date);
      const bookedRentals = occupiedDatesMap[dateStr];
      
      if (bookedRentals && bookedRentals.length > 0) {
        return (
          <div className={styles.tileIndicator}>
          </div>
        );
      }
    }
    return null;
  };

  const tileClassName = ({ date, view } : { date : Date, view : string }) => {
    if (view === 'month') {
      const dateStr = formatDateString(date);
      let classes = [];
      if (occupiedDatesMap[dateStr]) {
        classes.push(styles.occupiedTile);
      }
      if (dateStr === selectedDate) {
        classes.push(styles.selectedTile);
      }
      return classes.join(' ');
    }
    return null;
  };

  // Get rentals to display in the side panel
  const displayedRentals = selectedDate 
    ? (occupiedDatesMap[selectedDate] || [])
    : [];

  // Or alternatively, if no date is selected, show all for the month
  const rentalsToShow = useMemo(() => {
    if (selectedDate) return occupiedDatesMap[selectedDate] || [];
    
    // show all rentals for the active month
    const allForMonth: Rental[] = [];
    const addedIds = new Set<string>();
    
    Object.entries(occupiedDatesMap).forEach(([dateStr, dayRentals]) => {
      const date = new Date(dateStr + 'T00:00:00');
      if (date.getMonth() === activeStartDate.getMonth() && date.getFullYear() === activeStartDate.getFullYear()) {
        dayRentals.forEach(r => {
          if (!addedIds.has(r.id)) {
            allForMonth.push(r);
            addedIds.add(r.id);
          }
        });
      }
    });
    return allForMonth;
  }, [selectedDate, occupiedDatesMap, activeStartDate]);


  return (
    <div className={styles.wrapper}>
      <div className={`${styles.calendarContainer} glass-panel`}>
        <div className={styles.calendarHeader}>
          <h2 className={styles.calendarTitle}>Events</h2>
          <button className={styles.todayButton} onClick={goToToday}>
            TODAY
          </button>
        </div>
        
        <Calendar 
          activeStartDate={activeStartDate}
          onActiveStartDateChange={({ activeStartDate }) => {
            if (activeStartDate) setActiveStartDate(activeStartDate);
            setSelectedDate(null);
          }}
          tileContent={tileContent}
          tileClassName={tileClassName}
          onClickDay={(value) => {
            const dateStr = formatDateString(value);
            setSelectedDate(dateStr);
          }}
        />
      </div>
      
      <div className={styles.eventsContainer}>
        {rentalsToShow.length > 0 ? (
          rentalsToShow.map((rental, idx) => {
            const startD = new Date(rental.start_date + 'T00:00:00');
            return (
              <div key={`${rental.id}-${idx}`} className={`${styles.eventCard} glass-panel`}>
                <div className={styles.eventDateBlock}>
                  <span className={styles.eventDay}>{format(startD, 'd')}</span>
                  <span className={styles.eventDayName}>{format(startD, 'EEE').toUpperCase()}</span>
                </div>
                <div className={styles.eventDetails}>
                  <h4 className={styles.eventTitle}>{rental.dress?.name || 'Dress'}</h4>
                  <p className={styles.eventDesc}>{rental.customer?.full_name || 'Customer'} - {rental.status}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className={`${styles.emptyEvents} glass-panel`}>
            <p>No bookings for {selectedDate ? format(new Date(selectedDate + 'T00:00:00'), 'MMM d, yyyy') : 'this month'}.</p>
          </div>
        )}
      </div>
    </div>
  );
}
