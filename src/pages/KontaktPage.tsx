import { useState, useEffect } from "react";
import FibaRegistrationModal from "@/components/FibaRegistrationModal";
import { useNavigate } from "react-router-dom";

const KontaktPage = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsOpen(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <FibaRegistrationModal isOpen={isOpen} onClose={handleClose} />
    </div>
  );
};

export default KontaktPage;
