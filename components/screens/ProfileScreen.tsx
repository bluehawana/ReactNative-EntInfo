import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  TextInput,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { useWatchlist, useRemoveFromWatchlist } from '../../hooks/useWatchlist';
import { isAppleSignInAvailable } from '../../services/auth';
import { IMAGE_BASE } from '../../services/api';
import { colors, spacing } from '../../theme/simple';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { EmptyState } from '../ui/EmptyState';
import { Ionicons } from '@expo/vector-icons';
import type { WatchlistItem } from '../../services/watchlist';

function SignInView() {
  const { signInWithGoogle, signInWithApple, sendEmailLink } = useAuth();
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const handleGoogle = async () => {
    try {
      setLoading('google');
      await signInWithGoogle();
    } catch (error: any) {
      if (error.code !== 'SIGN_IN_CANCELLED') {
        Alert.alert('Sign In Failed', error.message);
      }
    } finally {
      setLoading(null);
    }
  };

  const handleApple = async () => {
    try {
      setLoading('apple');
      await signInWithApple();
    } catch (error: any) {
      if (error.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('Sign In Failed', error.message);
      }
    } finally {
      setLoading(null);
    }
  };

  const handleEmailLink = async () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address.');
      return;
    }
    try {
      setLoading('email');
      await sendEmailLink(email.trim());
      setEmailSent(true);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.signInContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.signInContent}
        keyboardShouldPersistTaps="handled"
      >
        <Ionicons name="person-circle-outline" size={80} color={colors.textTertiary} />
        <Text style={styles.signInTitle}>Sign in to 2Watch</Text>
        <Text style={styles.signInSubtitle}>
          Sync your watchlist across all your devices
        </Text>

        <TouchableOpacity
          style={[styles.signInButton, styles.googleButton]}
          onPress={handleGoogle}
          disabled={loading !== null}
        >
          <Ionicons name="logo-google" size={20} color="#fff" />
          <Text style={styles.signInButtonText}>
            {loading === 'google' ? 'Signing in...' : 'Continue with Google'}
          </Text>
        </TouchableOpacity>

        {isAppleSignInAvailable() && (
          <TouchableOpacity
            style={[styles.signInButton, styles.appleButton]}
            onPress={handleApple}
            disabled={loading !== null}
          >
            <Ionicons name="logo-apple" size={20} color="#fff" />
            <Text style={styles.signInButtonText}>
              {loading === 'apple' ? 'Signing in...' : 'Continue with Apple'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {emailSent ? (
          <View style={styles.emailSentBox}>
            <Ionicons name="mail-outline" size={32} color={colors.primary} />
            <Text style={styles.emailSentText}>
              Check your email for a sign-in link!
            </Text>
            <Text style={styles.emailSentSubtext}>
              We sent a link to {email}
            </Text>
          </View>
        ) : (
          <View style={styles.emailSection}>
            <TextInput
              style={styles.emailInput}
              placeholder="Enter your email"
              placeholderTextColor={colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={[styles.signInButton, styles.emailButton]}
              onPress={handleEmailLink}
              disabled={loading !== null}
            >
              <Ionicons name="mail-outline" size={20} color="#fff" />
              <Text style={styles.signInButtonText}>
                {loading === 'email' ? 'Sending...' : 'Sign in with Email'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function ProfileHeader() {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch (error: any) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  if (!user) return null;

  return (
    <View style={styles.profileHeader}>
      {user.photoURL ? (
        <Image source={{ uri: user.photoURL }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Ionicons name="person" size={32} color={colors.textTertiary} />
        </View>
      )}
      <View style={styles.profileInfo}>
        <Text style={styles.profileName} numberOfLines={1}>
          {user.displayName || 'User'}
        </Text>
        <Text style={styles.profileEmail} numberOfLines={1}>
          {user.email || ''}
        </Text>
      </View>
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={22} color={colors.error} />
      </TouchableOpacity>
    </View>
  );
}

export function ProfileScreen() {
  const { user, isLoading: authLoading } = useAuth();
  const navigation = useNavigation<any>();
  const { data: watchlist, isLoading: watchlistLoading } = useWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  if (authLoading) return <LoadingSpinner />;

  if (!user) return <SignInView />;

  const handlePress = (item: WatchlistItem) => {
    navigation.navigate('Detail', { id: item.id, mediaType: item.mediaType });
  };

  const handleRemove = (item: WatchlistItem) => {
    Alert.alert('Remove from Watchlist', `Remove "${item.title}" from your watchlist?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () =>
          removeFromWatchlist.mutate({ id: item.id, mediaType: item.mediaType }),
      },
    ]);
  };

  const renderItem = ({ item }: { item: WatchlistItem }) => {
    const imageUri = item.poster_path ? `${IMAGE_BASE}${item.poster_path}` : null;

    return (
      <TouchableOpacity
        style={[styles.itemContainer, { backgroundColor: colors.surface }]}
        onPress={() => handlePress(item)}
        onLongPress={() => handleRemove(item)}
        activeOpacity={0.7}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={[styles.poster, { backgroundColor: colors.borderLight }]}
          />
        ) : (
          <View
            style={[styles.poster, styles.placeholder, { backgroundColor: colors.borderLight }]}
          >
            <Ionicons name="film-outline" size={24} color={colors.textTertiary} />
          </View>
        )}
        <View style={styles.itemInfo}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={[styles.itemMeta, { color: colors.textSecondary }]}>
              {item.mediaType === 'movie' ? 'Movie' : 'TV Show'} •{' '}
              {item.vote_average.toFixed(1)}/10
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.removeButton, { backgroundColor: colors.error }]}
            onPress={() => handleRemove(item)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close" size={18} color={colors.textInverse} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ProfileHeader />
      <Text style={styles.sectionTitle}>My Watchlist</Text>
      {watchlistLoading ? (
        <LoadingSpinner />
      ) : !watchlist || watchlist.length === 0 ? (
        <View style={styles.emptyWatchlist}>
          <EmptyState
            message="Your Watchlist is Empty"
            subMessage="Tap the bookmark button on any movie or TV show to add it here."
            icon={<Ionicons name="bookmark-outline" size={48} color={colors.textTertiary} />}
          />
        </View>
      ) : (
        <FlatList
          data={watchlist}
          keyExtractor={(item) => `${item.mediaType}-${item.id}`}
          renderItem={renderItem}
          contentContainerStyle={[styles.listContent, { padding: spacing.md }]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  // Sign-in styles
  signInContainer: { flex: 1, backgroundColor: colors.background },
  signInContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  signInTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  signInSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: spacing.md,
    gap: 10,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  googleButton: { backgroundColor: '#4285F4' },
  appleButton: { backgroundColor: '#000' },
  emailButton: { backgroundColor: colors.primary },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: spacing.md,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: {
    color: colors.textTertiary,
    paddingHorizontal: spacing.md,
    fontSize: 14,
  },
  emailSection: { width: '100%' },
  emailInput: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  emailSentBox: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 12,
    width: '100%',
  },
  emailSentText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  emailSentSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  // Profile header styles
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  signOutButton: {
    padding: spacing.sm,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  emptyWatchlist: { flex: 1 },
  // Watchlist item styles (reused from WatchingListScreen)
  listContent: { paddingBottom: 100 },
  itemContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  poster: { width: 80, height: 120 },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  itemInfo: { flex: 1, padding: 12, flexDirection: 'row', alignItems: 'center' },
  itemTitle: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  itemMeta: { fontSize: 13 },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});
