import moment from "moment";
import React, { useState } from "react";
import { AuthApi } from "../../../api/auth/auth-api";
import { EventInterface, EventsApi } from "../../../api/events/events-api";
import ErrorAlert from "../../alerts/ErrorAlert";
import Modal from "../Modal";
import ConfirmDeletePopup from "../popups/ConfirmDeletePopup";

interface EventInfoModalProps {
  event: EventInterface;
  active: boolean;
  onActiveChange: (active: boolean) => void;
}

export default function EventInfoModal({
  event,
  active,
  onActiveChange,
}: EventInfoModalProps) {
  const [confirmDeletePopupActive, setConfirmDeletePopupActive] =
    useState(false);
  const [error, setError] = useState("");

  const deleteEvent = async () => {
    await EventsApi.delete(event.id);

    onActiveChange(false);
  };

  return (
    <>
      <ConfirmDeletePopup
        active={confirmDeletePopupActive}
        onActiveChange={(active) => setConfirmDeletePopupActive(active)}
        deleteFunction={() => deleteEvent()}
        prompt={
          "Are you sure you want to delete this event? This action will also delete the event for everyone else."
        }
      />
      <ErrorAlert msg={error} onVisibilityChange={(msg) => setError(msg)} />
      <Modal
        active={active}
        title={"Event Info"}
        onActiveChange={(isActive) => onActiveChange?.(isActive)}
      >
        <div className="overflow-x-auto">
          <table className="table w-full">
            <tbody>
              <tr>
                <th className="w-1/3">Type: </th>
                <td className="w-2/3">{event.type}</td>
              </tr>
              <tr>
                <th className="w-1/3">Date: </th>
                <td className="w-2/3">{moment(event.date).format("LL")}</td>
              </tr>
              {event.type === "ACT" ? (
                <>
                  <tr>
                    <th className="w-1/3">Start Time: </th>
                    <td className="w-2/3">{event.startTime}</td>
                  </tr>
                  <tr>
                    <th className="w-1/3">Start Time: </th>
                    <td className="w-2/3">{event.endTime}</td>
                  </tr>
                </>
              ) : (
                <></>
              )}
              <tr>
                <th className="w-1/3">Description: </th>
                <td className="w-2/3 whitespace-normal break-words">
                  {event.description}
                </td>
              </tr>
              <tr>
                <th className="w-1/3">Employees: </th>
                <td className="w-2/3 whitespace-normal break-words">
                  {event.Event_Teacher.map((e, index: number) => (
                    <span key={index}>
                      {event.Event_Teacher.length - 1 === index
                        ? `${e.employee.user.name} ${e.employee.user.surname}`
                        : `${e.employee.user.name} ${e.employee.user.surname}, `}
                    </span>
                  ))}
                </td>
              </tr>
              <tr>
                <th className="w-1/3">Classes: </th>
                <td className="w-2/3 whitespace-normal break-words">
                  {event.Event_Class.map((c, index: number) => (
                    <span key={index}>
                      {event.Event_Class.length - 1 === index
                        ? c.class.name
                        : c.class.name + ", "}
                    </span>
                  ))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {AuthApi.isAdmin() ? (
          <button
            className="btn btn-outline btn-error mt-5 mr-5"
            onClick={() => setConfirmDeletePopupActive(true)}
          >
            Delete Event
          </button>
        ) : (
          <></>
        )}
      </Modal>
    </>
  );
}
