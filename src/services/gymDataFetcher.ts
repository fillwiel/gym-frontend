import axios from 'axios';
import { parse } from 'node-html-parser';
import { GymClass } from '../types';

const BASE_URL = "https://atmosfera-lodz.cms.efitness.com.pl/kalendarz-zajec?view=DayByHour&day=";

export const fetchDataForDate = async (date: string): Promise<GymClass[]> => {
  try {
    const response = await axios.get(`${BASE_URL}${date}`, {
    });
    
    const root = parse(response.data);
    const rows = root.querySelectorAll("table.calendar_table_day tr");
    const parsedData: GymClass[] = [];

    rows.forEach((row) => {
      const hour = row.querySelector("td.hour")?.textContent?.trim();
      const event = row.querySelector("div.event");
      
      if (hour && event) {
        const id = event.getAttribute("meta:id");
        const title = event.querySelector("p.event_name")?.textContent?.trim();
        const availabilityNumber = event.querySelector("span.availability-number")?.textContent?.trim();
        
        if (id && title && availabilityNumber) {
          // Create ISO string for scheduledTime
          const [hourPart, minutePart] = hour.split(':');
          const classDate = new Date(date);
          classDate.setHours(parseInt(hourPart), parseInt(minutePart), 0, 0);
          
          parsedData.push({
            id,
            date,
            hour,
            title,
            availabilityNumber,
            scheduledTime: classDate.toISOString(),
          });
        }
      }
    });

    return parsedData.sort((a, b) => a.hour.localeCompare(b.hour));
  } catch (err) {
    console.error(`Error fetching date ${date}:`, err);
    return [];
  }
};

export const fetchAllClassData = async (days: number = 14): Promise<GymClass[]> => {
  const today = new Date();
  const promises: Promise<GymClass[]>[] = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const formatted = date.toISOString().split("T")[0];
    promises.push(fetchDataForDate(formatted));
  }
  
  try {
    const results = await Promise.all(promises);
    return results.flat();
  } catch (error) {
    console.error('Error fetching all class data:', error);
    return [];
  }
};