import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as Linking from "expo-linking";
import * as LocalAuthentication from "expo-local-authentication";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { SymbolView } from "expo-symbols";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import {
    Image,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const GOOGLE_REDIRECT_URI = "loanifymobile://oauth/callback";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  function handleLogin() {
    setMessage("");

    if (!email.trim() || !password) {
      setMessage("Enter your email and password.");
      return;
    }

    // Existing demo sign-in behavior.
    router.replace("/home");
  }

  async function handleGoogleLogin() {
    setMessage("");

    if (Platform.OS === "web") {
      setMessage("Google sign-in is available in the mobile app.");
      return;
    }

    if (!API_BASE_URL) {
      setMessage("Set EXPO_PUBLIC_API_URL and restart Expo.");
      return;
    }

    setGoogleLoading(true);

    try {
      const authResult = await WebBrowser.openAuthSessionAsync(
        `${API_BASE_URL}/api/auth/google/mobile`,
        GOOGLE_REDIRECT_URI,
      );

      if (authResult.type !== "success") return;

      const parsedUrl = Linking.parse(authResult.url);
      const codeParam = parsedUrl.queryParams?.code;
      const code = Array.isArray(codeParam) ? codeParam[0] : codeParam;

      if (typeof code !== "string" || !code) {
        throw new Error("Google sign-in did not return an authorization code.");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/auth/google/mobile/exchange`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        },
      );

      const data = await response.json();

      if (!response.ok || typeof data.token !== "string") {
        throw new Error(data.error ?? "Google sign-in could not be completed.");
      }

      await SecureStore.setItemAsync("loanify.auth.token", data.token);
      router.replace("/home");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Google sign-in failed. Please try again.",
      );
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleBiometricLogin() {
    setMessage("");

    if (Platform.OS === "web") {
      setMessage("Biometric sign-in is available in the mobile app.");
      return;
    }

    const token = await SecureStore.getItemAsync("loanify.auth.token");

    if (!token) {
      setMessage("Sign in first to enable biometric unlock.");
      return;
    }

    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      setMessage(
        "Set up Face ID or fingerprint in your device settings first.",
      );
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Unlock Loanify",
      cancelLabel: "Cancel",
    });

    if (result.success) {
      router.replace("/home");
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.screen}>
        <View style={styles.brand}>
          <Image
            source={require("../../../assets/images/loanify-icon.png")}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Loanify logo"
          />
          <Text style={styles.wordmark}>
            <Text style={styles.wordmarkLoan}>loan</Text>
            <Text style={styles.wordmarkIfy}>ify</Text>
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.heading}>Welcome Back</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Email</Text>
            <View style={styles.inputShell}>
              <SymbolView name="person" size={19} tintColor={COLORS.muted} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="name@example.com"
                placeholderTextColor={COLORS.muted}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                style={styles.input}
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.inputShell}>
              <SymbolView name="lock" size={19} tintColor={COLORS.muted} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={COLORS.muted}
                secureTextEntry={!passwordVisible}
                textContentType="password"
                style={styles.input}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <Pressable
                onPress={() => setPasswordVisible((visible) => !visible)}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={
                  passwordVisible ? "Hide password" : "Show password"
                }
              >
                <SymbolView
                  name={passwordVisible ? "eye" : "eye.slash"}
                  size={19}
                  tintColor={COLORS.muted}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.optionsRow}>
            <Pressable
              onPress={() => setRememberMe((remember) => !remember)}
              style={styles.rememberButton}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: rememberMe }}
            >
              <View
                style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
              >
                {rememberMe && (
                  <SymbolView
                    name="checkmark"
                    size={13}
                    tintColor={COLORS.white}
                  />
                )}
              </View>
              <Text style={styles.rememberText}>Remember Me</Text>
            </Pressable>

            <Pressable
              onPress={() => setMessage("Password reset is not available yet.")}
              accessibilityRole="button"
            >
              <Text style={styles.link}>Forgot Password?</Text>
            </Pressable>
          </View>

          <View style={styles.loginRow}>
            <Pressable
              onPress={handleLogin}
              style={({ pressed }) => [
                styles.loginButton,
                pressed && styles.buttonPressed,
              ]}
              accessibilityRole="button"
            >
              <Text style={styles.loginButtonText}>LOG IN</Text>
              <SymbolView
                name="arrow.right"
                size={19}
                tintColor={COLORS.white}
              />
            </Pressable>

            <Pressable
              onPress={handleBiometricLogin}
              style={({ pressed }) => [
                styles.biometricButton,
                pressed && styles.buttonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Unlock with biometrics"
            >
              <FontAwesome5 name="fingerprint" size={21} color="#245AA5" />
            </Pressable>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <Pressable
              onPress={handleGoogleLogin}
              disabled={googleLoading}
              style={({ pressed }) => [
                styles.socialButton,
                pressed && styles.buttonPressed,
                googleLoading && styles.buttonDisabled,
              ]}
              accessibilityRole="button"
            >
              <FontAwesome5 name="google" brand size={16} color="#4285F4" />
              <Text style={styles.socialButtonText}>
                {googleLoading ? "Connecting…" : "Google"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setMessage("Apple sign-in is not connected yet.")}
              style={({ pressed }) => [
                styles.socialButton,
                styles.appleButton,
                pressed && styles.buttonPressed,
              ]}
              accessibilityRole="button"
            >
              <FontAwesome5 name="apple" brand size={19} color={COLORS.white} />
              <Text style={styles.socialButtonText}>Apple</Text>
            </Pressable>
          </View>

          {message ? (
            <Text accessibilityRole="alert" style={styles.message}>
              {message}
            </Text>
          ) : null}

          <View style={styles.signupRow}>
            <Text style={styles.signupPrompt}>Don’t have an account? </Text>
            <Pressable
              onPress={() => router.push("/auth/signup")}
              accessibilityRole="button"
            >
              <Text style={styles.link}>Sign Up Now</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const COLORS = {
  background: "#F6F8FF",
  navy: "#101C2C",
  coral: "#D96943",
  muted: "#7B8A9D",
  input: "#EDF3FC",
  border: "#DFE6EF",
  white: "#FFFFFF",
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  screen: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    paddingTop: 34,
    paddingBottom: 28,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 32,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
  },
  wordmark: {
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: -1.1,
  },
  wordmarkLoan: {
    color: COLORS.navy,
  },
  wordmarkIfy: {
    color: COLORS.coral,
  },
  form: {
    width: "100%",
  },
  heading: {
    color: COLORS.navy,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.4,
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    marginBottom: 8,
    color: COLORS.navy,
    fontSize: 13,
    fontWeight: "500",
  },
  inputShell: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E7EDF7",
    borderRadius: 15,
    backgroundColor: COLORS.input,
  },
  input: {
    flex: 1,
    minWidth: 0,
    color: COLORS.navy,
    fontSize: 14,
    paddingVertical: 12,
  },
  optionsRow: {
    marginTop: 0,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rememberButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  checkbox: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    backgroundColor: COLORS.input,
  },
  checkboxChecked: {
    borderColor: COLORS.navy,
    backgroundColor: COLORS.navy,
  },
  rememberText: {
    color: COLORS.muted,
    fontSize: 12,
  },
  link: {
    color: COLORS.coral,
    fontSize: 13,
    fontWeight: "700",
  },
  loginRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loginButton: {
    flex: 1,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderRadius: 14,
    backgroundColor: COLORS.navy,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  biometricButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#E7F0FF",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 24,
    marginBottom: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E5EF",
  },
  dividerText: {
    color: COLORS.muted,
    fontSize: 12,
  },
  socialRow: {
    flexDirection: "row",
    gap: 10,
  },
  socialButton: {
    flex: 1,
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    borderRadius: 13,
    backgroundColor: COLORS.navy,
  },
  appleButton: {
    backgroundColor: "#000000",
  },
  socialButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },
  message: {
    marginTop: 12,
    color: COLORS.coral,
    fontSize: 13,
    lineHeight: 19,
  },
  signupRow: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  signupPrompt: {
    color: COLORS.muted,
    fontSize: 13,
  },
});
