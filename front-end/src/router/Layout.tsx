import { Outlet, useLocation } from "react-router-dom";

export const Layout = () => {
  const location = useLocation();
  return (
    <div>
      {location.pathname !== "/login" && (
        <div className="h-15 bg-red flex px-10 items-center justify-between border-b border-solid border-[#dee0e3]">
          <div className="text-6 font-bold text-white">Blog</div>
          <div className="flex items-center">
            <div className="text-4 mr-10 hover:text-blue cursor-pointer text-white">
              首页
            </div>
          </div>
        </div>
      )}
      <Outlet />
    </div>
  );
};
