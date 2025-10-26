import { createContext, useContext, useState } from "react";

const StatsContext = createContext();

export const StatsProvider = ({ children }) => {
  const [stats, setStats] = useState(null);        // AdminHome stats
  const [doctors, setDoctors] = useState(null);    // DoctorsSchedule
  const [appointments, setAppointments] = useState(null); // AdminDashBoard & DoctorDashboard
  const [tasks, setTasks] = useState(null);        // Office tasks

  return (
    <StatsContext.Provider
      value={{
        stats, setStats,
        doctors, setDoctors,
        appointments, setAppointments,
        tasks, setTasks
      }}
    >
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => useContext(StatsContext);
