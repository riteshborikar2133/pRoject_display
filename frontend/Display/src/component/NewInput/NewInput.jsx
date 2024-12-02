import React, { useState } from 'react'
import "./NewInput.css"
export default function NewInput() {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('Notice');
    const [importance, setImportance] = useState('Low');
    const [author, setAuthor] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const noticeData = {
            title,
            message,
            type,
            importance,
            author,
        };

        try {
            const response = await fetch('http://localhost:5000/api/notices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(noticeData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Notice submitted:', result);
                // Reset the form
                setTitle('');
                setMessage('');
                setType('Notice');
                setImportance('Low');
                setAuthor('');
            } else {
                setError('Error submitting notice');
            }
        } catch (error) {
            setError('Error: ' + error.message);
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2>Submit a Notice</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Message:</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Type:</label>
                        <select value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="Notice">Notice</option>
                            <option value="Announcement">Announcement</option>
                        </select>
                    </div>
                    <div>
                        <label>Importance:</label>
                        <select value={importance} onChange={(e) => setImportance(e.target.value)}>
                            <option value="Low">Low</option>
                            <option value="Moderate">Moderate</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <div>
                        <label>Author:</label>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="error">{error}</div>}
                    <button type="submit">Submit Notice</button>
                </form>
            </div>
        </div>
    );
};
