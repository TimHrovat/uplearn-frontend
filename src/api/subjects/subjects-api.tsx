import axios from "axios";

const url = "/subjects";

export const SubjectsApi = {
    createFromObject: async (data: subjectData) => {
        return await axios.post(url + "/create-many", data)
    },
    getAll: async () => {
        return await axios.get(url);
    }
};

type subjectData = {
    abbreviation: string;
    name: string;
    description?: string;
    teachers?: { label: string; value: string }[];
}