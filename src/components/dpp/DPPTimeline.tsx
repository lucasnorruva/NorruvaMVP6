// src/components/dpp/DPPTimeline.tsx

import React from "react";

// Define a type for the events (adjust based on your actual event structure)
interface DppEvent {
  id: string;
  type: string; // e.g., "PassportMinted", "StatusUpdated"
  timestamp: number; // Unix timestamp
  data: any; // Event-specific data
}

interface DPPTimelineProps {
  events: DppEvent[];
}

const DPPTimeline: React.FC<DPPTimelineProps> = ({ events }) => {
  // Events would typically be fetched from an indexing solution like TheGraph
  // based on the DPP token ID. This component just displays the provided array.

  // Sort events by timestamp
  const sortedEvents = [...events].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="dpp-timeline-container">
      <h2>DPP Lifecycle Timeline</h2>
      <div className="timeline">
        {sortedEvents.length === 0 ? (
          <p>No events to display yet.</p>
        ) : (
          sortedEvents.map((event, index) => (
            <div key={event.id} className="timeline-item">
              <div className="timeline-timestamp">
                {new Date(event.timestamp * 1000).toLocaleString()}
              </div>
              <div className="timeline-content">
                <div className="timeline-event-type">{event.type}</div>
                {/* Display event data - customize based on your event types */}
                <pre>{JSON.stringify(event.data, null, 2)}</pre>
              </div>
            </div>
          ))
        )}
      </div>
      <style jsx>{`
        .dpp-timeline-container {
          margin-top: 20px;
          border: 1px solid #ccc;
          padding: 15px;
          border-radius: 8px;
        }
        .timeline {
          position: relative;
          margin-top: 20px;
          padding-left: 25px;
          border-left: 2px solid #eee;
        }
        .timeline-item {
          margin-bottom: 20px;
          position: relative;
        }
        .timeline-item:last-child {
          margin-bottom: 0;
        }
        .timeline-item::before {
          content: "";
          position: absolute;
          left: -31px;
          top: 5px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #0070f3; /* Example color */
          z-index: 1;
        }
        .timeline-timestamp {
          font-size: 0.9em;
          color: #555;
        }
        .timeline-content {
          margin-top: 5px;
          padding: 10px;
          background-color: #f9f9f9;
          border-radius: 5px;
          border: 1px solid #eee;
        }
        .timeline-event-type {
          font-weight: bold;
          margin-bottom: 5px;
        }
        pre {
          white-space: pre-wrap;
          word-wrap: break-word;
          font-size: 0.8em;
        }
      `}</style>
    </div>
  );
};

export default DPPTimeline;
