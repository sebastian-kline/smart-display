import CpuTemperatureWidget from "./CpuTemperatureWidget.jsx";
import "../styles/system.css";

function StatusBar() {
    return (
        <footer className="status-bar" aria-label="System status">
            <CpuTemperatureWidget />
        </footer>
    );
}

export default StatusBar;