import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { AuthApi } from "../../../api/auth/auth-api";
import { UsersApi } from "../../../api/users/users-api";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import Loader from "../../../components/Loader";
import ConfirmDeletePopup from "../../../components/modals/ConfirmDeletePopup";
import SubpageBtnList from "../../../components/navbar/SubpageBtnList";

export default function ManageUsers() {
  const [confirmDeletePopupActive, setConfirmDeletePopupActive] =
    useState(false);
  const [modalUser, setModalUser] = useState({ id: "", username: "" });
  const [error, setError] = useState("");

  const {
    status: statusUsers,
    data: users,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => UsersApi.getAll(AuthApi.getJwtPayload("token").id),
  });

  if (statusUsers === "loading") return <Loader active={true} />;
  if (statusUsers === "error")
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
    );

  const deleteUser = async (id: string) => {
    await UsersApi.delete(id).catch((e) => {
      setError(e.response.data.message ?? e.message);
    });
  };

  return (
    <>
      <ErrorAlert msg={error} onVisibilityChange={(msg) => setError(msg)} />
      <ConfirmDeletePopup
        active={confirmDeletePopupActive}
        onActiveChange={(active) => setConfirmDeletePopupActive(active)}
        deleteFunction={() => deleteUser(modalUser.id)}
        prompt={`Are you sure you want to delete user ${modalUser.username}?`}
      />

      <div className="flex flex-col justify-center items-center">
        <SubpageBtnList
          buttons={[
            { title: "View users", link: "/dashboard/manage-users" },
            { title: "Create user", link: "/dashboard/manage-users/create" },
          ]}
        />

        <div className="bg-base-200 p-4 rounded-xl desktop:min-w-fit w-full mb-5">
          <h1 className="text-xl font-bold mb-5">View Users</h1>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Surname</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Gsm</th>
                  <th>Role</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {users?.data.map((user: UserInterface, index: number) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.surname}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.gsm ? user.gsm : "/"}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        className="btn btn-error"
                        onClick={() => {
                          setConfirmDeletePopupActive(true);
                          setModalUser({
                            id: user.id,
                            username: user.username,
                          });
                        }}
                      >
                        <FontAwesomeIcon icon={faTrashCan} size="lg" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

interface UserInterface {
  id: string;
  name: string;
  surname: string;
  username: string;
  email: string;
  gsm: string;
  role: string;
}
