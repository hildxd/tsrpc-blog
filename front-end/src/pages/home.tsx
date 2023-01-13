import apiClient from "../http";
import useUserStore from "../store/user";
import dayjs from "dayjs";
import { useMount } from "ahooks";
import { Pagination } from "antd";
import { useState } from "react";
import { ResGetAllPost } from "../shared/protocols/post/PtlGetAllPost";

export const HomePage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [posts, setPosts] = useState<ResGetAllPost>();

  const { mutateAsync } = apiClient.useMutation("post/GetAllPost");
  useMount(() => {
    mutateAsync({ page, pageSize }).then((data) => setPosts(data));
  });
  const { user } = useUserStore();

  const onPageChange = async (page: number) => {
    setPage(page);
    const data = await mutateAsync({ page, pageSize });
    setPosts(data);
  };

  const onPageSizeChange = async (pageSize: number) => {
    setPageSize(pageSize);
    const data = await mutateAsync({ page, pageSize });
    setPosts(data);
  };
  return (
    <div className="py-4 px-4 flex flex-col">
      <div className="flex items-center">
        {user?.tags.map((tag) => (
          <div
            key={tag.id}
            className="hover:text-red cursor-pointer [&:not(:last-child)]:mr-3 py-1 px-4 border border-solid border-[#dee0e3] rounded-full text-[#666]"
          >
            {tag.name}
          </div>
        ))}
      </div>
      <div className="flex items-center self-end">
        <div className="px-4 py-3 bg-red text-white rounded-[20px] ">
          创建文章
        </div>
      </div>

      <div className="flex flex-col mt-4 items-center">
        {posts?.posts.map((post) => {
          return (
            <div className="py-4 px-5 flex flex-col justify-between w-200 h-30 border border-solid border-[#dee0e3] rounded [&:not(:first-child)]:mt-3">
              <div className="font-bold text-5">{post.title}</div>
              <div className="text-4">{post.content}</div>
              <div className="">
                {dayjs(post.createTime).format("YYYY-MM-DD")}
              </div>
            </div>
          );
        })}
      </div>

      <div className="self-center py-5">
        <Pagination
          current={page}
          total={posts?.count ?? 0}
          showSizeChanger
          onChange={onPageChange}
          onShowSizeChange={onPageSizeChange}
        />
      </div>
    </div>
  );
};
