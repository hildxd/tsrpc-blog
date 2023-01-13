import { Outlet, useLocation } from "react-router-dom";
import { useAsyncEffect } from "ahooks";
import useUserStore from "../store/user";

export const Layout = () => {
  const location = useLocation();
  const { user, getUser, logout } = useUserStore();
  useAsyncEffect(async () => {
    await getUser();
  }, []);
  return (
    <div className="w-screen h-screen">
      {location.pathname !== "/login" && (
        <div className="h-[55px] bg-red flex px-10 items-center justify-between border-b border-solid border-[#dee0e3]">
          <div className="text-6 font-bold text-white">Blog</div>
          <div className="flex items-center">
            <div className="text-4 mr-10 hover:text-blue cursor-pointer text-white">
              首页
            </div>
            <div className="text-4 mr-10 hover:text-blue cursor-pointer text-white">
              {user?.nickName}
            </div>
            <div
              className="text-4 hover:text-blue cursor-pointer text-white"
              onClick={logout}
            >
              退出登录
            </div>
          </div>
        </div>
      )}
      <div className="h-[calc(100vh-55px)] overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};
