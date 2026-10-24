import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
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
import CountryPicker, {
  type CountryCode,
} from "react-native-country-picker-modal";

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const GOOGLE_REDIRECT_URI = "loanifymobile://oauth/callback";

export default function SignUpScreen() {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [phoneCountry, setPhoneCountry] = useState<CountryCode>("PH");
  const [phoneCallingCode, setPhoneCallingCode] = useState("63");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleSignUp() {
    setMessage("");

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !mobileNumber.trim() ||
      !email.trim() ||
      !username.trim() ||
      !password
    ) {
      setMessage("Complete all required fields to continue.");
      return;
    }

    const phoneDigits = mobileNumber.replace(/\D/g, "").replace(/^0+/, "");
    const fullPhoneNumber = `+${phoneCallingCode}${phoneDigits}`;

    if (!/^\+\d{8,15}$/.test(fullPhoneNumber)) {
      setMessage("Enter a valid phone number.");
      return;
    }

    if (!agreedToTerms) {
      setMessage("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setMessage("Account creation is not connected yet.");
  }

  async function handleGoogleSignUp() {
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

          <Text style={styles.heading}>Create account</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.fieldRow}>
            <View style={[styles.fieldGroup, styles.fieldHalf]}>
              <Text style={styles.fieldLabel}>First Name</Text>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="John"
                placeholderTextColor={COLORS.placeholder}
                style={styles.input}
                autoCapitalize="words"
                textContentType="givenName"
              />
            </View>

            <View style={[styles.fieldGroup, styles.fieldHalf]}>
              <Text style={styles.fieldLabel}>
                Middle <Text style={styles.optional}>OPT</Text>
              </Text>
              <TextInput
                value={middleName}
                onChangeText={setMiddleName}
                placeholder="Michael"
                placeholderTextColor={COLORS.placeholder}
                style={styles.input}
                autoCapitalize="words"
                textContentType="middleName"
              />
            </View>
          </View>

          <View style={styles.fieldRow}>
            <View style={[styles.fieldGroup, styles.lastNameField]}>
              <Text style={styles.fieldLabel}>Last Name</Text>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Doe"
                placeholderTextColor={COLORS.placeholder}
                style={styles.input}
                autoCapitalize="words"
                textContentType="familyName"
              />
            </View>

            <View style={[styles.fieldGroup, styles.suffixField]}>
              <Text style={styles.fieldLabel}>
                Suffix <Text style={styles.optional}>OPT</Text>
              </Text>
              <TextInput
                value={suffix}
                onChangeText={setSuffix}
                placeholder="Jr."
                placeholderTextColor={COLORS.placeholder}
                style={styles.input}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Mobile Number</Text>

            <View style={styles.phoneShell}>
              <CountryPicker
                countryCode={phoneCountry}
                withFilter
                withFlag
                withCallingCode
                withCallingCodeButton
                withEmoji={false}
                onSelect={(country) => {
                  setPhoneCountry(country.cca2);
                  setPhoneCallingCode(country.callingCode[0] ?? "");
                }}
                containerButtonStyle={styles.countryPickerButton}
                filterProps={{ placeholder: "Search country" }}
                theme={{
                  backgroundColor: COLORS.white,
                  onBackgroundTextColor: COLORS.navy,
                  primaryColor: COLORS.coral,
                  primaryColorVariant: COLORS.input,
                  filterPlaceholderTextColor: COLORS.muted,
                  fontSize: 15,
                  itemHeight: 56,
                }}
              />

              <SymbolView
                name="chevron.down"
                size={12}
                tintColor={COLORS.muted}
              />

              <View style={styles.phoneDivider} />

              <TextInput
                value={mobileNumber}
                onChangeText={setMobileNumber}
                placeholder="9xx xxx xxxx"
                placeholderTextColor={COLORS.placeholder}
                style={styles.phoneInput}
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            <View style={styles.inputShell}>
              <SymbolView name="envelope" size={17} tintColor={COLORS.muted} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={COLORS.placeholder}
                style={styles.inputWithIcon}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Username</Text>
            <View style={styles.inputShell}>
              <SymbolView name="at" size={17} tintColor={COLORS.muted} />
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="johndoe"
                placeholderTextColor={COLORS.placeholder}
                style={styles.inputWithIcon}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="username"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.inputShell}>
              <SymbolView name="lock" size={17} tintColor={COLORS.muted} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••••"
                placeholderTextColor={COLORS.placeholder}
                secureTextEntry={!passwordVisible}
                style={styles.inputWithIcon}
                textContentType="newPassword"
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
                  size={17}
                  tintColor={COLORS.muted}
                />
              </Pressable>
            </View>
          </View>

          <Pressable
            onPress={() => setAgreedToTerms((agreed) => !agreed)}
            style={styles.termsRow}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: agreedToTerms }}
          >
            <View
              style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}
            >
              {agreedToTerms && (
                <SymbolView
                  name="checkmark"
                  size={11}
                  tintColor={COLORS.white}
                />
              )}
            </View>

            <Text style={styles.termsText}>
              I agree to the{" "}
              <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </Pressable>

          <Pressable
            onPress={handleSignUp}
            style={({ pressed }) => [
              styles.signupButton,
              pressed && styles.buttonPressed,
            ]}
            accessibilityRole="button"
          >
            <Text style={styles.signupButtonText}>SIGN UP</Text>
            <SymbolView name="arrow.right" size={17} tintColor={COLORS.white} />
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <Pressable
              onPress={handleGoogleSignUp}
              disabled={googleLoading}
              style={({ pressed }) => [
                styles.socialButton,
                pressed && styles.buttonPressed,
                googleLoading && styles.buttonDisabled,
              ]}
              accessibilityRole="button"
            >
              <FontAwesome5 name="google" brand size={15} color="#4285F4" />
              <Text style={styles.socialButtonText}>
                {googleLoading ? "Connecting…" : "Google"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setMessage("Apple sign-in is not connected yet.")}
              style={({ pressed }) => [
                styles.socialButton,
                pressed && styles.buttonPressed,
              ]}
              accessibilityRole="button"
            >
              <FontAwesome5 name="apple" brand size={17} color={COLORS.navy} />
              <Text style={styles.socialButtonText}>Apple</Text>
            </Pressable>
          </View>

          {message ? (
            <Text accessibilityRole="alert" style={styles.message}>
              {message}
            </Text>
          ) : null}

          <View style={styles.loginRow}>
            <Text style={styles.loginPrompt}>Already have an account? </Text>
            <Pressable
              onPress={() => router.replace("/auth/login")}
              accessibilityRole="button"
            >
              <Text style={styles.termsLink}>Login</Text>
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
  muted: "#6F8098",
  placeholder: "#A5B1C3",
  input: "#EDF3FC",
  border: "#E8EDF5",
  white: "#FFFFFF",
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  screen: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    backgroundColor: COLORS.background,
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 28,
  },
  brand: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 14,
  },
  wordmark: {
    marginTop: 8,
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: -1,
  },
  wordmarkLoan: {
    color: COLORS.navy,
  },
  wordmarkIfy: {
    color: COLORS.coral,
  },
  heading: {
    marginTop: 8,
    color: COLORS.navy,
    fontSize: 20,
    fontWeight: "600",
  },
  form: {
    width: "100%",
  },
  fieldRow: {
    flexDirection: "row",
    gap: 10,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldHalf: {
    flex: 1,
  },
  lastNameField: {
    flex: 1.4,
  },
  suffixField: {
    flex: 0.6,
  },
  fieldLabel: {
    marginBottom: 6,
    color: COLORS.navy,
    fontSize: 11,
    fontWeight: "500",
  },
  optional: {
    color: COLORS.muted,
    fontSize: 9,
  },
  input: {
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    color: COLORS.navy,
    fontSize: 13,
  },
  inputShell: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  inputWithIcon: {
    flex: 1,
    minWidth: 0,
    height: "100%",
    color: COLORS.navy,
    fontSize: 13,
  },
  phoneShell: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  countryPickerButton: {
    paddingRight: 2,
  },
  phoneDivider: {
    width: 1,
    height: 22,
    backgroundColor: COLORS.border,
  },
  phoneInput: {
    flex: 1,
    minWidth: 0,
    height: 38,
    paddingHorizontal: 6,
    color: COLORS.navy,
    fontSize: 13,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
    marginBottom: 16,
  },
  checkbox: {
    width: 15,
    height: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#AAB5C4",
    borderRadius: 3,
    backgroundColor: COLORS.white,
  },
  checkboxChecked: {
    borderColor: COLORS.navy,
    backgroundColor: COLORS.navy,
  },
  termsText: {
    flex: 1,
    color: COLORS.navy,
    fontSize: 10,
    lineHeight: 15,
  },
  termsLink: {
    color: COLORS.coral,
    fontWeight: "600",
  },
  signupButton: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 12,
    backgroundColor: COLORS.navy,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  signupButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "800",
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
    marginTop: 20,
    marginBottom: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E5EF",
  },
  dividerText: {
    color: COLORS.muted,
    fontSize: 10,
  },
  socialRow: {
    flexDirection: "row",
    gap: 10,
  },
  socialButton: {
    flex: 1,
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  socialButtonText: {
    color: COLORS.navy,
    fontSize: 12,
    fontWeight: "600",
  },
  message: {
    marginTop: 10,
    color: COLORS.coral,
    fontSize: 12,
    lineHeight: 17,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  loginPrompt: {
    color: COLORS.muted,
    fontSize: 12,
  },
});
