import Swal, { SweetAlertIcon } from "sweetalert2";

type AlertOptions = {
  title?: string;
  message: string;
  icon: SweetAlertIcon;
};

const showAlert = async ({ title, message, icon }: AlertOptions) => {
  return await Swal.fire({
    title,
    text: message,
    icon,
  });
};

export const SweetAlertSuccessDialogue = async (message: string) =>
  await showAlert({
    title: "Success",
    message,
    icon: "success",
  });

export const SweetAlertErrorDialogue = async (message: string) =>
  await showAlert({
    title: "Failed",
    message,
    icon: "error",
  });

export const SweetAlertWarningDialogue = async (message: string) =>
  await showAlert({
    title: "Warning",
    message,
    icon: "warning",
  });

export const SweetAlertInfoDialogue = async (message: string) =>
  await showAlert({
    title: "Information",
    message,
    icon: "info",
  });

export const SweetAlertConfirmDialogue = async (
  message: string,
  title = "Are you sure?"
): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text: message,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });

  return result.isConfirmed;
};
