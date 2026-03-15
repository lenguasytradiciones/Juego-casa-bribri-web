import ResetProgressModal from './ResetProgressModal';
import { LevelMode, resetModeProgress } from '../misc/progress';

interface ResetModeModalProps {
  visible: boolean;
  onClose: () => void;
  mode: LevelMode;
}

// Modal specifically for resetting progress of a single mode when all levels in that mode are completed
const ResetModeModal: React.FC<ResetModeModalProps> = ({
  visible,
  onClose,
  mode
}) => {
  // Handler for resetting progress for mode
  const handleConfirm = async () => {
    await resetModeProgress(mode);
    onClose();
  };

  const modeName = mode === LevelMode.READ ? 'lectura' : 'escucha';

  return (
    <ResetProgressModal
      visible={visible}
      title={`¡Ha completado todos los niveles de ${modeName}!`}
      description={`Puede reiniciar el progreso o completar el otro modo primero`}
      imageSource={require('@/assets/images/casa_sin_elementos.png')}
      onConfirm={handleConfirm}
      onContinue={onClose}
    />
  );
};

export default ResetModeModal;