import axios from "axios";

export const GET_POST = "GET_POST";

export const getPost = () => {
  return (dispatch: any) => {
    return axios.get("http://localhost:3001/").then((res) => {
      console.log(res);
    });
  };
};

export const GET_LOG = "GET_LOG";
