export interface User {
    status: any,
    message: any,
    data: Detail[]
  }


export interface Detail { 
    access_token: any,
      token_type: any,
      expires_in: any,
      user: Userdata[]
}


export interface Userdata{
    id: any,
    name: any,
    email: any,
    phone: any,
    otp: any,
    is_verified: any,
    msg_id: any,
    created_at: any,
    updated_at: any,
    created_by: any
}