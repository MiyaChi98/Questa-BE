export type ResponseSuccess<T> = {
  type: "success";
  statusCode: number;
  data: T;
};

export type ResponseError = {
  type: "error";
  statusCode: number;
  detail: string | object;
  method: string;
  path: string;
};
