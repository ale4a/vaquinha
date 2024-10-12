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
    backdrop: 'rgba(0, 0, 0, 0.6)', // Color de fondo más oscuro
    background: '#1D1F21', // Fondo personalizado
    confirmButtonText: confirmButtonText,
  });
};
