import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Colors from "@/constants/colors";
import { MessageSquare, Send } from "lucide-react-native";
import ToolkitHeader from "@/components/ToolkitHeader";

export default function TFSAAdvisorScreen() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<{role: string, content: string}[]>([
    {
      role: "assistant",
      content: "Hi there! I'm Joe, a financial advisor at McLaughlin Financial. I'd be happy to answer any questions you have about TFSAs, investment strategies, or how to maximize your tax-free savings. How can I help you today?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message to conversation
    const userMessage = { role: "user", content: message };
    setConversation([...conversation, userMessage]);
    
    // Clear input
    setMessage("");
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Simulate AI response
      setTimeout(() => {
        const responses = [
          "That's a great question about TFSAs. The contribution room you have depends on your age and residency status. If you were 18 or older in 2009 and have been a Canadian resident since then, you could have up to $102,000 in total contribution room by 2025.",
          "When it comes to investment strategies for your TFSA, I recommend focusing on growth investments since all gains are tax-free. This makes your TFSA ideal for investments with higher growth potential.",
          "Withdrawals from your TFSA are completely tax-free, and the amount you withdraw gets added back to your contribution room in the following calendar year.",
          "I'd be happy to review your specific situation in more detail. Would you like to schedule a call or meeting to discuss your TFSA strategy?",
          "Many clients find that combining their TFSA strategy with other investment vehicles like RRSPs or non-registered accounts can optimize their overall tax situation. I'd be happy to explain how this might work for your specific circumstances."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        setConversation(prev => [...prev, {
          role: "assistant",
          content: randomResponse
        }]);
        
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error getting response:", error);
      setIsLoading(false);
      
      // Add error message
      setConversation(prev => [...prev, {
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later or contact our office directly at 519-510-0411."
      }]);
    }
  };

  const handleScheduleCall = () => {
    Alert.alert(
      "Schedule a Call",
      "Our office will contact you to arrange a convenient time to discuss your TFSA strategy.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Confirm",
          onPress: () => {
            Alert.alert(
              "Thank You!",
              "We'll be in touch soon to schedule your call.",
              [{ text: "OK" }]
            );
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <ToolkitHeader />
      
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Talk with Joe</Text>
        <Text style={styles.subtitle}>
          Get personalized advice about your TFSA strategy
        </Text>
      </View>
      
      <View style={styles.chatContainer}>
        <ScrollView 
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          {conversation.map((msg, index) => (
            <View 
              key={index} 
              style={[
                styles.messageBubble,
                msg.role === "user" ? styles.userMessage : styles.assistantMessage
              ]}
            >
              <Text style={styles.messageText}>{msg.content}</Text>
            </View>
          ))}
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Joe is typing...</Text>
            </View>
          )}
        </ScrollView>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type your question here..."
            multiline
          />
          <TouchableOpacity 
            style={styles.sendButton} 
            onPress={handleSendMessage}
            disabled={!message.trim() || isLoading}
          >
            <Send size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.scheduleButton}
          onPress={handleScheduleCall}
        >
          <MessageSquare size={20} color="white" style={styles.buttonIcon} />
          <Text style={styles.scheduleButtonText}>Schedule a Call</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Back to Calculator</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.navy,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondary,
    textAlign: "center",
    lineHeight: 22,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 16,
  },
  messagesContent: {
    paddingVertical: 10,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    maxWidth: "80%",
  },
  userMessage: {
    backgroundColor: Colors.navyLight,
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  assistantMessage: {
    backgroundColor: Colors.lightGray,
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 22,
  },
  loadingContainer: {
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 14,
    fontStyle: "italic",
    color: Colors.secondary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 24,
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingTop: 8,
  },
  sendButton: {
    backgroundColor: Colors.navy,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  actionButtonsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  scheduleButton: {
    backgroundColor: Colors.navy,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
  scheduleButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: Colors.lightGray,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backButtonText: {
    color: Colors.navy,
    fontSize: 16,
    fontWeight: "600",
  },
});