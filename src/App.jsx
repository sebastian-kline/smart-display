import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./App.css";

function App() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
      <div className="app">

        {/* Lava Lamp Background */}
        <div className="background">

          <motion.div
              className="blob blob1"
              animate={{
                x: [0, 120, -60, 0],
                y: [0, -80, 60, 0],
                scale: [1, 1.2, 0.9, 1]
              }}
              transition={{
                duration: 45,
                repeat: Infinity,
                ease: "easeInOut"
              }}
          />

          <motion.div
              className="blob blob2"
              animate={{
                x: [0, -140, 70, 0],
                y: [0, 100, -60, 0],
                scale: [1, .8, 1.3, 1]
              }}
              transition={{
                duration: 55,
                repeat: Infinity,
                ease: "easeInOut"
              }}
          />

          <motion.div
              className="blob blob3"
              animate={{
                x: [0, 60, -90, 0],
                y: [0, -120, 80, 0],
                scale: [1, 1.4, .9, 1]
              }}
              transition={{
                duration: 60,
                repeat: Infinity,
                ease: "easeInOut"
              }}
          />

        </div>

        {/* Clock */}

        <div className="clockContainer">

          <motion.div
              key={time.getMinutes()}
              initial={{ opacity: .6 }}
              animate={{ opacity: 1 }}
              transition={{ duration: .35 }}
              className="clock"
          >
            {time.toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
          </motion.div>

          <div className="date">
            {time.toLocaleDateString([], {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>

        </div>

        {/* Bottom Left */}

        <div className="cpu">
          CPU -- °C
        </div>

      </div>
  );
}

export default App;