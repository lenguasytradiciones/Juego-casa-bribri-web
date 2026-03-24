import InformationModal from "./InformationModal";
import { ABOUT_THE_RESOURCE_HTML, ABOUT_THE_PROJECT_HTML } from "../misc/constants";

interface AboutTheResourceModalProps {
  visible: boolean;
  onClose: () => void;
}

const AboutTheResourceModal: React.FC<AboutTheResourceModalProps> = ({
  visible,
  onClose
}) => {
  const content = ABOUT_THE_RESOURCE_HTML + ABOUT_THE_PROJECT_HTML; // Combine both sections into one content string
  return (
    <InformationModal
      visible={visible}
      content={content}
      onClose={onClose}
    />
  );
};

export default AboutTheResourceModal;