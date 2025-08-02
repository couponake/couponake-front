import { object, string, ref, mixed} from "yup";

export const passwordRegex =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// const phoneRegex = /^[0-9()+\- ]*$/;

export const loginUserSchema = object().shape({
  email: string()
    .email("validation.valid_email")
    .required("validation.email_required")
    .matches(emailRegex, "validation.email_invalid"),
  password: string().required("validation.password_required"),
});

export const forgotPasswordSchema = object().shape({
  email: string()
    .email("validation.valid_email")
    .required("validation.email_required")
    .matches(emailRegex, "validation.email_invalid"),
});

export const signUpSchema = object().shape({
  name: string().required("validation.name_required"),

  email: string()
    .email("validation.valid_email")
    .required("validation.email_required")
    .matches(emailRegex, "validation.email_invalid"),
  password: string()
    .required("validation.password_required")
    .matches(passwordRegex, "validation.password_invalid")
    .max(15, "validation.password_max"),
  password_confirmation: string()
    .required("validation.password_confirm_required")
    .oneOf([ref("password")], "validation.passwords_must_match"),
  phone: string().required("validation.field_req"),
});

export const updateUserSchema = object().shape({
  name: string().required("validation.name_required"),

  email: string()
    .email("validation.valid_email")
    .required("validation.email_required")
    .matches(emailRegex, "validation.email_invalid"),
  phone_country_code: string().required(
    "validation.phone_country_code_required"
  ),
  phone: string().required("validation.field_req"),
  country_id: string().required("validation.field_req"),
  profile_picture: string().nullable(),
  password: string().nullable("validation.password_nullable"),
  password_confirmation: string().nullable(
    "validation.password_confirm_nullable"
  ),
});

export const updateProfileSchema = object().shape({
  name: string().required("validation.name_required"),

  email: string()
    .email("validation.valid_email")
    .required("validation.email_required")
    .matches(emailRegex, "validation.email_invalid"),

  phone: string().required("validation.field_req"),
  image: mixed().nullable(),
  password: string().nullable("validation.password_nullable"),
  password_confirmation: string().nullable(
    "validation.password_confirm_nullable"
  ),
});

export const emailSchema = object().shape({
  email: string()
    .email("validation.valid_email")
    .required("validation.email_required"),
});

export const passwordSchema = object().shape({
  password: string()
    .required("validation.password_required")
    .matches(passwordRegex, "validation.password_invalid")
    .max(15, "validation.password_max"),
  password_confirmation: string()
    .required("validation.password_confirm_required")
    .oneOf([ref("password")], "validation.passwords_must_match"),
});

export const changePasswordSchema = object().shape({
  current_password: string().required("validation.password_required"),
  password: string()
    .required("validation.password_required")
    .matches(passwordRegex, "validation.password_invalid")
    .max(15, "validation.password_max"),
  password_confirmation: string()
    .required("validation.password_confirm_required")
    .oneOf([ref("password")], "validation.passwords_must_match"),
});

export const resetPassword = () =>
  object().shape({
    oldPassword: string()
      .required("validation.old_password_required")
      .matches(passwordRegex, "validation.password_invalid")
      .max(15, "validation.password_max"),
    password: string()
      .required("validation.password_required")
      .matches(passwordRegex, "validation.password_invalid")
      .max(15, "validation.password_max"),
    confirmPassword: string()
      .required("validation.password_confirm_required")
      .oneOf([ref("password")], "validation.passwords_must_match"),
  });

export const otpSchema = object().shape({
  otp: string()
    .required("validation.otp_required")
    .matches(/^[0-9]+$/, "OTP must contain only numbers.")
    .length(6, "validation.otp_short"),
});