import "../styles/background.css";

function Background({ source }) {
    return (
        <div className="background" aria-hidden="true">
            <video
                className="background__video"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
            >
                <source src={source} type="video/mp4" />
            </video>

            <div className="background__overlay" />
        </div>
    );
}

export default Background;