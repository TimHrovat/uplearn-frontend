import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { UsersApi } from "../../api/users/users-api";
import ErrorAlert from "../alerts/ErrorAlert";
import SuccessAlert from "../alerts/SuccessAlert";
import Loader from "../Loader";
import Modal from "./Modal";

export type UserEditModalProps = {
  active: boolean;
  modalUser: { id: string; username: string };
  onActiveChange: (active: boolean) => void;
};

export default function UserEditModal({
  active,
  onActiveChange,
  modalUser,
}: UserEditModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [gsm, setGsm] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function isValidEmail(email: string) {
    return /^\S+@\S+\.\S+/.test(email);
  }

  const handleEmailBlur = () => {
    if (!isValidEmail(email) && email !== "") {
      setError("Email is invalid");
    } else {
      setError("");
    }
  };

  const {
    status: currentUserStatus,
    data: currentUser,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => UsersApi.getUnique(modalUser.id),
    enabled: active,
  });

  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser?.data.email);
      setGsm(currentUser?.data.gsm);
      setName(currentUser?.data.name);
      setSurname(currentUser?.data.surname);
    }
  }, [active, currentUser]);

  if (!active) return <></>;

  if (currentUserStatus === "loading") return <Loader active={true} />;
  if (currentUserStatus === "error")
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
    );

  const updateUser = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const data = {
      email: email.trim(),
      name: name.trim(),
      surname: surname.trim(),
      gsm: gsm.trim(),
    };

    let k: keyof typeof data;
    for (k in data) {
      if (data[k] === "") delete data[k];
    }

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      return;
    }

    setLoading(true);

    await UsersApi.update(modalUser.id, data)
      .catch((e) => {
        setError(
          e.response.data.message ??
            "Something went wrong please try again later"
        );
      })
      .then(() => {
        setSuccess("User has been updated successfully");
        refetchUser();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <ErrorAlert msg={error} onVisibilityChange={() => setError("")} />
      <SuccessAlert msg={success} onVisibilityChange={() => setSuccess("")} />
      <Modal
        active={active}
        title={"Edit - " + modalUser.username}
        onActiveChange={(isActive) => {
          onActiveChange?.(isActive);
        }}
      >
        <div className="form-control w-full mb-5">
          <label className="label">
            <span className="label-text">Name:</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </div>
        <div className="form-control w-full mb-5">
          <label className="label">
            <span className="label-text">Surname:</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full "
            value={surname}
            onChange={(e) => setSurname(e.currentTarget.value)}
          />
        </div>
        <div className="form-control w-full mb-5">
          <label className="label">
            <span className="label-text">Email:</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full "
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            onBlur={handleEmailBlur}
          />
        </div>
        <div className="form-control w-full mb-5">
          <label className="label">
            <span className="label-text">Gsm:</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full "
            value={gsm}
            onChange={(e) => setGsm(e.currentTarget.value)}
          />
        </div>
        <button
          className={
            loading ? "btn btn-primary loading mt-5" : "btn btn-primary mt-5"
          }
          onClick={updateUser}
        >
          Update User
        </button>
      </Modal>
    </>
  );
}
