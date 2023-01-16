import apiClient from "../http";
import useUserStore from "../store/user";
import dayjs from "dayjs";
import { useMount, useUpdateEffect } from "ahooks";
import { Pagination } from "antd";
import { useState } from "react";
import { ResGetAllPost } from "../shared/protocols/post/PtlGetAllPost";
import { clsx } from "clsx";

export const HomePage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [posts, setPosts] = useState<ResGetAllPost>();
  const [activeTagId, setActiveTagId] = useState(-999);

  const { mutateAsync } = apiClient.useMutation("post/GetAllPost");
  useMount(() => {
    mutateAsync({ page, pageSize, tagId: activeTagId }).then((data) =>
      setPosts(data)
    );
  });
  const { user } = useUserStore();

  useUpdateEffect(() => {
    mutateAsync({ page, pageSize, tagId: activeTagId }).then(setPosts);
  }, [activeTagId, page, pageSize]);
  return (
    <div className="py-4 px-4 flex flex-col">
      <div className="flex items-center gap-x-4">
        {user?.tags.map((tag) => (
          <div
            key={tag.id}
            className={clsx(
              "hover:text-red cursor-pointer py-1 px-4 border border-solid border-[#dee0e3] rounded-full text-[#666]",
              {
                "text-white": activeTagId === tag.id,
                "bg-blue": activeTagId === tag.id,
              }
            )}
            onClick={() => setActiveTagId(tag.id)}
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
            <div className="py-4 px-5 flex flex-col justify-between w-200  border border-solid border-[#dee0e3] rounded [&:not(:first-child)]:mt-3">
              <div className="font-bold text-5">{post.title}</div>
              <div className="text-4 line-2">{post.content}</div>
              <div className="flex justify-between items-center mt-4">
                <div>{dayjs(post.createdAt).format("YYYY-MM-DD")}</div>
                <div className="flex items-center">
                  {post.tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="px-4 py-2 rounded-[20px] bg-red text-white"
                    >
                      # {tag.name}
                    </div>
                  ))}
                </div>
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
          onChange={setPage}
          onShowSizeChange={setPageSize}
        />
      </div>
    </div>
  );
};
