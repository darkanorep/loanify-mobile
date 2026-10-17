import * as Linking from "expo-linking";
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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  function handleLogin() {
    setMessage("");

    if (!username.trim() || !password) {
      setMessage("Enter your username or email and password.");
      return;
    }

    // Keep the existing demo sign-in behavior.
    router.replace("/home");
  }

  async function handleGoogleLogin() {
    setMessage("");

    if (Platform.OS === "web") {
      setMessage("Google sign-in is available in the mobile app build.");
      return;
    }

    if (!API_BASE_URL) {
      setMessage(
        "The API address is missing. Set EXPO_PUBLIC_API_URL and restart Expo.",
      );
      return;
    }

    setGoogleLoading(true);

    try {
      const authResult = await WebBrowser.openAuthSessionAsync(
        `${API_BASE_URL}/api/auth/google/mobile`,
        GOOGLE_REDIRECT_URI,
      );

      if (authResult.type !== "success") {
        return;
      }

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
          headers: {
            "Content-Type": "application/json",
          },
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

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.screen}>
        <View style={styles.brand}>
          <Image
            source={require("../../assets/images/loanify-icon.png")}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Loanify"
          />
          <Text style={styles.wordmark}>
            <Text style={styles.wordmarkLoan}>loan</Text>
            <Text style={styles.wordmarkIfy}>ify</Text>
          </Text>
          <Text style={styles.tagline}>
            Smarter loans, <Text style={styles.taglineAccent}>start here.</Text>
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Sign in with your username or email.
          </Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Username or Email</Text>
            <View style={styles.inputShell}>
              <SymbolView name="person" size={20} tintColor={COLORS.muted} />
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="yourusername or email"
                placeholderTextColor={COLORS.muted}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="username"
                style={styles.input}
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.inputShell}>
              <SymbolView name="lock" size={20} tintColor={COLORS.muted} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
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
                  size={20}
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

          <Pressable
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.buttonPressed,
            ]}
            accessibilityRole="button"
          >
            <Text style={styles.loginButtonText}>LOG IN</Text>
            <SymbolView name="arrow.right" size={20} tintColor={COLORS.white} />
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            onPress={handleGoogleLogin}
            disabled={googleLoading}
            style={({ pressed }) => [
              styles.googleButton,
              pressed && styles.buttonPressed,
              googleLoading && styles.buttonDisabled,
            ]}
            accessibilityRole="button"
          >
            <Text style={styles.googleMark}>G</Text>
            <Text style={styles.googleButtonText}>
              {googleLoading ? "Connecting…" : "Continue with Google"}
            </Text>
          </Pressable>

          {message ? (
            <Text accessibilityRole="alert" style={styles.message}>
              {message}
            </Text>
          ) : null}

          <View style={styles.signupRow}>
            <Text style={styles.signupPrompt}>Don’t have an account? </Text>
            <Pressable
              onPress={() => router.push("/signup")}
              accessibilityRole="button"
            >
              <Text style={styles.link}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const COLORS = {
  background: "#F5F2EC",
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
    flex: 1,
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    backgroundColor: COLORS.background,
    paddingHorizontal: 28,
    paddingTop: 52,
    paddingBottom: 32,
  },
  brand: {
    alignItems: "center",
    marginBottom: 54,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 18,
  },
  wordmark: {
    marginTop: 8,
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -1.5,
  },
  wordmarkLoan: {
    color: COLORS.navy,
  },
  wordmarkIfy: {
    color: COLORS.coral,
  },
  tagline: {
    marginTop: 20,
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: "500",
  },
  taglineAccent: {
    color: COLORS.coral,
  },
  form: {
    width: "100%",
  },
  heading: {
    color: COLORS.navy,
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 34,
    color: COLORS.muted,
    fontSize: 16,
  },
  fieldGroup: {
    marginBottom: 22,
  },
  fieldLabel: {
    marginBottom: 10,
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: "600",
  },
  inputShell: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    backgroundColor: COLORS.input,
  },
  input: {
    flex: 1,
    minWidth: 0,
    color: COLORS.navy,
    fontSize: 16,
    paddingVertical: 14,
  },
  optionsRow: {
    marginTop: 2,
    marginBottom: 26,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rememberButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkbox: {
    width: 23,
    height: 23,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    backgroundColor: COLORS.white,
  },
  checkboxChecked: {
    borderColor: COLORS.navy,
    backgroundColor: COLORS.navy,
  },
  rememberText: {
    color: COLORS.muted,
    fontSize: 14,
  },
  link: {
    color: COLORS.coral,
    fontSize: 14,
    fontWeight: "700",
  },
  loginButton: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    borderRadius: 19,
    backgroundColor: COLORS.navy,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  buttonPressed: {
    opacity: 0.82,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 25,
    marginBottom: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E1DA",
  },
  dividerText: {
    color: COLORS.muted,
    fontSize: 13,
  },
  googleButton: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 17,
    backgroundColor: COLORS.white,
  },
  googleMark: {
    color: "#4285F4",
    fontSize: 19,
    fontWeight: "800",
  },
  googleButtonText: {
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: "600",
  },
  message: {
    marginTop: 14,
    color: COLORS.coral,
    fontSize: 14,
    lineHeight: 20,
  },
  signupRow: {
    marginTop: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  signupPrompt: {
    color: COLORS.muted,
    fontSize: 14,
  },
});
