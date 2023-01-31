import React from "react";
import SubpageBtnList from "../../../components/navbar/SubpageBtnList";

export default function ManageSubjects() {
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <SubpageBtnList
          buttons={[
            { title: "View subjects", link: "/dashboard/manage-subjects" },
            {
              title: "Create subject",
              link: "/dashboard/manage-subjects/create",
            },
            {
              title: "Create subject list",
              link: "/dashboard/manage-subjects/create-list",
            },
          ]}
        />
      </div>
    </>
  );
}
