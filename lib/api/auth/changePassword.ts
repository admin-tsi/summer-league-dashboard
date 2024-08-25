import axios from "axios";

interface AskChangePasswordProps {
  email: string;
}

interface ChangePasswordProps {
  code: string;
  password: string;
}

const api = process.env.NEXT_PUBLIC_BASE_URL;

export const AskChangePassword = async ({ email }: AskChangePasswordProps) => {
  try {
    const response = await axios.post(`${api}/auth/forget-password`, {
      email,
    });

    if (response.status === 200) {
      return {
        success: true,
        message:
          "Your password change request has been successfully received. Please check your mailbox to proceed.",
      };
    } else {
      return {
        success: false,
        message:
          "Your request to change your password has failed. Please try again later.",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while changing password.",
      error,
    };
  }
};

export const changePassword = async ({
  code,
  password,
}: ChangePasswordProps) => {
  try {
    const response = await axios.patch(`${api}/auth/reset-password`, {
      code,
      password,
    });

    if (response.status === 200) {
      return {
        success: true,
        message:
          "Your password has been change successfully. Login to acces to the website content.",
      };
    } else {
      return {
        success: false,
        message:
          "Your request to change your password has failed. Please try again later.",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while changing password.",
      error,
    };
  }
};
