import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const C = {
  navy: "#101C2C",
  coral: "#D96943",
  cream: "#F6F3EE",
  white: "#FFFFFF",
  muted: "#7B8794",
  line: "#E4E7EC",
  input: "#EDF3FC",
};

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");

  function handleLogin() {
    if (!email.trim() || !password) {
      setMessage("Enter your username or email and password.");
      return;
    }

    router.replace("/home");
  }

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.container}>
        <View style={styles.brandBlock}>
          <Image
            source={require("../../assets/images/loanify-icon.png")}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Loanify"
          />
          <Text style={styles.brand}>
            loan<Text style={styles.brandAccent}>ify</Text>
          </Text>
          <Text style={styles.tagline}>
            Smarter loans, <Text style={styles.brandAccent}>start here.</Text>
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Sign in with your username or email.
          </Text>

          <Text style={styles.label}>Username or Email</Text>
          <View style={styles.inputWrap}>
            <SymbolView
              name={{ ios: "person", android: "person", web: "person" }}
              size={18}
              tintColor={C.muted}
            />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="yourusername or email"
              placeholderTextColor={C.muted}
              autoCapitalize="none"
              autoComplete="username"
              keyboardType="email-address"
              style={styles.input}
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrap}>
            <SymbolView
              name={{ ios: "lock", android: "lock", web: "lock" }}
              size={18}
              tintColor={C.muted}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor={C.muted}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="current-password"
              style={styles.input}
            />
            <Pressable
              accessibilityLabel={
                showPassword ? "Hide password" : "Show password"
              }
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={10}
            >
              <SymbolView
                name={{
                  ios: showPassword ? "eye.slash" : "eye",
                  android: showPassword ? "visibility_off" : "visibility",
                  web: showPassword ? "visibility_off" : "visibility",
                }}
                size={18}
                tintColor={C.muted}
              />
            </Pressable>
          </View>

          <View style={styles.optionsRow}>
            <Pressable
              style={styles.rememberButton}
              onPress={() => setRememberMe(!rememberMe)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: rememberMe }}
            >
              <View
                style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
              >
                {rememberMe ? <Text style={styles.checkmark}>✓</Text> : null}
              </View>
              <Text style={styles.rememberText}>Remember Me</Text>
            </Pressable>

            <Pressable
              onPress={() => setMessage("Password reset is not available yet.")}
            >
              <Text style={styles.forgot}>Forgot Password?</Text>
            </Pressable>
          </View>

          <Pressable style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>LOG IN</Text>
            <SymbolView
              name={{
                ios: "arrow.right",
                android: "arrow_forward",
                web: "arrow_forward",
              }}
              size={18}
              tintColor={C.white}
            />
          </Pressable>

          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don’t have an account? </Text>
            <Pressable
              onPress={() =>
                setMessage("Account registration is not available yet.")
              }
            >
              <Text style={styles.signupLink}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: C.cream,
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  container: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },
  brandBlock: {
    alignItems: "center",
    marginBottom: 42,
  },
  brand: {
    color: C.navy,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -1,
  },
  brandAccent: {
    color: C.coral,
  },
  tagline: {
    color: C.navy,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 14,
  },
  form: {
    width: "100%",
  },
  title: {
    color: C.navy,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.7,
  },
  subtitle: {
    color: C.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
    marginBottom: 24,
  },
  label: {
    color: C.navy,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 16,
  },
  inputWrap: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 14,
    backgroundColor: C.input,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    color: C.navy,
    fontSize: 14,
    paddingVertical: 14,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
  },
  rememberButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 17,
    height: 17,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: C.navy,
    borderColor: C.navy,
  },
  checkmark: {
    color: C.white,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "700",
  },
  rememberText: {
    color: C.muted,
    fontSize: 12,
  },
  forgot: {
    color: C.coral,
    fontSize: 12,
    fontWeight: "700",
  },
  primaryButton: {
    minHeight: 54,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    backgroundColor: C.navy,
    borderRadius: 14,
    marginTop: 26,
  },
  primaryButtonText: {
    color: C.white,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  message: {
    color: C.coral,
    fontSize: 12,
    marginTop: 12,
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
  signupText: {
    color: C.muted,
    fontSize: 13,
  },
  signupLink: {
    color: C.coral,
    fontSize: 13,
    fontWeight: "700",
  },
  logo: {
    width: 150,
    height: 48,
  },
});
