import { 
  View, 
  Text,
  Image,
  StyleSheet, 
  Modal, 
  ScrollView,
  TouchableOpacity, 
  useWindowDimensions,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import RenderHtml from 'react-native-render-html';

interface InformationModalProps {
  visible: boolean;
  title?: string;
  content: string;
  onClose: () => void;
}

const InformationModal: React.FC<InformationModalProps> = ({
  visible,
  title,
  content,
  onClose
}) => {
  const { width } = useWindowDimensions();

  return (
    <Modal 
      visible={visible}
      animationType="fade"
      transparent={true}
    >
      <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollPadding} 
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{title}</Text>

          <RenderHtml
            contentWidth={width}
            source={{ html: content }}
            // You can customize styles for specific tags here
            tagsStyles={{
              body: { fontSize: 16, color: '#333', marginHorizontal: 20},
              h1: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
            }}
          />
          
          <View style={styles.footerContainer}>
            <Image style={styles.ucrLogo} source={require('@/assets/images/logo_ucr.png')} />
            <Image style={styles.accionSocialLogo} source={require('@/assets/images/logo_accion_social.png')} />
            <Image style={styles.filologiaLogo} source={require('@/assets/images/logo_filologia.png')} />

            {/* Button to close the modal */}
            <TouchableOpacity style={styles.returnButton} onPress={onClose}>
              <Text style={styles.returnButtonText}>Regresar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scrollPadding: {
    width: wp('80%'),
    padding: 20,
    backgroundColor: 'white',
    borderWidth: 3,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: hp('2%'),
    borderColor: '#FFD700',
  },
  title: {
    fontSize: hp('3.5%'),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '80%',
    height: hp('10%'),
    marginBottom: hp('2%'),
  },
  ucrLogo: {
    width: wp('7%'),
    height: hp('7%'),
    alignItems: 'center',
  },
  filologiaLogo: {
    width: wp('20%'),
    height: hp('7%'),
    marginHorizontal: -30,
  },
  accionSocialLogo: {
    width: wp('18%'),
    height: hp('6.5%'),
  },
  returnButton: {
    backgroundColor: '#F49D1E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    margin: 20,
  },
  returnButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InformationModal;