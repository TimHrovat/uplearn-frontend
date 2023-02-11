import axios from "axios";

const url = "/subject-lists";

export const SubjectListsApi = {
    create: async (data: subjectListData) => {
        return await axios.post(url + "/create", data);
    },
    getAll: async () => {
        return await axios.get(url);
    },
    delete: async (id: string) => {
        return await axios.delete(url + "/" + id)
    }
};

type subjectListData = {
    name: string;
    subjects?: { label: string; value: string }[];
}