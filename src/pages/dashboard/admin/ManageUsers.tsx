import React from "react";
import SubpageBtnList from "../../../components/navbar/SubpageBtnList";

export default function ManageUsers() {
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <SubpageBtnList
          buttons={[
            { title: "View users", link: "/dashboard/manage-users" },
            { title: "Create user", link: "/dashboard/manage-users/create" },
          ]}
        />
      </div>
    </>
  );
}
