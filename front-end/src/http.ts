/* eslint-disable react-hooks/rules-of-hooks */
import dayjs from "dayjs";
import { serviceProto } from "./shared/protocols/serviceProto";
import { BaseResponse } from "./shared/protocols/base";
import React from "react";
import {
  ApiReturn,
  ApiReturnSucc,
  HttpClient,
  HttpClientOptions,
  HttpClientTransportOptions,
} from "tsrpc-browser";
import { BaseServiceType, ServiceProto, TsrpcError } from "tsrpc-proto";
import {
  QueryClient,
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";
import { UseQueryOptions } from "@tanstack/react-query/src/types";

let publicStorage: BaseResponse["_publicData"] = undefined;
export const queryClient = new QueryClient();

function checkExpired(expires: number | null | undefined) {
  if (expires) {
    return dayjs().isBefore(dayjs(expires));
  }
  return false;
}

class NewHttpClient<
  ServiceType extends BaseServiceType
> extends HttpClient<ServiceType> {
  constructor(
    proto: ServiceProto<ServiceType>,
    options: Partial<HttpClientOptions>
  ) {
    super(proto, options);
  }

  isSuccess<T extends string & keyof ServiceType["api"]>(
    data: ApiReturn<ServiceType["api"][T]["res"]>
  ): data is ApiReturnSucc<ServiceType["api"][T]["res"]> {
    return data.isSucc;
  }

  callApiCatch<T extends string & keyof ServiceType["api"]>(
    apiName: T,
    req: ServiceType["api"][T]["req"],
    options?: HttpClientTransportOptions
  ): Promise<ServiceType["api"][T]["res"]> {
    return new Promise((resolve, reject) => {
      this.callApi(apiName, req, options)
        .then((data) => {
          if (this.isSuccess(data)) {
            return resolve(data.res);
          } else {
            return reject(data.err);
          }
        })
        .catch(reject);
    });
  }

  getPublicData(key: string) {
    if (!publicStorage) {
      return undefined;
    }
    if (publicStorage[key] && checkExpired(publicStorage[key]?.[0])) {
      return publicStorage[key]?.[1];
    }
    return undefined;
  }

  usePublicData(key: string) {
    const [value, setValue] = React.useState(this.getPublicData(key));

    React.useEffect(() => {
      setValue(this.getPublicData(key));
    }, [key]);

    return value;
  }

  useQuery<T extends string & keyof ServiceType["api"]>(
    apiName: T,
    req: ServiceType["api"][T]["req"],
    options?: Omit<
      UseQueryOptions<
        ServiceType["api"][T]["req"],
        TsrpcError,
        ServiceType["api"][T]["res"],
        [T, ServiceType["api"][T]["req"]]
      >,
      "queryKey" | "queryFn" | "initialData"
    > & { initialData?: () => undefined }
  ) {
    return useQuery<
      ServiceType["api"][T]["req"],
      TsrpcError,
      ServiceType["api"][T]["res"],
      [T, ServiceType["api"][T]["req"]]
    >([apiName, req], () => this.callApiCatch(apiName, req), options);
  }

  useMutation<T extends string & keyof ServiceType["api"]>(
    name: T,
    options?: Omit<
      UseMutationOptions<
        ServiceType["api"][T]["res"],
        TsrpcError,
        ServiceType["api"][T]["req"],
        unknown
      >,
      "mutationFn"
    >
  ) {
    return useMutation((params: ServiceType["api"][T]["req"] = {}) => {
      return this.callApiCatch(name, params);
    }, options);
  }
}

// 创建全局唯一的 apiClient，需要时从该文件引入
export const apiClient = new NewHttpClient(serviceProto, {
  server: "http://localhost:3000",
  json: true,
  logApi: true,
  logMsg: true,
});

apiClient.flows.preCallApiFlow.push((node) => {
  if (!publicStorage) {
    const localData = localStorage.getItem("publicData");
    if (localData) {
      publicStorage = JSON.parse(localData);
    }
  }
  // 附加公共数据
  if (publicStorage) {
    node.req._publicData = publicStorage;
  }
  // 附加请求时间
  node.req._timestamp = Date.now().valueOf();
  // 附加token
  const token = localStorage.getItem("token");
  if (token) {
    node.req._token = token;
  }
  return node;
});

apiClient.flows.preApiReturnFlow.push(async (node) => {
  if (node.return && node.return.res && node.return.res._publicData) {
    publicStorage = node.return.res._publicData;
    localStorage.setItem("publicData", JSON.stringify(publicStorage));
  }
  if (node.return.err?.code === "NOT_LOGIN") {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
  return node;
});

export default apiClient;
