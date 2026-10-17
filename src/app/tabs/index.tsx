import { useState } from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';

type Mode = 'lend' | 'borrow';

const palette = {
  ink: '#101C2C',
  inkSoft: '#25384A',
  coral: '#D96943',
  cream: '#F6F3EE',
  paper: '#FFFFFF',
  muted: '#7B8794',
  line: '#E8E3DC',
  pale: '#EFEAE3',
  green: '#18815F',
};

const formatPeso = (amount: number) =>
  '₱' + amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function HomeScreen() {
  const [mode, setMode] = useState<Mode>('lend');
  const [available, setAvailable] = useState(1500);
  const [topUpVisible, setTopUpVisible] = useState(false);
  const [amount, setAmount] = useState('500');
  const [method, setMethod] = useState('GCash');
  const [kycStarted, setKycStarted] = useState(false);
  const [notice, setNotice] = useState('');

  const simulateTopUp = () => {
    const value = Number(amount.replace(/,/g, ''));
    if (!Number.isFinite(value) || value < 100 || value > 50000) {
      setNotice('Enter a demo amount from ₱100 to ₱50,000.');
      return;
    }
    setAvailable((current) => current + value);
    setTopUpVisible(false);
    setNotice(formatPeso(value) + ' added to your simulated wallet. No payment was made.');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brandLockup}>
            <View style={styles.brandMark}><Text style={styles.brandMarkText}>L</Text></View>
            <Text style={styles.brandName}>loanify</Text>
            <View style={styles.demoTag}><View style={styles.demoDot} /><Text style={styles.demoTagText}>DEMO</Text></View>
          </View>
          <Pressable accessibilityLabel="Open profile" style={styles.avatar} onPress={() => setNotice('Demo profile · Ana Mendoza')}>
            <Text style={styles.avatarText}>AM</Text>
          </Pressable>
        </View>

        <View style={styles.greeting}>
          <Text style={styles.kicker}>YOUR LOANIFY SPACE</Text>
          <Text style={styles.title}>Good morning, Ana</Text>
          <Text style={styles.subtitle}>A little more room to move forward.</Text>
        </View>

        <View style={styles.modeSwitch}>
          <Pressable onPress={() => setMode('lend')} style={[styles.modeOption, mode === 'lend' && styles.modeOptionActive]}>
            <Text style={[styles.modeText, mode === 'lend' && styles.modeTextActive]}>I want to lend</Text>
          </Pressable>
          <Pressable onPress={() => setMode('borrow')} style={[styles.modeOption, mode === 'borrow' && styles.modeOptionActive]}>
            <Text style={[styles.modeText, mode === 'borrow' && styles.modeTextActive]}>I need a loan</Text>
          </Pressable>
        </View>

        <View style={styles.walletCard}>
          <View style={styles.walletHeading}>
            <Text style={styles.walletLabel}>AVAILABLE BALANCE</Text>
            <Text style={styles.walletGlyph}>◈</Text>
          </View>
          <Text style={styles.balance}>{formatPeso(available)}</Text>
          <Text style={styles.walletCaption}>Simulated wallet · no real funds</Text>
          <View style={styles.walletActions}>
            <Pressable style={styles.topUpButton} onPress={() => setTopUpVisible(true)}>
              <Text style={styles.topUpButtonText}>＋  Top up</Text>
            </Pressable>
            <Pressable style={styles.historyButton} onPress={() => setNotice('Wallet history is simulated in this prototype.')}>
              <Text style={styles.historyButtonText}>Activity  ↗</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.balanceStrip}>
          <View style={styles.balanceMetric}>
            <Text style={styles.metricLabel}>RESERVED</Text>
            <Text style={styles.metricValue}>{formatPeso(0)}</Text>
          </View>
          <View style={styles.metricRule} />
          <View style={styles.balanceMetric}>
            <Text style={styles.metricLabel}>ON LOAN</Text>
            <Text style={styles.metricValue}>{formatPeso(4800)}</Text>
          </View>
          <Text style={styles.demoLedger}>DEMO LEDGER</Text>
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeadingCopy}>
            <Text style={styles.sectionTitle}>{mode === 'lend' ? 'A request to explore' : 'Your borrowing journey'}</Text>
            <Text style={styles.sectionSubtitle}>{mode === 'lend' ? 'Review the story before you decide.' : 'Start a request when you are ready.'}</Text>
          </View>
          <Pressable onPress={() => router.navigate('/explore')}><Text style={styles.textLink}>See all</Text></Pressable>
        </View>

        {mode === 'lend' ? (
          <View style={styles.loanCard}>
            <View style={styles.loanCardTop}>
              <View style={styles.loanAvatar}><Text style={styles.loanAvatarText}>MB</Text></View>
              <View style={styles.loanIdentity}>
                <Text style={styles.loanName}>Mika’s neighborhood bakery</Text>
                <Text style={styles.loanPurpose}>Equipment upgrade · 6 months</Text>
              </View>
              <View style={styles.verifiedMark}><Text style={styles.verifiedMarkText}>✓</Text></View>
            </View>
            <View style={styles.loanAmountRow}>
              <View><Text style={styles.metricLabel}>REQUESTED</Text><Text style={styles.loanAmount}>{formatPeso(12000)}</Text></View>
              <Text style={styles.fundedText}>60% funded</Text>
            </View>
            <View style={styles.progressTrack}><View style={styles.progressFill} /></View>
            <View style={styles.loanCardFooter}>
              <Text style={styles.proposedRate}>Proposed terms · demo</Text>
              <Pressable style={styles.reviewButton} onPress={() => router.navigate('/explore')}>
                <Text style={styles.reviewButtonText}>Review request</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.borrowCard}>
            <Text style={styles.borrowEyebrow}>BORROWER SPACE · DEMO</Text>
            <Text style={styles.borrowTitle}>Put your next step into words.</Text>
            <Text style={styles.borrowCopy}>Create a sample request and explore how peer-to-peer lending could work. Nothing is submitted to a lender.</Text>
            <Pressable style={styles.borrowButton} onPress={() => setNotice('Loan request flow is a prototype placeholder.')}>
              <Text style={styles.borrowButtonText}>Start a demo request  →</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.kycCard}>
          <View style={styles.kycIcon}><Text style={styles.kycIconText}>⌑</Text></View>
          <View style={styles.kycCopy}>
            <Text style={styles.kycTitle}>Profile verification</Text>
            <Text style={styles.kycSubtitle}>{kycStarted ? 'In review · simulated only' : 'Not started · simulated only'}</Text>
          </View>
          <Pressable style={styles.kycAction} onPress={() => {
            setKycStarted(true);
            setNotice('Demo step only. No identity documents were collected.');
          }}>
            <Text style={styles.kycActionText}>{kycStarted ? 'View' : 'Start'}</Text>
          </Pressable>
        </View>

        <View style={styles.footerNote}>
          <Text style={styles.footerDot}>●</Text>
          <Text style={styles.footerText}>Simulation only. No real money, payments, or KYC.</Text>
        </View>
        {notice ? <Pressable onPress={() => setNotice('')} style={styles.notice}><Text style={styles.noticeText}>{notice}  ×</Text></Pressable> : null}
      </ScrollView>

      <Modal visible={topUpVisible} transparent animationType="fade" onRequestClose={() => setTopUpVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View><Text style={styles.modalTitle}>Add demo funds</Text><Text style={styles.modalSubtitle}>Payment simulator · no gateway connected</Text></View>
              <Pressable accessibilityLabel="Close top up" onPress={() => setTopUpVisible(false)} style={styles.closeButton}><Text style={styles.closeText}>×</Text></Pressable>
            </View>
            <Text style={styles.modalLabel}>CHOOSE A SIMULATED METHOD</Text>
            <View style={styles.methods}>
              {['GCash', 'Maya', 'Card'].map((item) => (
                <Pressable key={item} onPress={() => setMethod(item)} style={[styles.methodButton, method === item && styles.methodButtonSelected]}>
                  <Text style={[styles.methodText, method === item && styles.methodTextSelected]}>{item}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.modalLabel}>TOP-UP AMOUNT · PHP</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="Enter amount"
              placeholderTextColor={palette.muted}
              style={styles.amountInput}
            />
            <View style={styles.presets}>
              {['500', '1000', '5000'].map((value) => (
                <Pressable key={value} onPress={() => setAmount(value)} style={styles.preset}>
                  <Text style={styles.presetText}>+₱{Number(value).toLocaleString('en-PH')}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.modalDisclaimer}>This only updates the balance shown in this prototype.</Text>
            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={() => setTopUpVisible(false)}><Text style={styles.cancelText}>Cancel</Text></Pressable>
              <Pressable style={styles.confirmButton} onPress={simulateTopUp}><Text style={styles.confirmText}>Simulate top up</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.cream },
  page: { width: '100%', maxWidth: 520, alignSelf: 'center', paddingHorizontal: 22, paddingTop: 18, paddingBottom: 36 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 },
  brandLockup: { flexDirection: 'row', alignItems: 'center' },
  brandMark: { width: 32, height: 32, borderRadius: 11, backgroundColor: palette.ink, alignItems: 'center', justifyContent: 'center', marginRight: 9 },
  brandMarkText: { color: palette.paper, fontSize: 17, fontWeight: '800' },
  brandName: { color: palette.ink, fontSize: 20, fontWeight: '800', letterSpacing: -0.7 },
  demoTag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 20, backgroundColor: '#EAE5DC', marginLeft: 10 },
  demoDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: palette.coral, marginRight: 5 },
  demoTagText: { color: palette.inkSoft, fontSize: 9, fontWeight: '800', letterSpacing: 0.9 },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#DDD4C9', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: palette.ink, fontSize: 11, fontWeight: '800' },
  greeting: { marginBottom: 22 },
  kicker: { color: palette.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: 8 },
  title: { color: palette.ink, fontSize: 29, lineHeight: 34, fontWeight: '800', letterSpacing: -1.2 },
  subtitle: { color: palette.muted, fontSize: 14, marginTop: 5 },
  modeSwitch: { flexDirection: 'row', backgroundColor: '#EAE5DC', padding: 4, borderRadius: 15, marginBottom: 18 },
  modeOption: { flex: 1, minHeight: 42, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  modeOptionActive: { backgroundColor: palette.paper, shadowColor: '#101C2C', shadowOpacity: 0.07, shadowRadius: 8, elevation: 1 },
  modeText: { color: palette.muted, fontSize: 13, fontWeight: '700' },
  modeTextActive: { color: palette.ink },
  walletCard: { backgroundColor: palette.ink, borderRadius: 22, padding: 21, marginBottom: 12 },
  walletHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  walletLabel: { color: '#C7D2DC', fontSize: 10, fontWeight: '800', letterSpacing: 1.1 },
  walletGlyph: { color: '#D7C9FF', fontSize: 22 },
  balance: { color: palette.paper, fontSize: 31, fontWeight: '800', letterSpacing: -1.1, marginTop: 10 },
  walletCaption: { color: '#B7C4D0', fontSize: 12, marginTop: 5 },
  walletActions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  topUpButton: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 44, borderRadius: 13, backgroundColor: palette.coral },
  topUpButtonText: { color: palette.paper, fontWeight: '800', fontSize: 13 },
  historyButton: { alignItems: 'center', justifyContent: 'center', minHeight: 44, paddingHorizontal: 16, borderRadius: 13, backgroundColor: '#25384A' },
  historyButtonText: { color: '#E9EFF4', fontWeight: '700', fontSize: 12 },
  balanceStrip: { flexDirection: 'row', alignItems: 'center', backgroundColor: palette.paper, borderRadius: 17, paddingHorizontal: 16, paddingVertical: 15, marginBottom: 28 },
  balanceMetric: { flex: 1 },
  metricLabel: { color: palette.muted, fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  metricValue: { color: palette.ink, fontSize: 16, fontWeight: '800', marginTop: 5 },
  metricRule: { height: 35, width: 1, backgroundColor: palette.line, marginHorizontal: 14 },
  demoLedger: { position: 'absolute', right: 14, bottom: -17, color: '#9C958B', fontSize: 8, fontWeight: '800', letterSpacing: 0.7 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 },
  sectionHeadingCopy: { flexShrink: 1, paddingRight: 10 },
  sectionTitle: { color: palette.ink, fontSize: 18, fontWeight: '800', letterSpacing: -0.35 },
  sectionSubtitle: { color: palette.muted, fontSize: 12, marginTop: 4 },
  textLink: { color: palette.coral, fontSize: 12, fontWeight: '800' },
  loanCard: { backgroundColor: palette.paper, borderRadius: 20, padding: 17, borderWidth: 1, borderColor: palette.line, marginBottom: 20 },
  loanCardTop: { flexDirection: 'row', alignItems: 'center' },
  loanAvatar: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#F1E0D8', alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  loanAvatarText: { color: palette.coral, fontSize: 12, fontWeight: '800' },
  loanIdentity: { flex: 1 },
  loanName: { color: palette.ink, fontSize: 13, fontWeight: '800' },
  loanPurpose: { color: palette.muted, fontSize: 11, marginTop: 4 },
  verifiedMark: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#E7F4EE', alignItems: 'center', justifyContent: 'center' },
  verifiedMarkText: { color: palette.green, fontSize: 13, fontWeight: '900' },
  loanAmountRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 18, marginBottom: 9 },
  loanAmount: { color: palette.ink, fontSize: 19, fontWeight: '800', marginTop: 4 },
  fundedText: { color: palette.green, fontSize: 11, fontWeight: '800', marginBottom: 2 },
  progressTrack: { height: 5, borderRadius: 4, backgroundColor: '#EEE9E2', overflow: 'hidden' },
  progressFill: { width: '60%', height: '100%', backgroundColor: palette.coral, borderRadius: 4 },
  loanCardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15 },
  proposedRate: { color: palette.muted, fontSize: 10 },
  reviewButton: { backgroundColor: palette.ink, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 11 },
  reviewButtonText: { color: palette.paper, fontSize: 11, fontWeight: '800' },
  borrowCard: { backgroundColor: palette.paper, borderWidth: 1, borderColor: palette.line, borderRadius: 20, padding: 20, marginBottom: 20 },
  borrowEyebrow: { color: palette.coral, fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  borrowTitle: { color: palette.ink, fontSize: 20, fontWeight: '800', lineHeight: 26, marginTop: 11 },
  borrowCopy: { color: palette.muted, fontSize: 13, lineHeight: 20, marginTop: 7 },
  borrowButton: { alignSelf: 'flex-start', backgroundColor: palette.ink, paddingHorizontal: 15, paddingVertical: 12, borderRadius: 12, marginTop: 16 },
  borrowButtonText: { color: palette.paper, fontSize: 12, fontWeight: '800' },
  kycCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EDE8E0', borderRadius: 17, padding: 14, marginTop: 2 },
  kycIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: palette.paper, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  kycIconText: { color: palette.coral, fontSize: 18, fontWeight: '700' },
  kycCopy: { flex: 1 },
  kycTitle: { color: palette.ink, fontSize: 12, fontWeight: '800' },
  kycSubtitle: { color: palette.muted, fontSize: 10, marginTop: 4 },
  kycAction: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: 10, backgroundColor: palette.paper },
  kycActionText: { color: palette.ink, fontSize: 11, fontWeight: '800' },
  footerNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 18 },
  footerDot: { color: palette.green, fontSize: 8, marginRight: 7 },
  footerText: { color: palette.muted, fontSize: 10 },
  notice: { backgroundColor: palette.ink, padding: 13, borderRadius: 13, marginTop: 12 },
  noticeText: { color: palette.paper, fontSize: 11, textAlign: 'center', lineHeight: 17 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(16,28,44,0.58)', justifyContent: 'center', padding: 18 },
  modalCard: { width: '100%', maxWidth: 420, alignSelf: 'center', backgroundColor: palette.paper, borderRadius: 22, padding: 22 },
  modalHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 23 },
  modalTitle: { color: palette.ink, fontSize: 20, fontWeight: '800' },
  modalSubtitle: { color: palette.muted, fontSize: 11, marginTop: 5 },
  closeButton: { width: 30, height: 30, borderRadius: 15, backgroundColor: palette.cream, alignItems: 'center', justifyContent: 'center' },
  closeText: { color: palette.ink, fontSize: 21, lineHeight: 24 },
  modalLabel: { color: palette.muted, fontSize: 9, fontWeight: '800', letterSpacing: 0.8, marginBottom: 9, marginTop: 2 },
  methods: { flexDirection: 'row', gap: 8, marginBottom: 19 },
  methodButton: { flex: 1, borderWidth: 1, borderColor: palette.line, borderRadius: 12, alignItems: 'center', justifyContent: 'center', minHeight: 42 },
  methodButtonSelected: { borderColor: palette.ink, backgroundColor: palette.ink },
  methodText: { color: palette.inkSoft, fontSize: 12, fontWeight: '700' },
  methodTextSelected: { color: palette.paper },
  amountInput: { height: 48, backgroundColor: '#F7F8FA', borderWidth: 1, borderColor: palette.line, borderRadius: 12, paddingHorizontal: 14, color: palette.ink, fontSize: 15, fontWeight: '700' },
  presets: { flexDirection: 'row', gap: 8, marginTop: 10, marginBottom: 14 },
  preset: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 10, backgroundColor: palette.cream },
  presetText: { color: palette.ink, fontSize: 10, fontWeight: '800' },
  modalDisclaimer: { color: palette.muted, fontSize: 10, lineHeight: 15, marginBottom: 17 },
  modalActions: { flexDirection: 'row', gap: 9 },
  cancelButton: { flex: 0.8, justifyContent: 'center', alignItems: 'center', minHeight: 46, borderRadius: 12, backgroundColor: '#F1F3F5' },
  cancelText: { color: palette.inkSoft, fontWeight: '700', fontSize: 12 },
  confirmButton: { flex: 1.2, justifyContent: 'center', alignItems: 'center', minHeight: 46, borderRadius: 12, backgroundColor: palette.coral },
  confirmText: { color: palette.paper, fontWeight: '800', fontSize: 12 },
});
