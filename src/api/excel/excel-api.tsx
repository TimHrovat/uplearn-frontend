import axios from "axios";

const url = "/excel";

export const ExcelApi = {
  template: async () => {
    return await axios.get(url + "/template");
  },
  importUsers: async (file: any) => {
    const form = new FormData();
    form.append("import", file, "import.xlsx");

    return await axios.post(url + "/add-users-excel", form);
  },
};
