export type MessageType = 'text' | 'image' | 'voice' | 'document' | 'location' | 'contact' | 'poll';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // user IDs who voted
}

export interface PollData {
  question: string;
  options: PollOption[];
  allowMultiple: boolean;
}

export interface LocationData {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface ContactShareData {
  name: string;
  phone: string;
  avatar: string;
}

export interface MessageReply {
  id: string;
  senderName: string;
  text: string;
  type: MessageType;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string; // 'me' or contactId
  senderName?: string;
  text?: string;
  timestamp: string; // ISO string or time string
  status: MessageStatus;
  type: MessageType;
  mediaUrl?: string;
  mediaName?: string;
  mediaSize?: string;
  mediaDuration?: number; // seconds for audio/video
  voiceWaveform?: number[];
  audioBlobUrl?: string; // dynamically recorded audio
  replyTo?: MessageReply;
  reactions?: Record<string, string[]>; // emoji -> array of userIds
  isStarred?: boolean;
  pollData?: PollData;
  locationData?: LocationData;
  contactData?: ContactShareData;
  // WhatsApp Gold Features
  isDeletedBySender?: boolean; // Anti-delete feature: kept visible with a deleted icon
  isViewOnce?: boolean; // View once media that can be reopened unlimited times
  isForwarded?: boolean;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  phone?: string;
  about?: string;
  isGroup?: boolean;
  groupMembers?: string[];
  unreadCount: number;
  lastMessage?: {
    text: string;
    timestamp: string;
    type: MessageType;
    senderId: string;
    status: MessageStatus;
  };
  onlineStatus: 'online' | 'offline' | 'typing...' | 'recording audio...';
  lastSeen?: string;
  isPinned?: boolean;
  isMuted?: boolean;
  isArchived?: boolean;
  customWallpaper?: string;
  // Gold features per chat
  isLocked?: boolean;
  autoDownloadDisabled?: boolean;
  hideBlueTicksCustom?: boolean;
}

export interface StatusStory {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  timestamp: string;
  type: 'image' | 'text';
  content: string; // image URL or text
  bgColor?: string;
  seen: boolean;
  isDeletedBySender?: boolean; // Anti-delete status
}

export interface CallLog {
  id: string;
  contactId: string;
  contactName: string;
  contactAvatar: string;
  timestamp: string;
  type: 'incoming' | 'outgoing' | 'missed';
  isVideo: boolean;
  duration?: number; // in seconds
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  about: string;
  avatar: string;
}

export type WallpaperTheme = 'classic-dark' | 'classic-light' | 'emerald' | 'midnight' | 'mocha' | 'gold';

export type GoldThemeId = 'gold' | 'classic-green' | 'dark-gold' | 'oneui-dark' | 'oneui-light' | 'ios-dark' | 'royal-black';

export type EmojiStyle = 'whatsapp' | 'ios' | 'facebook' | 'android';

export interface GoldPrivacySettings {
  hideLastSeen: boolean;
  freezeLastSeenDate: string;
  hideBlueTicksContacts: boolean;
  hideBlueTicksGroups: boolean;
  hideSecondTickContacts: boolean;
  hideSecondTickGroups: boolean;
  hideTypingContacts: boolean;
  hideTypingGroups: boolean;
  hideRecording: boolean;
  hideBlueMicrophone: boolean;
  hideStatusView: boolean; // Watch status without other knowing
  antiDeleteMessages: boolean; // Keep messages even if sender deletes
  antiDeleteStatus: boolean; // Keep status even if sender deletes
  disableForwardedTag: boolean;
  allowUnlimitedViewOnce: boolean;
  dndInternetCut: boolean; // Cut internet for WhatsApp only
}

export interface AccountProfile {
  id: string;
  slotNumber: number;
  name: string;
  phone: string;
  about: string;
  avatar: string;
}

export interface AutoReplyRule {
  id: string;
  triggerText: string;
  replyText: string;
  enabled: boolean;
  delaySeconds: number;
}

export interface ScheduledMessage {
  id: string;
  chatId: string;
  contactName: string;
  text: string;
  time: string;
  sent: boolean;
}

export interface ContactGroup {
  id: string;
  name: string;
  color: string;
  chatIds: string[];
  icon?: string;
}
