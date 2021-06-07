export class Response {

  success: boolean;
  data: any;
  error: Error;

  constructor(success: boolean, data: any, error: Error) {
    this.success = success;
    this.data = data;
    this.error = error;
  }

  static success(data: any) {
    return new Response(true, data, null);
  }

  static fail(err: Error) {
    return new Response(false, null, err);
  }
}