import { format, isToday, isTomorrow, isPast, parseISO, startOfDay } from "date-fns";

export const formatDate = (date) => {
  if (!date) return null;
  
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  
  if (isToday(parsedDate)) {
    return "Today";
  }
  
  if (isTomorrow(parsedDate)) {
    return "Tomorrow";
  }
  
  return format(parsedDate, "MMM d");
};

export const formatFullDate = (date) => {
  if (!date) return "";
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  return format(parsedDate, "yyyy-MM-dd");
};

export const isOverdue = (date) => {
  if (!date) return false;
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  return isPast(startOfDay(parsedDate)) && !isToday(parsedDate);
};

export const getDueDateStatus = (date) => {
  if (!date) return "none";
  
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  
  if (isOverdue(parsedDate)) {
    return "overdue";
  }
  
  if (isToday(parsedDate)) {
    return "today";
  }
  
  if (isTomorrow(parsedDate)) {
    return "tomorrow";
  }
  
  return "upcoming";
};