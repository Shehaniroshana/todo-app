import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

@Component({
  selector: 'app-calendar-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-component.component.html',
  styleUrls: ['./calendar-component.component.css']
})
export class CalendarComponentComponent implements OnInit {
  calendarDays: CalendarDay[] = [];
  currentMonth: string;
  currentYear: number;
  selectedDay: CalendarDay | null = null;
  private currentDate: Date = new Date(); // Initialized to current date (e.g., July 25, 2025)
  private months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor() {
    this.currentMonth = this.months[this.currentDate.getMonth()];
    this.currentYear = this.currentDate.getFullYear();
  }

  ngOnInit() {
    this.generateCalendar();
  }

  generateCalendar() {
    this.calendarDays = [];
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonth = new Date(year, month, 0);
    const prevMonthDaysCount = prevMonth.getDate();

    // Add previous month days
    for (let i = firstDay; i > 0; i--) {
      this.calendarDays.push({
        day: prevMonthDaysCount - i + 1,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false
      });
    }

    // Add current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && day === today.getDate();
      const isSelected = isToday; // Auto-select today if in current month
      const calendarDay: CalendarDay = {
        day,
        isCurrentMonth: true,
        isToday,
        isSelected
      };
      this.calendarDays.push(calendarDay);

      // Set selectedDay to today if in current month
      if (isSelected) {
        this.selectedDay = calendarDay;
      }
    }

    // Add next month days
    const totalDays = this.calendarDays.length;
    const remainingDays = 42 - totalDays;
    for (let day = 1; day <= remainingDays; day++) {
      this.calendarDays.push({
        day,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false
      });
    }

    // Update month and year display
    this.currentMonth = this.months[month];
    this.currentYear = year;
  }

  prevMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.selectedDay = null; // Reset selected day when changing months
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.selectedDay = null; // Reset selected day when changing months
    this.generateCalendar();
  }

  selectDay(day: CalendarDay) {
    if (!day.isCurrentMonth) return;
    this.calendarDays.forEach(d => d.isSelected = false);
    day.isSelected = true;
    this.selectedDay = day;
  }

  handleKeydown(event: KeyboardEvent, day: CalendarDay) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectDay(day);
    }
  }
}