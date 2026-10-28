import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  background: "#F5F7FC",
  navy: "#101C2C",
  muted: "#8190A5",
  line: "#E8EDF4",
  white: "#FFFFFF",
  coral: "#D96943",
  coralPale: "#FFF0E9",
  green: "#00A875",
  greenPale: "#E7FAF3",
  bluePale: "#EFF4FB",
};

export default function HomeScreen() {
  const [search, setSearch] = useState("");

  function showComingSoon(feature: string) {
    Alert.alert(feature, "This section will be available in a later step.");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.page}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.profile}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>FS</Text>
                <View style={styles.onlineDot} />
              </View>

              <View>
                <Text style={styles.eyebrow}>WELCOME BACK</Text>
                <Text style={styles.profileName}>Faisal Shahzad K.</Text>
              </View>
            </View>

            <View style={styles.headerActions}>
              <Pressable
                onPress={() => showComingSoon("Help center")}
                style={styles.headerIcon}
                accessibilityLabel="Help"
              >
                <FontAwesome5 name="question" size={14} color={COLORS.muted} />
              </Pressable>
              <Pressable
                onPress={() => showComingSoon("Notifications")}
                style={styles.headerIcon}
                accessibilityLabel="Notifications"
              >
                <FontAwesome5 name="bell" size={14} color={COLORS.muted} />
                <View style={styles.notificationDot} />
              </Pressable>
            </View>
          </View>

          <View style={styles.searchBox}>
            <FontAwesome5 name="search" size={14} color={COLORS.muted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search loans, repayments, FAQs..."
              placeholderTextColor="#9AA7B8"
              style={styles.searchInput}
              returnKeyType="search"
            />
            <Pressable
              onPress={() => showComingSoon("Search filters")}
              accessibilityLabel="Search filters"
            >
              <FontAwesome5 name="sliders-h" size={14} color={COLORS.muted} />
            </Pressable>
          </View>

          <View style={styles.card}>
            <View style={styles.balanceTop}>
              <View>
                <View style={styles.labelWithIcon}>
                  <Text style={styles.cardLabel}>
                    Total Outstanding Balance
                  </Text>
                  <FontAwesome5
                    name="info-circle"
                    size={11}
                    color={COLORS.muted}
                  />
                </View>
                <View style={styles.balanceLine}>
                  <Text style={styles.balanceAmount}>₱28,450.00</Text>
                  <Text style={styles.balanceApprox}>≈ $525.00</Text>
                </View>
              </View>

              <View style={styles.loanPill}>
                <Text style={styles.loanPillText}>1 Active{"\n"}Loan</Text>
              </View>
            </View>

            <View style={styles.creditBox}>
              <View style={styles.creditTop}>
                <Text style={styles.creditLabel}>Credit Used (38%)</Text>
                <Text style={styles.creditValue}>
                  ₱46,550{" "}
                  <Text style={styles.creditMuted}>avail. of ₱75,000</Text>
                </Text>
              </View>

              <View style={styles.progressTrack}>
                <View style={styles.progressFill} />
              </View>

              <View style={styles.dueRow}>
                <Text style={styles.dueDate}>
                  <FontAwesome5
                    name="calendar"
                    size={10}
                    color={COLORS.muted}
                  />
                  {"  "}Next Due: Nov 02, 2026
                </Text>
                <Text style={styles.dueAmount}>₱3,250.00</Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <Pressable
                onPress={() => showComingSoon("Request Loan")}
                style={styles.primaryButton}
              >
                <FontAwesome5 name="plus" size={12} color={COLORS.white} />
                <Text style={styles.primaryButtonText}>Request Loan</Text>
              </Pressable>

              <Pressable
                onPress={() => showComingSoon("Quick Repay")}
                style={styles.secondaryButton}
              >
                <FontAwesome5 name="money-bill" size={12} color={COLORS.navy} />
                <Text style={styles.secondaryButtonText}>Quick Repay</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.performanceHeader}>
              <View>
                <Text style={styles.eyebrow}>PERFORMANCE</Text>
                <Text style={styles.sectionTitle}>Repayment Cadence</Text>
              </View>

              <View style={styles.ontimePill}>
                <Text style={styles.ontimeText}>↗ 100% On-time</Text>
              </View>
            </View>

            <View style={styles.chart}>
              {[
                { month: "Jun", height: 28, color: "#EEF2F7" },
                { month: "Jul", height: 40, color: "#EEF2F7" },
                { month: "Aug", height: 50, color: "#E3E9F1" },
                { month: "Sep", height: 62, color: "#E89A7E" },
                { month: "Oct", height: 62, color: COLORS.coral },
              ].map((bar) => (
                <View key={bar.month} style={styles.chartColumn}>
                  {bar.month === "Oct" && (
                    <Text style={styles.chartAmount}>₱3.2k</Text>
                  )}
                  <View
                    style={[
                      styles.chartBar,
                      { height: bar.height, backgroundColor: bar.color },
                    ]}
                  />
                  <Text style={styles.chartMonth}>{bar.month}</Text>
                </View>
              ))}
            </View>

            <View style={styles.chartFooter}>
              <Text style={styles.chartFooterText}>
                Cumulative Repaid: <Text style={styles.strong}>₱18,250</Text>
              </Text>
              <Pressable onPress={() => showComingSoon("Repayment history")}>
                <Text style={styles.historyLink}>5-mo history</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pre-Approved Tiers</Text>
            <Pressable onPress={() => showComingSoon("Credit limits")}>
              <Text style={styles.link}>View limits ›</Text>
            </Pressable>
          </View>

          <View style={styles.tierRow}>
            <View style={styles.tierCard}>
              <View style={styles.tierTag}>
                <Text style={styles.tierTagText}>0% Fee</Text>
              </View>
              <FontAwesome5
                name="bolt"
                size={15}
                color="#C8D2E0"
                style={styles.tierIcon}
              />
              <Text style={styles.tierName}>Starter Micro</Text>
              <Text style={styles.tierSub}>Up to ₱5,000</Text>
              <Text style={styles.tierRate}>
                1.2%<Text style={styles.tierSub}> /mo</Text>
              </Text>
              <Pressable onPress={() => showComingSoon("Starter Micro")}>
                <Text style={styles.tierAction}>Apply now →</Text>
              </Pressable>
            </View>

            <View style={styles.tierCard}>
              <View style={styles.tierTag}>
                <Text style={styles.tierTagText}>Flexi-Pay</Text>
              </View>
              <FontAwesome5
                name="check-circle"
                size={15}
                color="#C8D2E0"
                style={styles.tierIcon}
              />
              <Text style={styles.tierName}>Business Boost</Text>
              <Text style={styles.tierSub}>Up to ₱45,000</Text>
              <Text style={styles.tierRate}>
                3–6<Text style={styles.tierSub}> months</Text>
              </Text>
              <Pressable onPress={() => showComingSoon("Business Boost")}>
                <Text style={styles.exploreAction}>Explore →</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <Pressable onPress={() => showComingSoon("Activity history")}>
              <Text style={styles.historyLink}>All history</Text>
            </Pressable>
          </View>

          <View style={styles.activityCard}>
            <View style={styles.activityRow}>
              <View style={[styles.activityIcon, styles.coralIcon]}>
                <FontAwesome5 name="arrow-up" size={12} color={COLORS.coral} />
              </View>
              <View style={styles.activityText}>
                <Text style={styles.activityTitle}>Installment #2 Repaid</Text>
                <Text style={styles.activitySub}>Starter Micro • Sep 28</Text>
              </View>
              <View style={styles.activityAmount}>
                <Text style={styles.amountNegative}>-₱3,250.00</Text>
                <Text style={styles.amountStatus}>Completed</Text>
              </View>
            </View>

            <View style={styles.activityRow}>
              <View style={[styles.activityIcon, styles.blueIcon]}>
                <FontAwesome5 name="arrow-down" size={12} color={COLORS.navy} />
              </View>
              <View style={styles.activityText}>
                <Text style={styles.activityTitle}>Loan Payout Received</Text>
                <Text style={styles.activitySub}>Bank Transfer • Sep 14</Text>
              </View>
              <View style={styles.activityAmount}>
                <Text style={styles.amountPositive}>+₱15,000.00</Text>
                <Text style={styles.amountStatus}>Credited</Text>
              </View>
            </View>

            <View style={styles.activityRow}>
              <View style={[styles.activityIcon, styles.blueIcon]}>
                <FontAwesome5 name="clock" size={12} color={COLORS.muted} />
              </View>
              <View style={styles.activityText}>
                <Text style={styles.activityTitle}>Scheduled Auto-Debit</Text>
                <Text style={styles.activitySub}>Installment #3 • Nov 02</Text>
              </View>
              <View style={styles.activityAmount}>
                <Text style={styles.amountUpcoming}>₱3,250.00</Text>
                <Text style={styles.amountDue}>Upcoming</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.tabBar}>
          {[
            { label: "Home", icon: "th-large", active: true },
            { label: "Loans", icon: "file-invoice-dollar" },
            { label: "Repay", icon: "money-bill-wave" },
            { label: "Activity", icon: "calendar-alt" },
            { label: "Profile", icon: "user" },
          ].map((tab) => (
            <Pressable
              key={tab.label}
              onPress={() =>
                tab.active ? undefined : showComingSoon(tab.label)
              }
              style={styles.tabItem}
            >
              <FontAwesome5
                name={tab.icon}
                size={15}
                color={tab.active ? COLORS.coral : "#9BA8B8"}
              />
              <Text
                style={[styles.tabLabel, tab.active && styles.activeTabLabel]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  page: {
    flex: 1,
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    backgroundColor: "#DDE8F4",
  },
  avatarText: {
    color: COLORS.navy,
    fontSize: 12,
    fontWeight: "800",
  },
  onlineDot: {
    position: "absolute",
    right: -1,
    bottom: -1,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: COLORS.green,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  eyebrow: {
    color: "#91A0B4",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.45,
  },
  profileName: {
    marginTop: 2,
    color: COLORS.navy,
    fontSize: 12,
    fontWeight: "700",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  headerIcon: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: COLORS.white,
  },
  notificationDot: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.coral,
  },
  searchBox: {
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    marginBottom: 14,
    borderRadius: 22,
    backgroundColor: COLORS.white,
  },
  searchInput: {
    flex: 1,
    color: COLORS.navy,
    fontSize: 11,
  },
  card: {
    padding: 14,
    marginBottom: 14,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#EEF1F6",
  },
  balanceTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  labelWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  cardLabel: {
    color: COLORS.muted,
    fontSize: 10,
  },
  balanceLine: {
    marginTop: 4,
  },
  balanceAmount: {
    color: COLORS.navy,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  balanceApprox: {
    marginTop: 1,
    color: "#8B9AB0",
    fontSize: 9,
  },
  loanPill: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.coralPale,
  },
  loanPillText: {
    color: COLORS.coral,
    fontSize: 9,
    fontWeight: "700",
    lineHeight: 12,
  },
  creditBox: {
    padding: 10,
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: "#F7F9FC",
  },
  creditTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  creditLabel: {
    color: COLORS.muted,
    fontSize: 9,
  },
  creditValue: {
    color: COLORS.navy,
    fontSize: 9,
    fontWeight: "700",
  },
  creditMuted: {
    color: "#9BA8B8",
    fontWeight: "400",
  },
  progressTrack: {
    height: 4,
    overflow: "hidden",
    marginTop: 8,
    borderRadius: 3,
    backgroundColor: "#E5EAF1",
  },
  progressFill: {
    width: "38%",
    height: "100%",
    borderRadius: 3,
    backgroundColor: COLORS.coral,
  },
  dueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  dueDate: {
    color: COLORS.muted,
    fontSize: 9,
  },
  dueAmount: {
    color: COLORS.coral,
    fontSize: 9,
    fontWeight: "700",
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  primaryButton: {
    flex: 1,
    height: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 11,
    backgroundColor: COLORS.navy,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "700",
  },
  secondaryButton: {
    flex: 1,
    height: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.white,
  },
  secondaryButtonText: {
    color: COLORS.navy,
    fontSize: 10,
    fontWeight: "700",
  },
  performanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    marginTop: 2,
    color: COLORS.navy,
    fontSize: 12,
    fontWeight: "700",
  },
  ontimePill: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: COLORS.greenPale,
  },
  ontimeText: {
    color: COLORS.green,
    fontSize: 9,
    fontWeight: "700",
  },
  chart: {
    height: 100,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingTop: 12,
  },
  chartColumn: {
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  chartAmount: {
    marginBottom: 3,
    color: COLORS.coral,
    fontSize: 8,
    fontWeight: "700",
  },
  chartBar: {
    width: 22,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  chartMonth: {
    marginTop: 5,
    color: COLORS.muted,
    fontSize: 8,
  },
  chartFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F2F6",
  },
  chartFooterText: {
    color: COLORS.muted,
    fontSize: 9,
  },
  strong: {
    color: COLORS.navy,
    fontWeight: "700",
  },
  historyLink: {
    color: "#91A0B4",
    fontSize: 9,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
    marginBottom: 9,
    paddingHorizontal: 2,
  },
  link: {
    color: COLORS.coral,
    fontSize: 10,
    fontWeight: "600",
  },
  tierRow: {
    flexDirection: "row",
    gap: 9,
    marginBottom: 14,
  },
  tierCard: {
    flex: 1,
    minHeight: 122,
    padding: 11,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.white,
  },
  tierTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#F3F6FA",
  },
  tierTagText: {
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: "600",
  },
  tierIcon: {
    position: "absolute",
    top: 15,
    right: 12,
  },
  tierName: {
    marginTop: 10,
    color: COLORS.navy,
    fontSize: 10,
    fontWeight: "700",
  },
  tierSub: {
    marginTop: 4,
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: "400",
  },
  tierRate: {
    marginTop: 8,
    color: COLORS.navy,
    fontSize: 11,
    fontWeight: "700",
  },
  tierAction: {
    marginTop: 10,
    color: COLORS.coral,
    fontSize: 9,
    fontWeight: "600",
  },
  exploreAction: {
    marginTop: 10,
    color: COLORS.navy,
    fontSize: 9,
    fontWeight: "600",
  },
  activityCard: {
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EEF1F6",
    backgroundColor: COLORS.white,
  },
  activityRow: {
    minHeight: 57,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F6",
  },
  activityIcon: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  coralIcon: {
    backgroundColor: COLORS.coralPale,
  },
  blueIcon: {
    backgroundColor: COLORS.bluePale,
  },
  activityText: {
    flex: 1,
    minWidth: 0,
  },
  activityTitle: {
    color: COLORS.navy,
    fontSize: 9,
    fontWeight: "700",
  },
  activitySub: {
    marginTop: 3,
    color: COLORS.muted,
    fontSize: 8,
  },
  activityAmount: {
    alignItems: "flex-end",
  },
  amountNegative: {
    color: COLORS.navy,
    fontSize: 9,
    fontWeight: "700",
  },
  amountPositive: {
    color: COLORS.coral,
    fontSize: 9,
    fontWeight: "700",
  },
  amountUpcoming: {
    color: COLORS.navy,
    fontSize: 9,
    fontWeight: "700",
  },
  amountStatus: {
    marginTop: 3,
    color: COLORS.green,
    fontSize: 8,
  },
  amountDue: {
    marginTop: 3,
    color: COLORS.coral,
    fontSize: 8,
  },
  tabBar: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
    backgroundColor: COLORS.white,
  },
  tabItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  tabLabel: {
    color: "#9BA8B8",
    fontSize: 8,
  },
  activeTabLabel: {
    color: COLORS.coral,
    fontWeight: "700",
  },
});
