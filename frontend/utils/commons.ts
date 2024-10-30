import Swal from 'sweetalert2';

export const showAlert = (
  title: string,
  text: string,
  icon: 'success' | 'error' | 'warning' | 'info',
  confirmButtonText: string
) => {
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
    // iconColor: '#FFA109',
    backdrop: 'rgba(0, 0, 0, 0.6)',
    background: '#1D1F21',
    color: '#FFFFFF',
    confirmButtonColor: '#FFA109',
    confirmButtonText: confirmButtonText,
  });
};

export const showAlertWithConfirmation = (
  title: string,
  text: string,
  icon: 'success' | 'error' | 'warning' | 'info',
  onConfirm: () => void,
  confirmButtonText: string
) => {
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
    background: '#1D1F21',
    backdrop: 'rgba(0, 0, 0, 0.6)',
    confirmButtonText: confirmButtonText,
    confirmButtonColor: '#01BC8D',
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
      Swal.fire({
        title: 'Paid',
        icon: 'success',
        background: '#1D1F21',
        backdrop: 'rgba(0, 0, 0, 0.6)',
        showConfirmButton: false,
        timer: 1300,
      });
    } else {
      Swal.fire('Changes are not saved', '', 'info');
    }
  });
};

export const showNotification = (
  title: string,
  iconType: 'warning' | 'error' | 'success' | 'info' | 'question'
) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
    background: '#2C2E30',
    color: '#F5F5F5',
  });
  Toast.fire({
    icon: iconType,
    title: title,
  });
};
