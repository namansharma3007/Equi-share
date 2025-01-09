import { NextResponse } from "next/server";

class ResponseUtil  {
  static createResponse(data: any, message: string, status: number) {
    return NextResponse.json({ message, data }, { status });
  }
  static createErrorResponse(error: any, message: string, status: number) {
    console.error(message, error);
    return NextResponse.json({ message }, { status });
  }

  static handleError(error: any, message: string, status: number = 500) {
    console.error(message, error);
    throw new Error(JSON.stringify({ message, status }));
  }
}

export default ResponseUtil;