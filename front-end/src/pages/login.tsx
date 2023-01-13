import { Button, Form, Input, message } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../http";

type FormType = {
  username: string;
  password: string;
};

export const LoginPage = () => {
  const { mutateAsync, error } = apiClient.useMutation("user/Login");
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const onSubmit = async (values: FormType) => {
    const data = await mutateAsync(values);
    localStorage.setItem("token", data.token);
    messageApi.open({
      type: "success",
      content: "登录成功",
    });
    navigate("/");
  };
  useEffect(() => {
    if (error) {
      messageApi.open({
        type: "error",
        content: error.message,
      });
    }
  }, [error]);
  return (
    <>
      {contextHolder}
      <div className="bg-[#FFFFFF] w-[100vw] h-[100vh] flex flex-row items-center">
        <div className="py-10 px-10 w-100 h-80 rounded bg-[#FFFFFF] border border-solid border-[#dee0e3] shadow-md mx-auto flex flex-col items-center">
          <h1 className="text-10 font-bold">Login</h1>
          <Form className="flex flex-col items-center" onFinish={onSubmit}>
            <Form.Item name="username" rules={[{ required: true, min: 3 }]}>
              <Input className="w-70" placeholder="用户名" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, min: 3 }]}>
              <Input className="w-70" placeholder="密码" />
            </Form.Item>
            <Form.Item>
              <Button type="default" className="" htmlType="submit">
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};
