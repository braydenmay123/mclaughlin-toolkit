import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Linking } from "react-native";
import { MessageCircle, Phone, Mail, X } from "lucide-react-native";
import Colors from "@/constants/colors";

export default function AdvisorCTA() {
  const [showContactModal, setShowContactModal] = useState(false);

  const handleContactAdvisor = () => {
    setShowContactModal(true);
  };

  const handlePhoneCall = () => {
    Linking.openURL('tel:+15195100411');
    setShowContactModal(false);
  };

  const handleEmail = () => {
    Linking.openURL('mailto:info@mclaughlinfinancial.ca');
    setShowContactModal(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Need personalized advice?</Text>
        <Text style={styles.description}>
          Joe can help you create a customized home buying strategy that aligns with your long-term financial goals.
        </Text>
        
        <View style={styles.benefitsList}>
          <Text style={styles.benefitItem}>• Retirement planning alongside home ownership</Text>
          <Text style={styles.benefitItem}>• Tax optimization strategies</Text>
          <Text style={styles.benefitItem}>• Investment portfolio balancing</Text>
          <Text style={styles.benefitItem}>• Insurance needs assessment</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={handleContactAdvisor}
          activeOpacity={0.8}
        >
          <MessageCircle size={18} color="white" style={styles.buttonIcon} />
          <Text style={styles.contactButtonText}>Talk with Joe</Text>
        </TouchableOpacity>
      </View>
      
      <Modal
        visible={showContactModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowContactModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Contact Joe</Text>
              <TouchableOpacity
                onPress={() => setShowContactModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color={Colors.secondary} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalDescription}>
              Get personalized financial advice from Joe, your trusted advisor.
            </Text>
            
            <View style={styles.contactOptions}>
              <TouchableOpacity
                style={styles.contactOption}
                onPress={handlePhoneCall}
              >
                <Phone size={20} color={Colors.primary} />
                <View style={styles.contactOptionText}>
                  <Text style={styles.contactOptionTitle}>Call Joe</Text>
                  <Text style={styles.contactOptionSubtitle}>519-510-0411</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.contactOption}
                onPress={handleEmail}
              >
                <Mail size={20} color={Colors.primary} />
                <View style={styles.contactOptionText}>
                  <Text style={styles.contactOptionTitle}>Email Joe</Text>
                  <Text style={styles.contactOptionSubtitle}>info@mclaughlinfinancial.ca</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 28,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.accentLight,
    overflow: "hidden",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
    fontWeight: "500",
  },
  benefitsList: {
    marginBottom: 24,
  },
  benefitItem: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 8,
    lineHeight: 22,
    fontWeight: "500",
  },
  contactButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonIcon: {
    marginRight: 10,
  },
  contactButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.navy,
  },
  closeButton: {
    padding: 4,
  },
  modalDescription: {
    fontSize: 16,
    color: Colors.secondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  contactOptions: {
    gap: 16,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contactOptionText: {
    marginLeft: 12,
    flex: 1,
  },
  contactOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.navy,
    marginBottom: 2,
  },
  contactOptionSubtitle: {
    fontSize: 14,
    color: Colors.secondary,
  },
});