import { resetProgress } from '../misc/progress';
import ResetProgressModal from './ResetProgressModal';

interface RestartModalProps {
  visible: boolean;
  onClose: () => void;
}

// Modal specifically for resetting all progress when all levels in both modes are completed
const RestartModal: React.FC<RestartModalProps> = ({
  visible,
  onClose,
}) => {
  // Handler for resetting progress and closing modal
  const handleRestart = async () => {
    await resetProgress();
    onClose();
  };

  return (
    <ResetProgressModal
      visible={visible}
      title="¡Felicidades!"
      description="Ha completado todos los niveles"
      imageSource={require('@/assets/images/casa_sin_elementos.png')}
      onConfirm={handleRestart}
    />
  );
};

export default RestartModal;