import {
  faLock,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { AuthApi } from "../../../api/auth/auth-api";
import { UsersApi } from "../../../api/users/users-api";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import SuccessAlert from "../../../components/alerts/SuccessAlert";
import Loader from "../../../components/Loader";
import ConfirmDeletePopup from "../../../components/modals/ConfirmDeletePopup";
import ConfirmWarningPopup from "../../../components/modals/ConfirmWarningPoup";
import UserEditModal from "../../../components/modals/UserEditModal";
import SubpageBtnList from "../../../components/navbar/SubpageBtnList";

export default function ManageUsers() {
  const [confirmDeletePopupActive, setConfirmDeletePopupActive] =
    useState(false);
  const [userSendInfoModalActive, setUserSendInfoModalActive] = useState(false);
  const [userEditModalActive, setUserEditModalActive] = useState(false);
  const [modalUser, setModalUser] = useState({ id: "", username: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as HTMLInputElement;

    setSearch(target.value);
  };

  const {
    status: statusUsers,
    data: users,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => UsersApi.getAll(AuthApi.getJwtPayload("token").id),
  });

  let data = {
    nodes: users?.data.filter(
      (user: UserInterface) =>
        user.name.includes(search) ||
        user.surname.includes(search) ||
        user.username.includes(search) ||
        user.email.includes(search) ||
        user.gsm.includes(search) ||
        user.role.includes(search)
    ),
  };

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

  const resendCredentials = async (id: string) => {
    setLoading(true);
    await AuthApi.resendCredentials(id)
      .catch((e) => {
        setError(e.response.data.message ?? e.message);
      })
      .then((res) => {
        if (res) setSuccess("Credentials sent successfully");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const toDateString = (isodate: string) => {
    const date = new Date(isodate);

    const dateStr: string = `${date.getDate()}. ${
      date.getMonth() + 1
    }. ${date.getFullYear()}`;

    return dateStr;
  };

  return (
    <>
      <ErrorAlert msg={error} onVisibilityChange={(msg) => setError(msg)} />
      <SuccessAlert
        msg={success}
        onVisibilityChange={(msg) => setSuccess(msg)}
      />
      <ConfirmDeletePopup
        active={confirmDeletePopupActive}
        onActiveChange={(active) => setConfirmDeletePopupActive(active)}
        deleteFunction={() => {
          deleteUser(modalUser.id);
          refetchUsers();
        }}
        prompt={`Are you sure you want to delete user ${modalUser.username}?`}
      />
      <ConfirmWarningPopup
        active={userSendInfoModalActive}
        onActiveChange={(active) => setUserSendInfoModalActive(active)}
        warningFn={() => resendCredentials(modalUser.id)}
        prompt={`Are you sure you want to send ${modalUser.username} his/her login credentials again?`}
      />
      <UserEditModal
        active={userEditModalActive}
        modalUser={modalUser}
        onActiveChange={(active) => {
          setUserEditModalActive(active);
          refetchUsers();
          window.location.reload();
        }}
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
          <div className="form-control desktop:w-1/3 w-full mb-5">
            <label className="label">Search users:</label>
            <input
              type="text"
              className="input input-bordered input-primary w-full "
              onChange={handleSearch}
              value={search}
            />
          </div>
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
                  <th>Birthdate</th>
                  <th>Role</th>
                  <th>Edit</th>
                  <th>Resend credentials</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {data.nodes.map((user: UserInterface, index: number) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.surname}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.gsm ? user.gsm : "/"}</td>
                    <td>{toDateString(user.dateOfBirth)}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-outline"
                        onClick={() => {
                          setUserEditModalActive(true);
                          setModalUser({
                            id: user.id,
                            username: user.username,
                          });
                        }}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-warning btn-outline"
                        onClick={() => {
                          setUserSendInfoModalActive(true);
                          setModalUser({
                            id: user.id,
                            username: user.username,
                          });
                        }}
                      >
                        <FontAwesomeIcon icon={faLock} size="lg" />
                      </button>
                    </td>
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
      <Loader active={loading} />
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
  dateOfBirth: string;
}
