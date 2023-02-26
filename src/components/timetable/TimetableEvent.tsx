import React, { useState } from "react";
import { EventInterface } from "../../api/events/events-api";
import EventInfoModal from "../modals/events/EventInfoModal";

interface TimetableEventInterface {
  event: EventInterface;
  onClose: () => any;
}

export default function TimetableEvent({
  event,
  onClose,
}: TimetableEventInterface) {
  const [eventInfoModalActive, setEventInfoModalActive] = useState(false);

  return (
    <>
      <EventInfoModal
        event={event}
        active={eventInfoModalActive}
        onActiveChange={(active) => {
          setEventInfoModalActive(active);
          onClose();
        }}
      />
      <div
        className="hover:bg-primary rounded-md cursor-pointer p-2"
        onClick={() => setEventInfoModalActive(true)}
      >
        <div className="block w-full">
          <span className="font-bold mr-8">
            {event.type === "ACT" ? "ACTIVITY" : event.type}
          </span>
        </div>
        {event.type === "ACT" ? (
          <span className="font-thin block">
            {event.startTime + "-" + event.endTime}
          </span>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
