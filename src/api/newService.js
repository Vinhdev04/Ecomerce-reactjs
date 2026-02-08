import axiosClient from "./axiosClient";

const newService = {
    getAllNews: () => {
        const url = '/news';
        return axiosClient.get(url);
    },
    
    getNewsDetail: (id) => {
        const url = `/news/${id}`;
        return axiosClient.get(url);
    }
};

export default newService;
