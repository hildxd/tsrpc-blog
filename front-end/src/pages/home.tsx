import apiClient from "../http";

export const HomePage = () => {
  const { data, isLoading, error } = apiClient.useQuery("post/GetAllPost", {
    page: 1,
    pageSize: 20,
  });
  if (error) {
    console.log(error);
  }
  return <div>home page</div>;
};
