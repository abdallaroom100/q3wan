import { toast, type ToastPosition } from "react-hot-toast";
const hotToast = ({
  type,
  message,
  duration = 1200,
  position = "top-center",
}: {
  type: "success" | "error";
  message: string;
  duration?: number;
  position?: string;
}) => {

  toast[type](message, {
    duration,
    position: position as ToastPosition,
    style: {
      zIndex:1000,
      background: "#2c3e50",
      color:"white",
      textAlign:"center",
      fontSize:
        typeof window !== "undefined"
          ? window.innerWidth > 768
            ? "20px"
            : "14px"
          : "",
    },
  });
};

export default hotToast;
