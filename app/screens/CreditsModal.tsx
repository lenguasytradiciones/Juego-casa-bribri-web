import InformationModal from "./InformationModal";
import { CREDITS_HTML } from "../misc/constants";

interface CreditsModalProps {
  visible: boolean;
  onClose: () => void;
}

const CreditsModal: React.FC<CreditsModalProps> = ({
  visible,
  onClose
}) => {
  const content = CREDITS_HTML; // Use the credits content
  return (
    <InformationModal
      visible={visible}
      content={content}
      onClose={onClose}
    />
  );
};

export default CreditsModal;