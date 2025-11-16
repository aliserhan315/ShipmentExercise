import type { Response } from "express";

export const success = (res: Response,data: any = {},message = "OK", status = 200) => 
{
    return res.status(status).json({
    success: true,
    message,
    data,
    });
}
export const errorresponse = (res: Response,message = "Something went wrong",status = 500) =>
     {
  return res.status(status).json({
    success: false,
    message,
  });
};
