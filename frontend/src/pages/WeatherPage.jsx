import { useNavigate } from "react-router";

function WeatherPage() {
    const navigate = useNavigate();

    return (
        <main
            style={{
                minHeight: "100vh",
                padding: "2rem",
                color: "white",
                background: "#07111f",
            }}
        >
            <button type="button" onClick={() => navigate("/")}>
                Back
            </button>

            <h1>Weather</h1>
            <p>The weather interface will go here.</p>
        </main>
    );
}

export default WeatherPage;