// NoticeCarousel.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Notice.css";

const NoticeCarousel = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch notices from the Flask API
        const fetchNotices = async () => {
            try {
                var data;
                const response = await axios.get("http://127.0.0.1:5000/api/circulars")
                    .then((e) => {
                        console.log(e)
                        data = JSON.parse(e.data.data);

                    })

                // Sort notices by importance (High -> Moderate -> Low)
                const sortedNotices = await data.sort((a, b) => {
                    const importanceOrder = { High: 1, Moderate: 2, Low: 3 };
                    return importanceOrder[a.priority] - importanceOrder[b.priority];
                });
                setNotices(sortedNotices);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching notices:", error);
                setLoading(false);
            }
        };
        fetchNotices();
    }, []);

    return (
        <div className="notice-container">
            <div className="notice-carousel-container">
                {loading ? (
                    <p>Loading notices...</p>
                ) : (
                    <Carousel
                        autoPlay
                        infiniteLoop
                        interval={3000}
                        showThumbs={false}
                        showStatus={false}
                        transitionTime={500}
                    >
                        {notices.map((notice) => (
                            <div key={notice._id} className={`notice-card ${notice.priority.toLowerCase()}`}>
                                <h3>{notice.title}</h3>
                                <p>{notice.message}</p>
                                <span className="importance-label">{notice.priority}</span>
                            </div>
                        ))}
                    </Carousel>
                )}
            </div>
        </div>
    );
};

export default NoticeCarousel;
