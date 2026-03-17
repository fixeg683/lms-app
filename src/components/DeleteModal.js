import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const DeleteModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  return (
    <Modal
      visible={!!isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Confirm Delete</Text>

          <Text style={styles.message}>
            Are you sure you want to delete{' '}
            <Text style={{ fontWeight: 'bold' }}>
              {String(itemName || 'this item')}
            </Text>
            ?
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onConfirm}>
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modal: {
    width: 320,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  message: {
    marginBottom: 20,
    color: '#374151',
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  cancel: {
    marginRight: 20,
    color: '#6B7280',
  },

  delete: {
    color: '#EF4444',
    fontWeight: 'bold',
  },
});