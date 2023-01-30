import React from "react";
import SubpageBtnList from "../../../components/navbar/SubpageBtnList";

export default function ManageClasses() {
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <SubpageBtnList
          buttons={[
            { title: "View classes", link: "/dashboard/manage-classes" },
            { title: "Create class", link: "/dashboard/manage-classes/create" },
          ]}
        />
      </div>
    </>
  );
}
