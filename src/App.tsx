/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MessageSquare,
  CircleDot,
  Phone,
  Settings,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  Send,
  Check,
  CheckCheck,
  PhoneCall,
  Video,
  ArrowRight,
  ArrowLeft,
  X,
  Image as ImageIcon,
  FileText,
  BarChart2,
  MapPin,
  User,
  Plus,
  Star,
  Trash2,
  Copy,
  CornerUpLeft,
  Pin,
  Volume2,
  VolumeX,
  Users,
  Camera,
  Archive,
  ArchiveRestore,
  Wifi,
  WifiOff,
  Crown,
  Zap,
  Repeat,
  Sparkles,
  Bot,
  Palette,
  Eye,
  EyeOff,
  Smartphone,
  Lock,
  Download,
  Shield,
  ShieldCheck,
  Tag,
  Filter,
} from 'lucide-react';

import {
  Chat,
  Message,
  StatusStory,
  CallLog,
  UserProfile,
  PollData,
  WallpaperTheme,
  MessageType,
  GoldPrivacySettings,
  GoldThemeId,
  AccountProfile,
  ContactGroup,
} from './types';
import {
  CURRENT_USER,
  INITIAL_CHATS,
  INITIAL_MESSAGES,
  INITIAL_STATUSES,
  INITIAL_CALLS,
  CONTEXTUAL_REPLIES,
  DEFAULT_GOLD_PRIVACY,
  INITIAL_ACCOUNTS,
  GOLD_THEMES_CATALOG,
  INITIAL_CONTACT_GROUPS,
} from './mockData';
import {
  playMessageSentSound,
  playMessageReceivedSound,
} from './utils/soundEffects';

import { AudioPlayer } from './components/AudioPlayer';
import { VoiceRecorder } from './components/VoiceRecorder';
import { EmojiPicker } from './components/EmojiPicker';
import { PollModal } from './components/PollModal';
import { StatusViewer } from './components/StatusViewer';
import { CallModal } from './components/CallModal';
import { ContactInfoDrawer } from './components/ContactInfoDrawer';
import { NewChatModal } from './components/NewChatModal';
import { SettingsModal } from './components/SettingsModal';
import { GoldPrivacyModal } from './components/GoldPrivacyModal';
import { TextRepeaterModal } from './components/TextRepeaterModal';
import { GoldThemesStoreModal } from './components/GoldThemesStoreModal';
import { AccountSwitcherModal } from './components/AccountSwitcherModal';
import { AutoReplyModal } from './components/AutoReplyModal';
import { ContactGroupsModal } from './components/ContactGroupsModal';
import { PhoneAuthModal } from './components/PhoneAuthModal';
import { DirectPhoneChatModal } from './components/DirectPhoneChatModal';
import { InstallPublishModal } from './components/InstallPublishModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  // Navigation & UI States
  const [activeNavTab, setActiveNavTab] = useState<'chats' | 'status' | 'calls'>('chats');
  const [selectedChatId, setSelectedChatId] = useState<string>('chat-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatFilter, setChatFilter] = useState<'all' | 'unread' | 'groups' | 'favorites'>('all');
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [isViewingArchived, setIsViewingArchived] = useState(false);

  // App Settings
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [wallpaperTheme, setWallpaperTheme] = useState<WallpaperTheme>('classic-dark');
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('wa_current_user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('wa_is_authenticated') === 'true';
  });
  const [showPhoneAuthModal, setShowPhoneAuthModal] = useState(false);
  const [showDirectPhoneChatModal, setShowDirectPhoneChatModal] = useState(false);
  const [showInstallPublishModal, setShowInstallPublishModal] = useState(false);

  // Data Stores
  const [chats, setChats] = useState<Chat[]>(() => {
    const saved = localStorage.getItem('wa_chats');
    return saved ? JSON.parse(saved) : INITIAL_CHATS;
  });

  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem('wa_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [statuses, setStatuses] = useState<StatusStory[]>(() => {
    const saved = localStorage.getItem('wa_statuses');
    return saved ? JSON.parse(saved) : INITIAL_STATUSES;
  });

  const [calls, setCalls] = useState<CallLog[]>(() => {
    const saved = localStorage.getItem('wa_calls');
    return saved ? JSON.parse(saved) : INITIAL_CALLS;
  });

  // Input & Message composer
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [messageContextMenu, setMessageContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Modals & Drawers
  const [showPollModal, setShowPollModal] = useState(false);
  const [showStatusViewer, setShowStatusViewer] = useState(false);
  const [statusViewerIndex, setStatusViewerIndex] = useState(0);
  const [showNewStatusModal, setShowNewStatusModal] = useState(false);
  const [newStatusText, setNewStatusText] = useState('');
  const [newStatusBg, setNewStatusBg] = useState('#128c7e');
  const [activeCall, setActiveCall] = useState<{ contactName: string; contactAvatar: string; isVideo: boolean } | null>(null);
  const [showContactDrawer, setShowContactDrawer] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // WhatsApp Gold States
  const [goldPrivacy, setGoldPrivacy] = useState<GoldPrivacySettings>(() => {
    const saved = localStorage.getItem('wa_gold_privacy');
    return saved ? JSON.parse(saved) : DEFAULT_GOLD_PRIVACY;
  });
  const [goldTheme, setGoldTheme] = useState<GoldThemeId>(() => {
    return (localStorage.getItem('wa_gold_theme') as GoldThemeId) || 'gold';
  });
  const [accountList, setAccountList] = useState<AccountProfile[]>(() => {
    const saved = localStorage.getItem('wa_gold_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });
  const [currentAccountSlot, setCurrentAccountSlot] = useState<number>(1);

  // Contact Groups State
  const [contactGroups, setContactGroups] = useState<ContactGroup[]>(() => {
    const saved = localStorage.getItem('wa_contact_groups');
    return saved ? JSON.parse(saved) : INITIAL_CONTACT_GROUPS;
  });
  const [selectedContactGroupId, setSelectedContactGroupId] = useState<string | null>(null);
  const [showContactGroupsModal, setShowContactGroupsModal] = useState(false);
  const [editingChatForGroups, setEditingChatForGroups] = useState<string | null>(null);

  // Gold Modals
  const [showGoldPrivacyModal, setShowGoldPrivacyModal] = useState(false);
  const [showTextRepeaterModal, setShowTextRepeaterModal] = useState(false);
  const [showGoldThemesModal, setShowGoldThemesModal] = useState(false);
  const [showAccountSwitcherModal, setShowAccountSwitcherModal] = useState(false);
  const [showAutoReplyModal, setShowAutoReplyModal] = useState(false);
  const [showGoldMenuDropdown, setShowGoldMenuDropdown] = useState(false);
  const [goldNoticeToast, setGoldNoticeToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setGoldNoticeToast(msg);
    setTimeout(() => setGoldNoticeToast(null), 3500);
  };

  // Refs
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const broadcastRef = useRef<BroadcastChannel | null>(null);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('wa_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('wa_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('wa_statuses', JSON.stringify(statuses));
  }, [statuses]);

  useEffect(() => {
    localStorage.setItem('wa_calls', JSON.stringify(calls));
  }, [calls]);

  useEffect(() => {
    localStorage.setItem('wa_gold_privacy', JSON.stringify(goldPrivacy));
  }, [goldPrivacy]);

  useEffect(() => {
    localStorage.setItem('wa_gold_theme', goldTheme);
  }, [goldTheme]);

  useEffect(() => {
    localStorage.setItem('wa_gold_accounts', JSON.stringify(accountList));
  }, [accountList]);

  useEffect(() => {
    localStorage.setItem('wa_contact_groups', JSON.stringify(contactGroups));
  }, [contactGroups]);

  // Sync Dark Mode class on <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sync Language Dir on <html>
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Multi-tab BroadcastChannel sync
  useEffect(() => {
    try {
      const channel = new BroadcastChannel('wa_clone_sync');
      broadcastRef.current = channel;

      channel.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'NEW_MESSAGE') {
          const { msg, chatId } = payload;
          setMessages((prev) => ({
            ...prev,
            [chatId]: [...(prev[chatId] || []), msg],
          }));
        } else if (type === 'STATUS_UPDATE') {
          setStatuses(payload);
        }
      };

      return () => {
        channel.close();
      };
    } catch {
      // BroadcastChannel unsupported fallback
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedChatId, replyingTo]);

  // Current active chat object
  const currentChat = chats.find((c) => c.id === selectedChatId);
  const currentChatMessages = messages[selectedChatId] || [];

  // Mark unread messages as read when opening a chat
  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setMobileShowChat(true);
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, unreadCount: 0 } : c))
    );
  };

  // Send message helper
  const handleSendMessage = (
    msgType: MessageType = 'text',
    extraData?: Partial<Message>
  ) => {
    const outgoingText = extraData?.text !== undefined ? extraData.text : inputText.trim();
    if (msgType === 'text' && !outgoingText) return;

    // DND Internet Cut Check (WhatsApp Gold)
    if (goldPrivacy.dndInternetCut) {
      showToast(isAr ? '⚠️ تم قطع الإنترنت عن الواتس الذهبي! أعد تشغيل الواي فاي من الشريط العلوي للإرسال.' : '⚠️ Internet cut for WhatsApp Gold!');
      return;
    }

    const timeNow = new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const targetChat = extraData?.chatId || selectedChatId;

    const newMsg: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      chatId: targetChat,
      senderId: 'me',
      text: outgoingText,
      timestamp: timeNow,
      status: 'sent',
      type: msgType,
      replyTo: replyingTo
        ? {
            id: replyingTo.id,
            senderName: replyingTo.senderId === 'me' ? (language === 'ar' ? 'أنت' : 'You') : currentChat?.name || '',
            text: replyingTo.text || (replyingTo.type === 'voice' ? 'تسجيل صوتي' : 'وسائط'),
            type: replyingTo.type,
          }
        : undefined,
      ...extraData,
    };

    // Update messages
    setMessages((prev) => ({
      ...prev,
      [targetChat]: [...(prev[targetChat] || []), newMsg],
    }));

    // Update chat last message
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === targetChat) {
          return {
            ...c,
            lastMessage: {
              text: newMsg.text || (newMsg.type === 'voice' ? 'تسجيل صوتي' : 'ملف وسائط'),
              timestamp: timeNow,
              type: newMsg.type,
              senderId: 'me',
              status: 'sent',
            },
          };
        }
        return c;
      })
    );

    // Audio feedback
    if (soundEnabled) {
      playMessageSentSound();
    }

    // Broadcast across tabs
    broadcastRef.current?.postMessage({
      type: 'NEW_MESSAGE',
      payload: { msg: newMsg, chatId: targetChat },
    });

    // Reset composer states
    setInputText('');
    setReplyingTo(null);
    setShowEmojiPicker(false);
    setShowAttachmentMenu(false);

    // Simulate contact typing & response
    simulatePeerResponse(targetChat, newMsg.text || '');
  };

  // Realistic contact reply simulation
  const simulatePeerResponse = (chatId: string, userText: string) => {
    const targetChat = chats.find((c) => c.id === chatId);
    if (!targetChat || targetChat.isGroup) return;

    // Progression 1: Sent -> Delivered after 1.2s
    setTimeout(() => {
      setMessages((prev) => {
        const chatMsgs = prev[chatId] || [];
        return {
          ...prev,
          [chatId]: chatMsgs.map((m) => (m.status === 'sent' ? { ...m, status: 'delivered' } : m)),
        };
      });
    }, 1200);

    // Progression 2: Contact shows "typing..." after 2.2s
    setTimeout(() => {
      setChats((prev) =>
        prev.map((c) => (c.id === chatId ? { ...c, onlineStatus: 'typing...' } : c))
      );
    }, 2200);

    // Progression 3: Contact replies & marks as read after 4.2s
    setTimeout(() => {
      // Double blue ticks
      setMessages((prev) => {
        const chatMsgs = prev[chatId] || [];
        return {
          ...prev,
          [chatId]: chatMsgs.map((m) => ({ ...m, status: 'read' })),
        };
      });

      // Reset online status
      setChats((prev) =>
        prev.map((c) => (c.id === chatId ? { ...c, onlineStatus: 'online' } : c))
      );

      // Choose contextual reply
      const replies = CONTEXTUAL_REPLIES.general;
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const replyTime = new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      const replyMsg: Message = {
        id: `reply-${Date.now()}`,
        chatId,
        senderId: chatId,
        text: randomReply,
        timestamp: replyTime,
        status: 'delivered',
        type: 'text',
      };

      setMessages((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), replyMsg],
      }));

      setChats((prev) =>
        prev.map((c) => {
          if (c.id === chatId) {
            return {
              ...c,
              lastMessage: {
                text: replyMsg.text || '',
                timestamp: replyTime,
                type: 'text',
                senderId: chatId,
                status: 'delivered',
              },
              unreadCount: selectedChatId === chatId ? 0 : c.unreadCount + 1,
            };
          }
          return c;
        })
      );

      if (soundEnabled) {
        playMessageReceivedSound();
      }

      broadcastRef.current?.postMessage({
        type: 'NEW_MESSAGE',
        payload: { msg: replyMsg, chatId },
      });
    }, 4200);
  };

  // Reactions Handler
  const handleToggleReaction = (msgId: string, emoji: string) => {
    setMessages((prev) => {
      const currentList = prev[selectedChatId] || [];
      const updated = currentList.map((m) => {
        if (m.id !== msgId) return m;
        const currentReactions = { ...(m.reactions || {}) };
        const userList = currentReactions[emoji] || [];

        if (userList.includes('me')) {
          // Remove
          currentReactions[emoji] = userList.filter((u) => u !== 'me');
          if (currentReactions[emoji].length === 0) {
            delete currentReactions[emoji];
          }
        } else {
          // Add
          currentReactions[emoji] = [...userList, 'me'];
        }

        return { ...m, reactions: currentReactions };
      });
      return { ...prev, [selectedChatId]: updated };
    });
    setMessageContextMenu(null);
  };

  // Poll Vote Handler
  const handleVotePoll = (msgId: string, optionId: string) => {
    setMessages((prev) => {
      const currentList = prev[selectedChatId] || [];
      const updated = currentList.map((m) => {
        if (m.id !== msgId || !m.pollData) return m;
        const poll = m.pollData;

        const updatedOptions = poll.options.map((opt) => {
          const hasVoted = opt.votes.includes('me');
          if (opt.id === optionId) {
            return {
              ...opt,
              votes: hasVoted ? opt.votes.filter((u) => u !== 'me') : [...opt.votes, 'me'],
            };
          }
          if (!poll.allowMultiple) {
            // single vote allowed: remove 'me' from other options
            return {
              ...opt,
              votes: opt.votes.filter((u) => u !== 'me'),
            };
          }
          return opt;
        });

        return {
          ...m,
          pollData: { ...poll, options: updatedOptions },
        };
      });
      return { ...prev, [selectedChatId]: updated };
    });
  };

  // Star message
  const handleToggleStar = (msgId: string) => {
    setMessages((prev) => {
      const currentList = prev[selectedChatId] || [];
      return {
        ...prev,
        [selectedChatId]: currentList.map((m) => (m.id === msgId ? { ...m, isStarred: !m.isStarred } : m)),
      };
    });
    setMessageContextMenu(null);
  };

  // Delete message
  const handleDeleteMessage = (msgId: string) => {
    setMessages((prev) => {
      const currentList = prev[selectedChatId] || [];
      return {
        ...prev,
        [selectedChatId]: currentList.filter((m) => m.id !== msgId),
      };
    });
    setMessageContextMenu(null);
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleSendMessage('image', {
          mediaUrl: reader.result as string,
          text: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Send Location Share
  const handleSendLocation = () => {
    handleSendMessage('location', {
      locationData: {
        name: 'الموقع الحالي (مباشر)',
        address: 'شارع التحرير، وسط البلد، القاهرة، مصر',
        lat: 30.0444,
        lng: 31.2357,
      },
    });
  };

  // WhatsApp Gold: Send repeated messages (Spam Repeater)
  const handleSendRepeatedMessages = (targetChatId: string, text: string, count: number, separateMessages: boolean) => {
    if (goldPrivacy.dndInternetCut) {
      showToast(isAr ? '⚠️ تم قطع الإنترنت عن الواتس الذهبي! أعد تشغيل الواي فاي من الشريط العلوي للإرسال.' : 'Internet cut!');
      return;
    }

    // Switch active chat to the target so user sees the messages sending
    setSelectedChatId(targetChatId);
    setMobileShowChat(true);

    if (separateMessages) {
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          handleSendMessage('text', { text, chatId: targetChatId });
        }, i * 90);
      }
      showToast(
        isAr
          ? `🚀 تم إرسال (${text}) بعدد ${count} مرة بنجاح وبأمان تام ضد الحظر!`
          : `🚀 Sent "${text}" repeated ${count} times safely with anti-ban shield!`
      );
    } else {
      const repeated = Array(count).fill(text).join('\n');
      handleSendMessage('text', { text: repeated, chatId: targetChatId });
      showToast(
        isAr
          ? `🚀 تم إرسال النص مكرراً ${count} مرة في رسالة واحدة بدون حظر!`
          : `🚀 Sent ${count}x repeated text in one message safely!`
      );
    }
  };

  // WhatsApp Gold: Send to unsaved phone number
  const handleSendToNewPhone = (phoneNumber: string, text: string, count: number) => {
    // Check if phone already exists in chats
    const existing = chats.find((c) => c.phone === phoneNumber || c.name === phoneNumber);
    if (existing) {
      setSelectedChatId(existing.id);
      setMobileShowChat(true);
      handleSendRepeatedMessages(existing.id, text, count, true);
      return;
    }

    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      name: phoneNumber,
      phone: phoneNumber,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      unreadCount: 0,
      onlineStatus: 'online',
    };
    setChats((prev) => [newChat, ...prev]);
    setSelectedChatId(newChat.id);
    setMobileShowChat(true);

    handleSendRepeatedMessages(newChat.id, text, count, true);
  };

  // WhatsApp Gold: Switch account
  const handleSwitchAccount = (account: AccountProfile) => {
    setCurrentAccountSlot(account.slotNumber);
    setCurrentUser({
      id: 'me',
      name: account.name,
      phone: account.phone,
      about: account.about,
      avatar: account.avatar,
    });
    showToast(isAr ? `👑 تم التبديل إلى الحساب (${account.slotNumber}): ${account.name}` : `Switched to ${account.name}!`);
  };

  // Add New Text Status
  const handleAddTextStatus = () => {
    if (!newStatusText.trim()) return;
    const newStory: StatusStory = {
      id: `story-${Date.now()}`,
      userId: 'me',
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      timestamp: language === 'ar' ? 'الآن' : 'Just now',
      type: 'text',
      content: newStatusText.trim(),
      bgColor: newStatusBg,
      seen: true,
    };
    setStatuses([newStory, ...statuses]);
    setShowNewStatusModal(false);
    setNewStatusText('');
  };

  // Start Call
  const handleStartCall = (isVideo: boolean) => {
    if (!currentChat) return;
    setActiveCall({
      contactName: currentChat.name,
      contactAvatar: currentChat.avatar,
      isVideo,
    });
  };

  // Toggle Archive Status for a Chat
  const handleToggleArchiveChat = (chatId: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, isArchived: !c.isArchived } : c))
    );
  };

  // Contact Groups Handlers
  const handleSaveContactGroup = (group: ContactGroup) => {
    setContactGroups((prev) => {
      const index = prev.findIndex((g) => g.id === group.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = group;
        return updated;
      }
      return [...prev, group];
    });
    showToast(
      language === 'ar'
        ? `تم حفظ تصنيف "${group.name}" بنجاح!`
        : `Group "${group.name}" saved successfully!`
    );
  };

  const handleDeleteContactGroup = (groupId: string) => {
    const target = contactGroups.find((g) => g.id === groupId);
    setContactGroups((prev) => prev.filter((g) => g.id !== groupId));
    if (selectedContactGroupId === groupId) {
      setSelectedContactGroupId(null);
    }
    showToast(
      language === 'ar'
        ? `تم حذف التصنيف ${target ? `"${target.name}"` : ''}`
        : `Group deleted`
    );
  };

  const handleToggleChatInGroup = (groupId: string, chatId: string) => {
    setContactGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const exists = g.chatIds.includes(chatId);
        return {
          ...g,
          chatIds: exists
            ? g.chatIds.filter((id) => id !== chatId)
            : [...g.chatIds, chatId],
        };
      })
    );
  };

  // Phone Authentication & Direct Phone Chat Handlers
  const handlePhoneLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setShowPhoneAuthModal(false);
    showToast(
      language === 'ar'
        ? `تم تسجيل الدخول بنجاح برقم ${user.phone}`
        : `Successfully logged in with ${user.phone}`
    );
  };

  const handleLogoutPhone = () => {
    localStorage.removeItem('wa_is_authenticated');
    localStorage.removeItem('wa_auth_phone');
    setIsAuthenticated(false);
    showToast(language === 'ar' ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully');
  };

  const handleDirectPhoneChat = (phone: string, name?: string, initialMessage?: string) => {
    const cleanPhone = phone.trim();
    // Check if chat exists with this phone
    const existing = chats.find(
      (c) =>
        c.phone &&
        (c.phone.replace(/\s+/g, '') === cleanPhone.replace(/\s+/g, '') ||
          c.phone.replace(/\s+/g, '').endsWith(cleanPhone.replace(/\s+/g, '')) ||
          cleanPhone.replace(/\s+/g, '').endsWith(c.phone.replace(/\s+/g, '')))
    );

    let targetChatId = '';

    if (existing) {
      targetChatId = existing.id;
      setSelectedChatId(existing.id);
      setMobileShowChat(true);
      showToast(language === 'ar' ? `تم فتح محادثة ${existing.name}` : `Opened chat with ${existing.name}`);
    } else {
      // Create new chat
      const newChatId = `chat-phone-${Date.now()}`;
      targetChatId = newChatId;
      const contactDisplayName = name || cleanPhone;
      const newChat: Chat = {
        id: newChatId,
        name: contactDisplayName,
        phone: cleanPhone,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        about: language === 'ar' ? 'تمت الإضافة عبر محادثة رقم الهاتف المباشرة 📱' : 'Added via direct phone chat 📱',
        unreadCount: 0,
        onlineStatus: 'online',
        isPinned: false,
        lastMessage: initialMessage
          ? {
              text: initialMessage,
              timestamp: 'الآن',
              type: 'text',
              senderId: 'me',
              status: 'sent',
            }
          : undefined,
      };

      setChats((prev) => [newChat, ...prev]);
      setSelectedChatId(newChatId);
      setMobileShowChat(true);

      showToast(
        language === 'ar'
          ? `تم بدء محادثة جديدة مع الرقم ${cleanPhone}`
          : `Started new chat with ${cleanPhone}`
      );
    }

    // Send initial message if provided
    if (initialMessage && targetChatId) {
      const msg: Message = {
        id: `msg-${Date.now()}`,
        chatId: targetChatId,
        senderId: 'me',
        text: initialMessage,
        timestamp: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'sent',
        type: 'text',
      };
      setMessages((prev) => ({
        ...prev,
        [targetChatId]: [...(prev[targetChatId] || []), msg],
      }));
    }
  };

  // Archived statistics
  const archivedChats = chats.filter((c) => c.isArchived);
  const archivedUnreadCount = archivedChats.reduce((acc, c) => acc + c.unreadCount, 0);

  // Active typing contacts for global indicator
  const typingContacts = chats.filter((c) => c.onlineStatus === 'typing...');

  // Filtered Chats
  const baseChatList = isViewingArchived
    ? chats.filter((c) => c.isArchived)
    : chats.filter((c) => !c.isArchived);

  const filteredChats = baseChatList.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      (c.phone && c.phone.toLowerCase().replace(/\s+/g, '').includes(q.replace(/\s+/g, ''))) ||
      (c.about && c.about.toLowerCase().includes(q));
    if (!matchesSearch) return false;
    if (selectedContactGroupId) {
      const activeGroup = contactGroups.find((g) => g.id === selectedContactGroupId);
      if (!activeGroup || !activeGroup.chatIds.includes(c.id)) {
        return false;
      }
    }
    if (chatFilter === 'unread') return c.unreadCount > 0;
    if (chatFilter === 'groups') return c.isGroup;
    if (chatFilter === 'favorites') return c.isPinned;
    return true;
  });

  const isAr = language === 'ar';

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden ${isDarkMode ? 'dark bg-[#0c1317]' : 'bg-[#eef2f5]'}`}>
      {/* Hidden File Input for Image sending */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden w-full h-full">
        {/* ================= LEFT NARROW APP DOCK / ICONS BAR ================= */}
        <aside className="w-16 bg-[#f0f2f5] dark:bg-[#202c33] border-e border-black/10 dark:border-white/5 flex flex-col items-center justify-between py-3 shrink-0 select-none z-20">
          {/* Top Icons */}
          <div className="flex flex-col items-center gap-3 w-full">
            {/* Chats Tab */}
            <button
              type="button"
              onClick={() => setActiveNavTab('chats')}
              className={`relative p-3 rounded-xl transition ${
                activeNavTab === 'chats'
                  ? 'bg-black/10 dark:bg-white/10 text-[#00a884]'
                  : 'text-[#8696a0] hover:text-[#111b21] dark:hover:text-white'
              }`}
              title={isAr ? 'الدردشات' : 'Chats'}
            >
              <MessageSquare className="w-5 h-5" />
              {chats.some((c) => c.unreadCount > 0) && (
                <span className="absolute top-2 end-2 w-2 h-2 rounded-full bg-[#00a884]" />
              )}
            </button>

            {/* Status Tab */}
            <button
              type="button"
              onClick={() => setActiveNavTab('status')}
              className={`relative p-3 rounded-xl transition ${
                activeNavTab === 'status'
                  ? 'bg-black/10 dark:bg-white/10 text-[#00a884]'
                  : 'text-[#8696a0] hover:text-[#111b21] dark:hover:text-white'
              }`}
              title={isAr ? 'الحالات' : 'Status'}
            >
              <CircleDot className="w-5 h-5" />
              {statuses.some((s) => !s.seen) && (
                <span className="absolute top-2 end-2 w-2 h-2 rounded-full bg-[#00a884]" />
              )}
            </button>

            {/* Calls Tab */}
            <button
              type="button"
              onClick={() => setActiveNavTab('calls')}
              className={`relative p-3 rounded-xl transition ${
                activeNavTab === 'calls'
                  ? 'bg-black/10 dark:bg-white/10 text-[#00a884]'
                  : 'text-[#8696a0] hover:text-[#111b21] dark:hover:text-white'
              }`}
              title={isAr ? 'المكالمات' : 'Calls'}
            >
              <Phone className="w-5 h-5" />
            </button>

            {/* Contact Groups Tab in Dock */}
            <button
              type="button"
              onClick={() => {
                setEditingChatForGroups(null);
                setShowContactGroupsModal(true);
              }}
              className="relative p-3 rounded-xl transition text-[#8696a0] hover:text-[#00a884] hover:bg-black/10 dark:hover:bg-white/10"
              title={isAr ? 'تصنيفات جهات الاتصال' : 'Contact Groups'}
            >
              <Tag className="w-5 h-5" />
              {contactGroups.length > 0 && (
                <span className="absolute top-2 end-2 min-w-[14px] h-[14px] rounded-full bg-[#00a884] text-white text-[9px] font-bold flex items-center justify-center px-0.5">
                  {contactGroups.length}
                </span>
              )}
            </button>

            {/* Direct Message by Phone Number in Dock */}
            <button
              type="button"
              onClick={() => setShowDirectPhoneChatModal(true)}
              className="relative p-3 rounded-xl transition text-[#8696a0] hover:text-amber-500 hover:bg-black/10 dark:hover:bg-white/10"
              title={isAr ? 'مراسلة أي رقم هاتف مباشرة' : 'Direct Message by Phone'}
            >
              <Smartphone className="w-5 h-5 text-amber-500" />
            </button>

            {/* Install / Download / Publish App in Dock */}
            <button
              type="button"
              onClick={() => setShowInstallPublishModal(true)}
              className="relative p-3 rounded-xl transition text-[#8696a0] hover:text-[#00a884] hover:bg-black/10 dark:hover:bg-white/10"
              title={isAr ? 'تثبيت وتحميل ونشر التطبيق' : 'Install, Download & Publish App'}
            >
              <Download className="w-5 h-5 text-[#00a884]" />
            </button>
          </div>

          {/* Bottom Icons */}
          <div className="flex flex-col items-center gap-3 w-full">
            {/* Sound toggle button */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-3 text-[#8696a0] hover:text-[#111b21] dark:hover:text-white rounded-xl transition"
              title={soundEnabled ? (isAr ? 'كتم الأصوات' : 'Mute Sounds') : (isAr ? 'تفعيل الأصوات' : 'Enable Sounds')}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-[#00a884]" /> : <VolumeX className="w-5 h-5 text-red-400" />}
            </button>

            {/* Settings button */}
            <button
              type="button"
              onClick={() => setShowSettingsModal(true)}
              className="p-3 text-[#8696a0] hover:text-[#111b21] dark:hover:text-white rounded-xl transition"
              title={isAr ? 'الإعدادات' : 'Settings'}
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* User Avatar */}
            <button
              type="button"
              onClick={() => setShowSettingsModal(true)}
              className="relative p-0.5 rounded-full ring-2 ring-emerald-500/40 hover:ring-emerald-500 transition"
              title={currentUser.name}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>
          </div>
        </aside>

        {/* ================= SECOND PANEL: LIST (CHATS / STATUS / CALLS) ================= */}
        <section
          className={`w-full md:w-[380px] lg:w-[420px] bg-[#ffffff] dark:bg-[#111b21] border-e border-black/10 dark:border-white/5 flex flex-col shrink-0 ${
            mobileShowChat ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Panel Header */}
          <div className="h-16 px-4 flex items-center justify-between bg-[#f0f2f5] dark:bg-[#202c33] shrink-0 border-b border-black/5 dark:border-white/5">
            {activeNavTab === 'chats' && isViewingArchived ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsViewingArchived(false)}
                  className="p-1.5 rounded-full text-[#8696a0] hover:text-[#111b21] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition"
                  title={isAr ? 'الرجوع إلى الدردشات' : 'Back to chats'}
                >
                  {isAr ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                </button>
                <h1 className="text-xl font-bold text-[#111b21] dark:text-[#e9edef] flex items-center gap-2">
                  <span>{isAr ? 'المؤرشفة' : 'Archived'}</span>
                </h1>
              </div>
            ) : activeNavTab === 'chats' ? (
              <div className="flex items-center gap-2 min-w-0">
                <h1 className="text-xl font-bold text-[#111b21] dark:text-[#e9edef] shrink-0">
                  {isAr ? 'الدردشات' : 'Chats'}
                </h1>
                {/* Active Phone Chip (Click to switch or link phone) */}
                <button
                  type="button"
                  onClick={() => setShowAccountSwitcherModal(true)}
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[11px] font-mono font-bold transition cursor-pointer truncate max-w-[150px]"
                  title={isAr ? 'رقم الهاتف المتصل بالمنصة (انقر للتبديل أو إضافة رقم)' : 'Connected Phone (Click to switch)'}
                  dir="ltr"
                >
                  <Smartphone className="w-3 h-3 text-amber-500 shrink-0" />
                  <span className="truncate">{currentUser.phone || '+20 100 123 4567'}</span>
                </button>
                {/* Global typing indicator badge in the header */}
                {typingContacts.length > 0 && (
                  <div
                    onClick={() => {
                      setSelectedChatId(typingContacts[0].id);
                      setMobileShowChat(true);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00a884]/15 hover:bg-[#00a884]/25 border border-[#00a884]/30 text-[#00a884] text-xs font-semibold cursor-pointer transition animate-in fade-in slide-in-from-top-1 duration-200 truncate max-w-[170px] sm:max-w-[220px]"
                    title={
                      isAr
                        ? `انقر لفتح محادثة ${typingContacts[0].name}`
                        : `Click to open ${typingContacts[0].name}'s chat`
                    }
                  >
                    <span className="flex items-center gap-0.5 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00a884] animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00a884] animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00a884] animate-bounce" />
                    </span>
                    <span className="truncate">
                      {typingContacts.length === 1
                        ? isAr
                          ? `${typingContacts[0].name} يكتب الآن...`
                          : `${typingContacts[0].name} is typing...`
                        : isAr
                        ? `${typingContacts[0].name} وآخرون يكتبون...`
                        : `${typingContacts[0].name} & others typing...`}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <h1 className="text-xl font-bold text-[#111b21] dark:text-[#e9edef] flex items-center gap-2">
                {activeNavTab === 'status' && (isAr ? 'الحالات' : 'Status')}
                {activeNavTab === 'calls' && (isAr ? 'المكالمات' : 'Calls')}
              </h1>
            )}

            <div className="flex items-center gap-1.5 text-[#8696a0]">
              {/* WhatsApp Gold: Cut Internet (Wi-Fi DND) Button */}
              <button
                type="button"
                onClick={() => {
                  const next = !goldPrivacy.dndInternetCut;
                  setGoldPrivacy((prev) => ({ ...prev, dndInternetCut: next }));
                  showToast(
                    next
                      ? (isAr ? '⚠️ تم قطع الإنترنت عن الواتساب الذهبي فقط!' : 'Internet cut for WhatsApp Gold!')
                      : (isAr ? '✅ تم إعادة الاتصال بالإنترنت بنجاح!' : 'Connected back online!')
                  );
                }}
                className={`p-2 rounded-full transition relative ${
                  goldPrivacy.dndInternetCut
                    ? 'bg-red-500/20 text-red-500 ring-2 ring-red-500/30 animate-pulse'
                    : 'text-amber-500 hover:bg-amber-500/10'
                }`}
                title={
                  goldPrivacy.dndInternetCut
                    ? (isAr ? 'الإنترنت مفصول عن الواتس الذهبي (انقر لإعادة الاتصال)' : 'Offline mode (Click to reconnect)')
                    : (isAr ? 'قطع الإنترنت عن الواتس فقط (وضع عدم الإزعاج)' : 'Cut internet for WhatsApp only')
                }
              >
                {goldPrivacy.dndInternetCut ? (
                  <WifiOff className="w-5 h-5 text-red-500" />
                ) : (
                  <Wifi className="w-5 h-5" />
                )}
              </button>

              {/* WhatsApp Gold Crown Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowGoldMenuDropdown(!showGoldMenuDropdown)}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-500 font-bold text-xs flex items-center gap-1.5 transition border border-amber-500/30"
                  title={isAr ? 'إضافات ومميزات الواتس الذهبي' : 'WhatsApp Gold Features'}
                >
                  <Crown className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="hidden sm:inline">{isAr ? 'الذهبي 👑' : 'Gold 👑'}</span>
                </button>

                {showGoldMenuDropdown && (
                  <div className="absolute top-11 end-0 w-64 bg-white dark:bg-[#1c1c1f] rounded-2xl shadow-2xl border border-amber-500/30 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
                    <div className="px-3 py-2 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
                        👑 {isAr ? 'إضافات الواتساب الذهبي V12' : 'WhatsApp Gold V12'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setShowGoldPrivacyModal(true);
                        setShowGoldMenuDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-bold hover:bg-amber-500/10 text-[#111b21] dark:text-[#f4f4f5] transition"
                    >
                      <Shield className="w-4 h-4 text-amber-500" />
                      <span>{isAr ? 'الخصوصية وإخفاء الظهور' : 'Privacy & Hide Last Seen'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowTextRepeaterModal(true);
                        setShowGoldMenuDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-bold hover:bg-amber-500/10 text-[#111b21] dark:text-[#f4f4f5] transition"
                    >
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>{isAr ? 'قاذف وتكرار الرسائل (Spam)' : 'Text Repeater / Spammer'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowGoldThemesModal(true);
                        setShowGoldMenuDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-bold hover:bg-amber-500/10 text-[#111b21] dark:text-[#f4f4f5] transition"
                    >
                      <Palette className="w-4 h-4 text-purple-500" />
                      <span>{isAr ? 'متجر ثيمات الذهبي' : 'GOLDThemes Store'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowAccountSwitcherModal(true);
                        setShowGoldMenuDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-bold hover:bg-amber-500/10 text-[#111b21] dark:text-[#f4f4f5] transition"
                    >
                      <Smartphone className="w-4 h-4 text-blue-500" />
                      <span>{isAr ? 'تبديل الحسابات (5 أرقام)' : 'Switch Accounts (5 slots)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowAutoReplyModal(true);
                        setShowGoldMenuDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-bold hover:bg-amber-500/10 text-[#111b21] dark:text-[#f4f4f5] transition"
                    >
                      <Bot className="w-4 h-4 text-emerald-500" />
                      <span>{isAr ? 'الرد التلقائي والرسائل المجدولة' : 'Auto Reply & Schedule'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowInstallPublishModal(true);
                        setShowGoldMenuDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-bold hover:bg-amber-500/10 text-[#111b21] dark:text-[#f4f4f5] transition border-t border-black/5 dark:border-white/5 pt-2"
                    >
                      <Download className="w-4 h-4 text-[#00a884]" />
                      <span>{isAr ? '📲 تثبيت وتحميل ونشر التطبيق' : '📲 Install & Publish App'}</span>
                    </button>
                  </div>
                )}
              </div>

              {activeNavTab === 'chats' && isViewingArchived ? (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#00a884]/15 text-[#00a884]">
                  {archivedChats.length}
                </span>
              ) : activeNavTab === 'chats' ? (
                <div className="flex items-center gap-1">
                  <PWAInstallButton
                    isAr={isAr}
                    onOpenGuide={() => setShowInstallPublishModal(true)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowDirectPhoneChatModal(true)}
                    className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition text-[#8696a0] hover:text-amber-500"
                    title={isAr ? 'مراسلة رقم هاتف مباشرة دون حفظ' : 'Direct Message by Phone'}
                  >
                    <Smartphone className="w-5 h-5 text-amber-500" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingChatForGroups(null);
                      setShowContactGroupsModal(true);
                    }}
                    className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition text-[#8696a0] hover:text-[#00a884]"
                    title={isAr ? 'تصنيفات جهات الاتصال' : 'Contact Groups'}
                  >
                    <Tag className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewChatModal(true)}
                    className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition text-[#00a884]"
                    title={isAr ? 'محادثة أو مجموعة جديدة' : 'New Chat or Group'}
                  >
                    <Plus className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>
              ) : null}

              {activeNavTab === 'status' && (
                <button
                  type="button"
                  onClick={() => setShowNewStatusModal(true)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition text-[#00a884]"
                  title={isAr ? 'إضافة حالة' : 'Add Status'}
                >
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowSettingsModal(true)}
                className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition"
                title={isAr ? 'خيارات' : 'More options'}
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* CHATS TAB CONTENT */}
          {activeNavTab === 'chats' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Search Bar */}
              <div className="p-2 border-b border-black/5 dark:border-white/5">
                <div className="flex items-center gap-2 bg-[#f0f2f5] dark:bg-[#202c33] px-3 py-1.5 rounded-xl">
                  <Search className="w-4 h-4 text-[#8696a0]" />
                  <input
                    type="text"
                    placeholder={
                      isViewingArchived
                        ? isAr
                          ? 'بحث في المحادثات المؤرشفة...'
                          : 'Search archived chats...'
                        : isAr
                        ? 'بحث بالاسم أو برقم الهاتف (+20...)...'
                        : 'Search by name or phone number (+20...)...'
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-sm text-[#111b21] dark:text-[#e9edef] placeholder-[#8696a0] focus:outline-none"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-[#8696a0] p-1">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Segmented Filter Buttons (Only if not viewing archived) */}
              {!isViewingArchived ? (
                <>
                  <div className="flex items-center gap-1.5 px-3 py-2 border-b border-black/5 dark:border-white/5 overflow-x-auto no-scrollbar">
                    {[
                      { id: 'all', label: isAr ? 'الكل' : 'All' },
                      { id: 'unread', label: isAr ? 'غير مقروءة' : 'Unread' },
                      { id: 'favorites', label: isAr ? 'المفضلة' : 'Favorites' },
                      { id: 'groups', label: isAr ? 'المجموعات' : 'Groups' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setChatFilter(tab.id as typeof chatFilter)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                          chatFilter === tab.id
                            ? 'bg-[#00a884] text-white shadow-xs'
                            : 'bg-[#f0f2f5] dark:bg-[#202c33] text-[#8696a0] hover:text-[#111b21] dark:hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Contact Groups Labels Filter Bar */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] overflow-x-auto no-scrollbar">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingChatForGroups(null);
                        setShowContactGroupsModal(true);
                      }}
                      className="flex items-center gap-1 text-[11px] font-semibold text-[#8696a0] hover:text-[#00a884] bg-black/5 dark:bg-white/10 px-2.5 py-1 rounded-full shrink-0 transition"
                      title={isAr ? 'إدارة تصنيفات جهات الاتصال' : 'Manage Contact Groups'}
                    >
                      <Tag className="w-3.5 h-3.5 text-[#00a884]" />
                      <span>{isAr ? 'التصنيفات' : 'Labels'}</span>
                      <Plus className="w-3 h-3" />
                    </button>

                    {contactGroups.map((g) => {
                      const isSelected = selectedContactGroupId === g.id;
                      const count = g.chatIds.length;
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setSelectedContactGroupId(isSelected ? null : g.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs whitespace-nowrap transition border ${
                            isSelected
                              ? 'bg-[#00a884] text-white border-[#00a884] font-semibold shadow-xs'
                              : 'bg-[#f0f2f5] dark:bg-[#202c33] border-transparent text-[#667781] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-white'
                          }`}
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: isSelected ? '#ffffff' : g.color }}
                          />
                          <span>{g.name}</span>
                          <span
                            className={`text-[10px] px-1 py-0.2 rounded-full ${
                              isSelected
                                ? 'bg-white/25 text-white'
                                : 'bg-black/5 dark:bg-white/10 text-[#8696a0]'
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Contact Group Filter Banner */}
                  {selectedContactGroupId && (
                    <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#00a884]/10 border-b border-[#00a884]/20 text-xs text-[#00a884] animate-in fade-in">
                      <div className="flex items-center gap-1.5 truncate">
                        <Tag className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">
                          {isAr ? 'تصفية المحادثات حسب:' : 'Filtering by:'}{' '}
                          <strong>
                            {contactGroups.find((g) => g.id === selectedContactGroupId)?.name}
                          </strong>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedContactGroupId(null)}
                        className="text-xs hover:underline flex items-center gap-0.5 font-medium shrink-0 ms-2"
                      >
                        <X className="w-3 h-3" />
                        <span>{isAr ? 'إلغاء التصفية' : 'Clear'}</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* Archived Information Banner */
                <div className="px-4 py-2.5 bg-[#f0f2f5]/60 dark:bg-[#182229] border-b border-black/5 dark:border-white/5 text-xs text-[#8696a0] flex items-center gap-2 select-none">
                  <Archive className="w-4 h-4 text-[#00a884] shrink-0" />
                  <span>
                    {isAr
                      ? 'تبقى هذه الدردشات مؤرشفة في حال تلقيت رسائل جديدة.'
                      : 'These chats stay archived when new messages arrive.'}
                  </span>
                </div>
              )}

              {/* Chat list */}
              <div className="flex-1 overflow-y-auto divide-y divide-black/5 dark:divide-white/5">
                {/* Archived Folder entry at top of normal chats list */}
                {!isViewingArchived && archivedChats.length > 0 && (
                  <div
                    onClick={() => setIsViewingArchived(true)}
                    className="flex items-center justify-between p-3.5 px-4 cursor-pointer hover:bg-[#f5f6f6] dark:hover:bg-[#1a242a] transition border-b border-black/5 dark:border-white/5 select-none group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-[#00a884] bg-[#00a884]/10 group-hover:bg-[#00a884]/20 transition">
                        <Archive className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-[#111b21] dark:text-[#e9edef] block">
                          {isAr ? 'المؤرشفة' : 'Archived'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {archivedUnreadCount > 0 ? (
                        <span className="min-w-[18px] h-[18px] rounded-full bg-[#00a884] text-white text-[11px] font-bold flex items-center justify-center px-1.5">
                          {archivedUnreadCount}
                        </span>
                      ) : (
                        <span className="text-xs text-[#00a884] font-semibold px-2 py-0.5 rounded-full bg-[#00a884]/10">
                          {archivedChats.length}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {filteredChats.length === 0 ? (
                  <div className="p-8 text-center text-sm text-[#8696a0] flex flex-col items-center gap-2">
                    {isViewingArchived ? (
                      <>
                        <Archive className="w-8 h-8 text-[#8696a0]/40 stroke-[1.5]" />
                        <span>{isAr ? 'لا توجد محادثات مؤرشفة' : 'No archived chats'}</span>
                      </>
                    ) : (
                      <span>{isAr ? 'لا توجد محادثات تطابق البحث' : 'No chats found'}</span>
                    )}
                  </div>
                ) : (
                  filteredChats.map((chat) => {
                    const isSelected = chat.id === selectedChatId;
                    return (
                      <div
                        key={chat.id}
                        onClick={() => handleSelectChat(chat.id)}
                        className={`group flex items-center gap-3 p-3.5 cursor-pointer transition select-none ${
                          isSelected
                            ? 'bg-[#f0f2f5] dark:bg-[#202c33]'
                            : 'hover:bg-[#f5f6f6] dark:hover:bg-[#1a242a]'
                        }`}
                      >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <img
                            src={chat.avatar}
                            alt={chat.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {chat.onlineStatus === 'online' && (
                            <span className="absolute bottom-0 end-0 w-3 h-3 rounded-full bg-[#00a884] border-2 border-white dark:border-[#111b21]" />
                          )}
                        </div>

                        {/* Middle info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-sm text-[#111b21] dark:text-[#e9edef] truncate">
                              {chat.name}
                            </h3>
                            <span className="text-[11px] text-[#8696a0] shrink-0 font-sans">
                              {chat.lastMessage?.timestamp || ''}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-1">
                            {/* Snippet / Typing indicator */}
                            {/* Snippet / Typing indicator and Contact Group Labels */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1 text-xs text-[#8696a0] truncate">
                                {chat.onlineStatus === 'typing...' ? (
                                  <span className="text-[#00a884] font-semibold animate-pulse">
                                    {isAr ? 'يكتب الآن...' : 'typing...'}
                                  </span>
                                ) : (
                                  <>
                                    {chat.lastMessage?.senderId === 'me' && (
                                      <span className="shrink-0 inline-flex">
                                        {chat.lastMessage.status === 'read' ? (
                                          <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                                        ) : chat.lastMessage.status === 'delivered' ? (
                                          <CheckCheck className="w-3.5 h-3.5 text-[#8696a0]" />
                                        ) : (
                                          <Check className="w-3.5 h-3.5 text-[#8696a0]" />
                                        )}
                                      </span>
                                    )}
                                    <span className="truncate">{chat.lastMessage?.text || ''}</span>
                                  </>
                                )}
                              </div>

                              {/* Contact Groups Badges */}
                              {(() => {
                                const chatGroups = contactGroups.filter((g) => g.chatIds.includes(chat.id));
                                if (chatGroups.length === 0) return null;
                                return (
                                  <div className="flex items-center gap-1 flex-wrap mt-1">
                                    {chatGroups.map((g) => (
                                      <span
                                        key={g.id}
                                        className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md font-medium"
                                        style={{
                                          backgroundColor: `${g.color}18`,
                                          color: g.color,
                                        }}
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: g.color }} />
                                        <span>{g.name}</span>
                                      </span>
                                    ))}
                                  </div>
                                );
                              })()}
                            </div>

                            {/* Badges: Tag group button, archive button, pinned & unread */}
                            <div className="flex items-center gap-1.5 shrink-0 self-start mt-0.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingChatForGroups(chat.id);
                                  setShowContactGroupsModal(true);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 text-[#8696a0] hover:text-[#00a884] hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition"
                                title={isAr ? 'تصنيف جهة الاتصال' : 'Label contact'}
                              >
                                <Tag className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleArchiveChat(chat.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 text-[#8696a0] hover:text-[#00a884] hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition"
                                title={
                                  chat.isArchived
                                    ? isAr
                                      ? 'إلغاء أرشفة الدردشة'
                                      : 'Unarchive chat'
                                    : isAr
                                    ? 'أرشفة الدردشة'
                                    : 'Archive chat'
                                }
                              >
                                {chat.isArchived ? (
                                  <ArchiveRestore className="w-4 h-4" />
                                ) : (
                                  <Archive className="w-4 h-4" />
                                )}
                              </button>

                              {chat.isPinned && (
                                <Pin className="w-3.5 h-3.5 text-[#8696a0] rotate-45" />
                              )}
                              {chat.unreadCount > 0 && (
                                <span className="min-w-[18px] h-[18px] rounded-full bg-[#00a884] text-white text-[10px] font-bold flex items-center justify-center px-1">
                                  {chat.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* STATUS TAB CONTENT */}
          {activeNavTab === 'status' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* My Status */}
              <div
                onClick={() => setShowNewStatusModal(true)}
                className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="absolute bottom-0 end-0 w-4 h-4 rounded-full bg-[#00a884] text-white flex items-center justify-center border-2 border-white dark:border-[#111b21]">
                    <Plus className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[#111b21] dark:text-[#e9edef]">
                    {isAr ? 'حالتي' : 'My status'}
                  </h4>
                  <p className="text-xs text-[#8696a0]">
                    {isAr ? 'انقر لإضافة تحديث للحالة' : 'Tap to add status update'}
                  </p>
                </div>
              </div>

              {/* Recent Updates */}
              <div>
                <h5 className="text-xs font-bold text-[#8696a0] uppercase tracking-wider mb-3">
                  {isAr ? 'التحديثات الأخيرة' : 'Recent updates'}
                </h5>
                <div className="space-y-2">
                  {statuses.map((story, idx) => (
                    <div
                      key={story.id}
                      onClick={() => {
                        setStatusViewerIndex(idx);
                        setShowStatusViewer(true);
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition"
                    >
                      <div
                        className={`p-0.5 rounded-full ${
                          story.seen ? 'border-2 border-gray-400' : 'border-2 border-[#00a884]'
                        }`}
                      >
                        <img
                          src={story.userAvatar}
                          alt={story.userName}
                          className="w-11 h-11 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-[#111b21] dark:text-[#e9edef]">
                          {story.userName}
                        </h4>
                        <span className="text-xs text-[#8696a0]">{story.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CALLS TAB CONTENT */}
          {activeNavTab === 'calls' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {calls.map((call) => (
                  <div
                    key={call.id}
                    className="flex items-center justify-between py-3 hover:bg-black/5 dark:hover:bg-white/5 px-2 rounded-xl transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={call.contactAvatar}
                        alt={call.contactName}
                        className="w-11 h-11 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-sm text-[#111b21] dark:text-[#e9edef]">
                          {call.contactName}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-[#8696a0]">
                          <span
                            className={
                              call.type === 'missed'
                                ? 'text-red-500 font-semibold'
                                : 'text-[#00a884]'
                            }
                          >
                            {call.type === 'missed'
                              ? isAr
                                ? 'مكالمة فائتة'
                                : 'Missed'
                              : call.type === 'incoming'
                              ? isAr
                                ? 'واردة'
                                : 'Incoming'
                              : isAr
                              ? 'صادرة'
                              : 'Outgoing'}
                          </span>
                          <span>·</span>
                          <span>{call.timestamp}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveCall({
                            contactName: call.contactName,
                            contactAvatar: call.contactAvatar,
                            isVideo: false,
                          })
                        }
                        className="p-2 text-[#00a884] hover:bg-[#00a884]/10 rounded-full transition"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveCall({
                            contactName: call.contactName,
                            contactAvatar: call.contactAvatar,
                            isVideo: true,
                          })
                        }
                        className="p-2 text-[#00a884] hover:bg-[#00a884]/10 rounded-full transition"
                      >
                        <Video className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ================= THIRD PANEL: ACTIVE CHAT WINDOW ================= */}
        <main
          className={`flex-1 flex flex-col h-full bg-[#efeae2] dark:bg-[#0b141a] relative ${
            !mobileShowChat ? 'hidden md:flex' : 'flex'
          }`}
        >
          {currentChat ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
              {/* Chat Header */}
              <header className="h-16 px-4 flex items-center justify-between bg-[#f0f2f5] dark:bg-[#202c33] shrink-0 border-b border-black/5 dark:border-white/5 z-10 shadow-xs">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Mobile Back Button */}
                  <button
                    type="button"
                    onClick={() => setMobileShowChat(false)}
                    className="md:hidden p-1.5 -ms-2 text-[#8696a0] hover:text-[#111b21] dark:hover:text-white rounded-full"
                  >
                    {isAr ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                  </button>

                  {/* Avatar & Clickable Contact Details */}
                  <div
                    onClick={() => setShowContactDrawer(!showContactDrawer)}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <img
                      src={currentChat.avatar}
                      alt={currentChat.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h2 className="font-semibold text-sm text-[#111b21] dark:text-[#e9edef] truncate group-hover:underline">
                        {currentChat.name}
                      </h2>
                      <span className="text-[11px] block truncate text-[#00a884] font-medium">
                        {currentChat.onlineStatus === 'typing...'
                          ? isAr
                            ? 'يكتب الآن...'
                            : 'typing...'
                          : currentChat.onlineStatus === 'online'
                          ? isAr
                            ? 'متصل الآن'
                            : 'online'
                          : currentChat.lastSeen || (isAr ? 'آخر ظهور مؤخراً' : 'last seen recently')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Call & Action Buttons */}
                <div className="flex items-center gap-2 text-[#8696a0]">
                  <button
                    type="button"
                    onClick={() => handleToggleArchiveChat(currentChat.id)}
                    className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition text-[#8696a0] hover:text-[#00a884]"
                    title={
                      currentChat.isArchived
                        ? isAr
                          ? 'إلغاء أرشفة هذه الدردشة'
                          : 'Unarchive chat'
                        : isAr
                        ? 'أرشفة هذه الدردشة'
                        : 'Archive chat'
                    }
                  >
                    {currentChat.isArchived ? (
                      <ArchiveRestore className="w-5 h-5 text-[#00a884]" />
                    ) : (
                      <Archive className="w-5 h-5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStartCall(true)}
                    className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition"
                    title={isAr ? 'مكالمة فيديو' : 'Video call'}
                  >
                    <Video className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStartCall(false)}
                    className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition"
                    title={isAr ? 'مكالمة صوتية' : 'Voice call'}
                  >
                    <Phone className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowContactDrawer(!showContactDrawer)}
                    className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition"
                    title={isAr ? 'معلومات جهة الاتصال' : 'Contact info'}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </header>

              {/* Message List Area */}
              <div
                className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 ${
                  wallpaperTheme === 'classic-light'
                    ? 'wa-chat-bg-light'
                    : wallpaperTheme === 'classic-dark'
                    ? 'wa-chat-bg-dark'
                    : wallpaperTheme === 'emerald'
                    ? 'wa-chat-bg-emerald'
                    : 'wa-chat-bg-midnight'
                }`}
              >
                {/* Security Encryption Pill */}
                <div className="flex justify-center my-2">
                  <div className="bg-[#ffeecd] dark:bg-[#182229] border border-[#f3d99e]/40 dark:border-white/5 text-[#54656f] dark:text-[#ffd279] text-[11px] px-3 py-1.5 rounded-lg max-w-md text-center shadow-xs">
                    🔒 {isAr ? 'الرسائل مشفرة تماماً بين الطرفين. لا أحد خارج هذه المحادثة يمكنه قراءتها.' : 'Messages are end-to-end encrypted.'}
                  </div>
                </div>

                {/* Date Separator */}
                <div className="flex justify-center my-2">
                  <span className="bg-[#ffffff]/80 dark:bg-[#182229]/80 backdrop-blur-xs text-[#54656f] dark:text-[#8696a0] text-[11px] font-semibold px-3 py-1 rounded-lg shadow-xs">
                    {isAr ? 'اليوم' : 'Today'}
                  </span>
                </div>

                {/* Messages Rendering */}
                {currentChatMessages.map((msg) => {
                  const isMe = msg.senderId === 'me';
                  const isHovered = hoveredMessageId === msg.id;

                  return (
                    <div
                      key={msg.id}
                      onMouseEnter={() => setHoveredMessageId(msg.id)}
                      onMouseLeave={() => setHoveredMessageId(null)}
                      className={`flex flex-col group relative ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      {/* Message Bubble */}
                      <div
                        className={`relative max-w-[85%] sm:max-w-[70%] rounded-2xl p-2.5 px-3.5 shadow-sm text-sm ${
                          isMe
                            ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] rounded-tr-none'
                            : 'bg-[#ffffff] dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] rounded-tl-none'
                        }`}
                      >
                        {/* Sender name for group chats */}
                        {currentChat.isGroup && !isMe && msg.senderName && (
                          <div className="text-xs font-bold text-[#00a884] mb-1">
                            {msg.senderName}
                          </div>
                        )}

                        {/* Reply Preview Quote */}
                        {msg.replyTo && (
                          <div
                            className={`mb-2 p-2 rounded-lg text-xs border-s-4 flex flex-col ${
                              isMe
                                ? 'bg-black/5 dark:bg-black/20 border-[#00a884]'
                                : 'bg-black/5 dark:bg-white/5 border-[#00a884]'
                            }`}
                          >
                            <span className="font-bold text-[#00a884]">
                              {msg.replyTo.senderName}
                            </span>
                            <span className="truncate text-[#8696a0] mt-0.5">
                              {msg.replyTo.text}
                            </span>
                          </div>
                        )}

                        {/* WhatsApp Gold: Anti-Delete message banner */}
                        {msg.isDeletedBySender && (
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-500 bg-red-500/10 dark:bg-red-500/20 px-2 py-1 rounded-lg mb-2 border border-red-500/30 select-none">
                            <Trash2 className="w-3.5 h-3.5 shrink-0" />
                            <span>{isAr ? 'تم حذف هذه الرسالة من قبل صاحبها 🚫 (محمية بالواتس الذهبي)' : 'Deleted by sender 🚫 (Saved by Gold)'}</span>
                          </div>
                        )}

                        {/* WhatsApp Gold: View-Once Media banner */}
                        {msg.isViewOnce && (
                          <div className="flex items-center justify-between gap-2 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-lg text-[11px] font-bold text-amber-600 dark:text-amber-400 mb-2 select-none">
                            <div className="flex items-center gap-1.5">
                              <Eye className="w-3.5 h-3.5 shrink-0" />
                              <span>{isAr ? 'عرض لمرة واحدة (فتح وحفظ بلا حدود)' : 'View-Once (Replay Unlimited)'}</span>
                            </div>
                          </div>
                        )}

                        {/* Content: Text */}
                        {msg.type === 'text' && (
                          <p className="whitespace-pre-wrap leading-relaxed select-text font-sans">
                            {msg.text}
                          </p>
                        )}

                        {/* Content: Image */}
                        {msg.type === 'image' && (
                          <div className="space-y-1.5">
                            <img
                              src={msg.mediaUrl}
                              alt="Attached"
                              onClick={() => msg.mediaUrl && setLightboxImage(msg.mediaUrl)}
                              className="rounded-xl max-h-72 object-cover cursor-pointer hover:opacity-95 transition"
                            />
                            {msg.text && (
                              <p className="text-sm pt-1 leading-relaxed">{msg.text}</p>
                            )}
                          </div>
                        )}

                        {/* Content: Voice note with AudioPlayer */}
                        {msg.type === 'voice' && (
                          <AudioPlayer
                            duration={msg.mediaDuration || 18}
                            waveform={msg.voiceWaveform}
                            audioBlobUrl={msg.audioBlobUrl}
                            isMe={isMe}
                          />
                        )}

                        {/* Content: Document */}
                        {msg.type === 'document' && (
                          <div className="flex items-center gap-3 p-2 bg-black/5 dark:bg-black/20 rounded-xl min-w-[220px]">
                            <div className="p-2.5 rounded-lg bg-red-500/10 text-red-500">
                              <FileText className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-xs truncate">
                                {msg.mediaName || 'Document.pdf'}
                              </h4>
                              <span className="text-[10px] text-[#8696a0]">
                                {msg.mediaSize || '1.2 MB'}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Content: Location */}
                        {msg.type === 'location' && msg.locationData && (
                          <div className="space-y-2 min-w-[220px]">
                            <div className="h-28 bg-emerald-900/30 rounded-xl flex items-center justify-center border border-emerald-500/20">
                              <MapPin className="w-8 h-8 text-red-500 animate-bounce" />
                            </div>
                            <div>
                              <h4 className="font-bold text-xs">{msg.locationData.name}</h4>
                              <p className="text-[11px] text-[#8696a0]">{msg.locationData.address}</p>
                            </div>
                          </div>
                        )}

                        {/* Content: Interactive Poll */}
                        {msg.type === 'poll' && msg.pollData && (
                          <div className="space-y-2 min-w-[240px] sm:min-w-[280px]">
                            <div className="flex items-center gap-2 pb-1 border-b border-black/5 dark:border-white/10">
                              <BarChart2 className="w-4 h-4 text-[#00a884]" />
                              <h4 className="font-bold text-sm leading-tight">
                                {msg.pollData.question}
                              </h4>
                            </div>

                            <div className="space-y-2 pt-1">
                              {msg.pollData.options.map((opt) => {
                                const totalVotes = msg.pollData!.options.reduce(
                                  (acc, o) => acc + o.votes.length,
                                  0
                                );
                                const percentage =
                                  totalVotes > 0
                                    ? Math.round((opt.votes.length / totalVotes) * 100)
                                    : 0;
                                const isMyVote = opt.votes.includes('me');

                                return (
                                  <div
                                    key={opt.id}
                                    onClick={() => handleVotePoll(msg.id, opt.id)}
                                    className={`p-2 rounded-xl cursor-pointer transition border ${
                                      isMyVote
                                        ? 'border-[#00a884] bg-[#00a884]/10'
                                        : 'border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between text-xs mb-1 font-medium">
                                      <span>{opt.text}</span>
                                      <span className="font-mono text-[11px] text-[#8696a0]">
                                        {opt.votes.length} ({percentage}%)
                                      </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                                      <div
                                        style={{ width: `${percentage}%` }}
                                        className="h-full bg-[#00a884] rounded-full transition-all duration-300"
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Metadata Footer: Timestamp + Status ticks */}
                        <div className="flex items-center justify-end gap-1 text-[10px] text-[#8696a0] mt-1 select-none font-sans">
                          {msg.isStarred && (
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500 me-0.5" />
                          )}
                          <span>{msg.timestamp}</span>
                          {isMe && (
                            <span>
                              {msg.status === 'read' ? (
                                <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                              ) : msg.status === 'delivered' ? (
                                <CheckCheck className="w-3.5 h-3.5 text-[#8696a0]" />
                              ) : (
                                <Check className="w-3.5 h-3.5 text-[#8696a0]" />
                              )}
                            </span>
                          )}
                        </div>

                        {/* Reactions Badge */}
                        {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                          <div className="absolute -bottom-2.5 start-2 bg-white dark:bg-[#202c33] border border-black/10 dark:border-white/10 rounded-full px-1.5 py-0.5 shadow-sm flex items-center gap-1 text-xs">
                            {Object.entries(msg.reactions).map(([emoji, users]) => (
                              <span key={emoji} className="flex items-center gap-0.5">
                                <span>{emoji}</span>
                                {users.length > 1 && (
                                  <span className="text-[10px] text-[#8696a0]">{users.length}</span>
                                )}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Quick Hover Reactions Tray */}
                      {isHovered && (
                        <div
                          className={`absolute -top-7 ${
                            isMe ? 'end-0' : 'start-0'
                          } bg-white dark:bg-[#202c33] rounded-full shadow-lg border border-black/10 dark:border-white/10 px-2 py-0.5 flex items-center gap-1.5 z-20 animate-in fade-in duration-100`}
                        >
                          {['👍', '❤️', '😂', '😮', '😢', '🙏'].map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => handleToggleReaction(msg.id, emoji)}
                              className="hover:scale-125 transition text-sm p-0.5"
                            >
                              {emoji}
                            </button>
                          ))}
                          <div className="w-[1px] h-3 bg-gray-300 dark:bg-gray-600 mx-0.5" />
                          <button
                            type="button"
                            onClick={() => setReplyingTo(msg)}
                            className="p-1 text-[#8696a0] hover:text-[#00a884] rounded-full"
                            title={isAr ? 'رد' : 'Reply'}
                          >
                            <CornerUpLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleStar(msg.id)}
                            className="p-1 text-[#8696a0] hover:text-amber-500 rounded-full"
                            title={isAr ? 'نجمة' : 'Star'}
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="p-1 text-[#8696a0] hover:text-red-500 rounded-full"
                            title={isAr ? 'حذف' : 'Delete'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                <div ref={messagesEndRef} />
              </div>

              {/* Reply Quote Banner */}
              {replyingTo && (
                <div className="bg-[#f0f2f5] dark:bg-[#202c33] px-4 py-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 border-s-4 border-[#00a884] ps-2 min-w-0">
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-[#00a884] block truncate">
                        {isAr ? 'الرد على' : 'Replying to'}{' '}
                        {replyingTo.senderId === 'me'
                          ? isAr
                            ? 'نفسك'
                            : 'yourself'
                          : currentChat.name}
                      </span>
                      <p className="text-xs text-[#8696a0] truncate">
                        {replyingTo.text || (replyingTo.type === 'voice' ? 'تسجيل صوتي' : 'وسائط')}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="p-1 text-[#8696a0] hover:text-red-500 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Bottom Input Area */}
              <div className="bg-[#f0f2f5] dark:bg-[#202c33] p-2 sm:p-3 px-3 sm:px-4 border-t border-black/5 dark:border-white/5 flex items-center gap-2 relative z-20">
                {isRecordingVoice ? (
                  <VoiceRecorder
                    onCancel={() => setIsRecordingVoice(false)}
                    onSend={({ duration, blobUrl, waveform }) => {
                      setIsRecordingVoice(false);
                      handleSendMessage('voice', {
                        mediaDuration: duration,
                        audioBlobUrl: blobUrl,
                        voiceWaveform: waveform,
                      });
                    }}
                  />
                ) : (
                  <>
                    {/* Emoji Picker Button */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setShowEmojiPicker(!showEmojiPicker);
                          setShowAttachmentMenu(false);
                        }}
                        className={`p-2 rounded-full transition ${
                          showEmojiPicker
                            ? 'text-[#00a884] bg-[#00a884]/10'
                            : 'text-[#8696a0] hover:text-[#111b21] dark:hover:text-white'
                        }`}
                        title={isAr ? 'رموز تعبيرية' : 'Emojis'}
                      >
                        <Smile className="w-6 h-6" />
                      </button>

                      {showEmojiPicker && (
                        <div className="absolute bottom-12 start-0 z-50">
                          <EmojiPicker
                            onSelectEmoji={(emoji) => setInputText((prev) => prev + emoji)}
                          />
                        </div>
                      )}
                    </div>

                    {/* Attachment Paperclip Button */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAttachmentMenu(!showAttachmentMenu);
                          setShowEmojiPicker(false);
                        }}
                        className={`p-2 rounded-full transition ${
                          showAttachmentMenu
                            ? 'text-[#00a884] bg-[#00a884]/10'
                            : 'text-[#8696a0] hover:text-[#111b21] dark:hover:text-white'
                        }`}
                        title={isAr ? 'إرفاق' : 'Attach'}
                      >
                        <Paperclip className="w-5 h-5" />
                      </button>

                      {/* Attachment Menu Popup */}
                      {showAttachmentMenu && (
                        <div className="absolute bottom-14 start-0 bg-white dark:bg-[#202c33] shadow-2xl rounded-2xl p-2 border border-black/10 dark:border-white/10 w-48 space-y-1 z-50 animate-in fade-in duration-100">
                          <button
                            type="button"
                            onClick={() => {
                              fileInputRef.current?.click();
                              setShowAttachmentMenu(false);
                            }}
                            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition text-xs font-semibold text-[#111b21] dark:text-[#e9edef]"
                          >
                            <ImageIcon className="w-4 h-4 text-purple-500" />
                            <span>{isAr ? 'صور وفيديوهات' : 'Photos & Videos'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setShowPollModal(true);
                              setShowAttachmentMenu(false);
                            }}
                            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition text-xs font-semibold text-[#111b21] dark:text-[#e9edef]"
                          >
                            <BarChart2 className="w-4 h-4 text-amber-500" />
                            <span>{isAr ? 'استطلاع رأي' : 'Poll'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              handleSendLocation();
                              setShowAttachmentMenu(false);
                            }}
                            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition text-xs font-semibold text-[#111b21] dark:text-[#e9edef]"
                          >
                            <MapPin className="w-4 h-4 text-emerald-500" />
                            <span>{isAr ? 'مشاركة الموقع' : 'Location'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              handleSendMessage('document', {
                                mediaName: 'مستند_مشروع_العمل.pdf',
                                mediaSize: '2.8 MB',
                              });
                              setShowAttachmentMenu(false);
                            }}
                            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition text-xs font-semibold text-[#111b21] dark:text-[#e9edef]"
                          >
                            <FileText className="w-4 h-4 text-blue-500" />
                            <span>{isAr ? 'مستند PDF' : 'Document'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setShowTextRepeaterModal(true);
                              setShowAttachmentMenu(false);
                            }}
                            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 transition text-xs font-bold border-t border-black/5 dark:border-white/5"
                          >
                            <Zap className="w-4 h-4 text-amber-500 fill-amber-500/30" />
                            <span>{isAr ? 'قاذف وتكرار الرسائل' : 'Text Repeater / Spammer'}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* WhatsApp Gold: Quick Text Repeater Button */}
                    <button
                      type="button"
                      onClick={() => setShowTextRepeaterModal(true)}
                      className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-full transition"
                      title={isAr ? 'قاذف وتكرار الرسائل (Spam)' : 'Text Repeater'}
                    >
                      <Zap className="w-5 h-5 fill-amber-500/20" />
                    </button>

                    {/* Text input */}
                    <input
                      type="text"
                      placeholder={isAr ? 'اكتب رسالة...' : 'Type a message...'}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSendMessage('text');
                        }
                      }}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-[#ffffff] dark:bg-[#111b21] text-sm text-[#111b21] dark:text-[#e9edef] placeholder-[#8696a0] focus:outline-none shadow-xs border border-transparent focus:border-emerald-500/30"
                    />

                    {/* Mic or Send button */}
                    {inputText.trim() ? (
                      <button
                        type="button"
                        onClick={() => handleSendMessage('text')}
                        className="w-10 h-10 rounded-full bg-[#00a884] text-white hover:bg-[#008f6f] flex items-center justify-center shrink-0 shadow-sm active:scale-95 transition"
                        title={isAr ? 'إرسال' : 'Send'}
                      >
                        <Send className="w-4 h-4 -rotate-45" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsRecordingVoice(true)}
                        className="p-2 text-[#8696a0] hover:text-[#00a884] hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition"
                        title={isAr ? 'تسجيل رسالة صوتية' : 'Record voice note'}
                      >
                        <Mic className="w-6 h-6" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#f0f2f5] dark:bg-[#111b21]">
              <div className="w-24 h-24 rounded-full bg-[#00a884]/10 text-[#00a884] flex items-center justify-center mb-4">
                <MessageSquare className="w-12 h-12 stroke-[1.5]" />
              </div>
              <h2 className="text-2xl font-bold text-[#111b21] dark:text-[#e9edef] mb-2">
                واتساب ويب - WhatsApp Web
              </h2>
              <p className="text-sm text-[#8696a0] max-w-sm leading-relaxed mb-6">
                أرسل واستقبل الرسائل النصية والصوتية والمكالمات في الوقت الفعلي مع تشفير كامل بين الطرفين.
              </p>
              <button
                type="button"
                onClick={() => setShowNewChatModal(true)}
                className="px-5 py-2.5 bg-[#00a884] text-white font-semibold text-sm rounded-xl shadow-md hover:bg-[#008f6f] transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>بدء محادثة جديدة</span>
              </button>
            </div>
          )}
        </main>

        {/* ================= RIGHT DRAWER: CONTACT INFO ================= */}
        {showContactDrawer && currentChat && (
          <ContactInfoDrawer
            chat={currentChat}
            messages={currentChatMessages}
            contactGroups={contactGroups}
            onManageGroups={() => {
              setEditingChatForGroups(currentChat.id);
              setShowContactGroupsModal(true);
            }}
            onClose={() => setShowContactDrawer(false)}
            onClearChat={() => {
              setMessages((prev) => ({ ...prev, [selectedChatId]: [] }));
              setShowContactDrawer(false);
            }}
            onDeleteChat={() => {
              setChats((prev) => prev.filter((c) => c.id !== selectedChatId));
              setSelectedChatId(chats[0]?.id || '');
              setShowContactDrawer(false);
            }}
            onToggleArchive={() => handleToggleArchiveChat(selectedChatId)}
          />
        )}
      </div>

      {/* ================= MODALS & OVERLAYS ================= */}

      {/* Lightbox Image Preview */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setLightboxImage(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 end-4 p-2 rounded-full text-white hover:bg-white/10"
          >
            <X className="w-7 h-7" />
          </button>
          <img
            src={lightboxImage}
            alt="Preview"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}

      {/* Poll Creation Modal */}
      <PollModal
        isOpen={showPollModal}
        onClose={() => setShowPollModal(false)}
        onCreatePoll={(pollData) => {
          handleSendMessage('poll', { pollData });
        }}
      />

      {/* Status Viewer Modal */}
      {showStatusViewer && (
        <StatusViewer
          statuses={statuses}
          initialIndex={statusViewerIndex}
          onClose={() => setShowStatusViewer(false)}
          onReplyToStatus={(userId, userName, replyText) => {
            // Find or create chat with this user
            let targetChat = chats.find((c) => c.id === userId);
            if (!targetChat) {
              targetChat = {
                id: userId,
                name: userName,
                avatar: statuses.find((s) => s.userId === userId)?.userAvatar || '',
                unreadCount: 0,
                onlineStatus: 'online',
              };
              setChats([targetChat, ...chats]);
            }
            setSelectedChatId(userId);
            setMobileShowChat(true);
            handleSendMessage('text', { text: replyText });
          }}
        />
      )}

      {/* Add New Status Modal */}
      {showNewStatusModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#ffffff] dark:bg-[#202c33] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#111b21] dark:text-[#e9edef]">
                {isAr ? 'إضافة حالة نصية جديدة' : 'Add text status'}
              </h3>
              <button
                type="button"
                onClick={() => setShowNewStatusModal(false)}
                className="text-[#8696a0] hover:text-[#111b21] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              style={{ backgroundColor: newStatusBg }}
              className="w-full h-44 rounded-xl flex items-center justify-center p-4 transition-colors"
            >
              <textarea
                placeholder={isAr ? 'اكتب حالتك هنا...' : 'Type your status...'}
                value={newStatusText}
                onChange={(e) => setNewStatusText(e.target.value)}
                className="w-full bg-transparent text-center text-white placeholder-white/70 font-bold text-lg focus:outline-none resize-none"
                rows={3}
              />
            </div>

            {/* Color picker for status background */}
            <div className="flex items-center justify-center gap-3">
              {['#128c7e', '#075e54', '#795548', '#5e35b1', '#c2185b', '#e65100'].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewStatusBg(color)}
                  style={{ backgroundColor: color }}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    newStatusBg === color ? 'scale-125 ring-2 ring-white ring-offset-2' : ''
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewStatusModal(false)}
                className="px-4 py-2 rounded-xl text-sm text-[#8696a0] hover:bg-black/5 dark:hover:bg-white/5"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleAddTextStatus}
                disabled={!newStatusText.trim()}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#00a884] text-white hover:bg-[#008f6f] disabled:opacity-50"
              >
                {isAr ? 'نشر الحالة' : 'Post Status'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Audio / Video Call Modal */}
      {activeCall && (
        <CallModal
          contactName={activeCall.contactName}
          contactAvatar={activeCall.contactAvatar}
          isVideo={activeCall.isVideo}
          onEndCall={(callDuration) => {
            // Add to calls history
            const newLog: CallLog = {
              id: `call-${Date.now()}`,
              contactId: selectedChatId,
              contactName: activeCall.contactName,
              contactAvatar: activeCall.contactAvatar,
              timestamp: isAr ? 'الآن' : 'Just now',
              type: 'outgoing',
              isVideo: activeCall.isVideo,
              duration: callDuration,
            };
            setCalls([newLog, ...calls]);
            setActiveCall(null);
          }}
        />
      )}

      {/* New Chat / Group Modal */}
      <NewChatModal
        isOpen={showNewChatModal}
        contacts={chats}
        onClose={() => setShowNewChatModal(false)}
        onCreateDirectChat={(name, phone, avatar) => {
          const newChat: Chat = {
            id: `chat-${Date.now()}`,
            name,
            phone,
            avatar,
            unreadCount: 0,
            onlineStatus: 'online',
            lastMessage: {
              text: isAr ? 'مرحباً بك في المحادثة!' : 'Welcome to chat!',
              timestamp: 'الآن',
              type: 'text',
              senderId: 'me',
              status: 'sent',
            },
          };
          setChats([newChat, ...chats]);
          setSelectedChatId(newChat.id);
          setMobileShowChat(true);
        }}
        onCreateGroupChat={(name, selectedContactIds) => {
          const newGroupChat: Chat = {
            id: `group-${Date.now()}`,
            name,
            avatar:
              'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&auto=format&fit=crop&q=80',
            isGroup: true,
            groupMembers: ['أنا', ...selectedContactIds],
            unreadCount: 0,
            onlineStatus: 'offline',
            lastMessage: {
              text: isAr ? 'تم إنشاء المجموعة بنجاح' : 'Group created successfully',
              timestamp: 'الآن',
              type: 'text',
              senderId: 'me',
              status: 'sent',
            },
          };
          setChats([newGroupChat, ...chats]);
          setSelectedChatId(newGroupChat.id);
          setMobileShowChat(true);
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        currentUser={currentUser}
        isDarkMode={isDarkMode}
        wallpaperTheme={wallpaperTheme}
        soundEnabled={soundEnabled}
        language={language}
        messages={messages}
        chats={chats}
        onClose={() => setShowSettingsModal(false)}
        onUpdateProfile={(updated) => setCurrentUser((prev) => ({ ...prev, ...updated }))}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onSelectWallpaper={(wp) => setWallpaperTheme(wp)}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onToggleLanguage={(lang) => setLanguage(lang)}
        onOpenPhoneAuth={() => setShowPhoneAuthModal(true)}
        onLogout={handleLogoutPhone}
        onOpenInstallPublish={() => setShowInstallPublishModal(true)}
      />

      {/* Contact Groups Modal */}
      <ContactGroupsModal
        isOpen={showContactGroupsModal}
        onClose={() => {
          setShowContactGroupsModal(false);
          setEditingChatForGroups(null);
        }}
        contactGroups={contactGroups}
        onSaveGroup={handleSaveContactGroup}
        onDeleteGroup={handleDeleteContactGroup}
        chats={chats}
        selectedGroupId={selectedContactGroupId}
        onSelectGroupFilter={(groupId) => setSelectedContactGroupId(groupId)}
        editingChatId={editingChatForGroups}
        onToggleChatInGroup={handleToggleChatInGroup}
        language={language}
      />

      {/* WhatsApp Gold Privacy Modal */}
      <GoldPrivacyModal
        isOpen={showGoldPrivacyModal}
        settings={goldPrivacy}
        onClose={() => setShowGoldPrivacyModal(false)}
        onUpdateSettings={(newSettings) => setGoldPrivacy((prev) => ({ ...prev, ...newSettings }))}
        isAr={isAr}
      />

      {/* Text Repeater Modal */}
      <TextRepeaterModal
        isOpen={showTextRepeaterModal}
        chats={chats}
        currentChatId={selectedChatId}
        onClose={() => setShowTextRepeaterModal(false)}
        onSendRepeatedMessages={handleSendRepeatedMessages}
        onSendToNewPhone={handleSendToNewPhone}
        isAr={isAr}
      />

      {/* Gold Themes Store Modal */}
      <GoldThemesStoreModal
        isOpen={showGoldThemesModal}
        activeThemeId={goldTheme}
        onClose={() => setShowGoldThemesModal(false)}
        onSelectTheme={(themeId) => setGoldTheme(themeId)}
        isAr={isAr}
      />

      {/* Account Switcher Modal */}
      <AccountSwitcherModal
        isOpen={showAccountSwitcherModal}
        accounts={accountList}
        currentSlot={currentAccountSlot}
        onClose={() => setShowAccountSwitcherModal(false)}
        onLinkNewPhone={() => setShowPhoneAuthModal(true)}
        onSwitchAccount={(acc) => {
          setCurrentAccountSlot(acc.slotNumber);
          setCurrentUser({
            id: acc.id,
            name: acc.name,
            phone: acc.phone,
            about: acc.about,
            avatar: acc.avatar,
          });
          setShowAccountSwitcherModal(false);
          showToast(
            isAr
              ? `تم التبديل بنجاح إلى الحساب: ${acc.name} (${acc.phone})`
              : `Switched account to: ${acc.name}`
          );
        }}
        isAr={isAr}
      />

      {/* Auto Reply & Schedule Modal */}
      <AutoReplyModal
        isOpen={showAutoReplyModal}
        chats={chats}
        onClose={() => setShowAutoReplyModal(false)}
        isAr={isAr}
      />

      {/* Direct Phone Chat Modal */}
      <DirectPhoneChatModal
        isOpen={showDirectPhoneChatModal}
        onClose={() => setShowDirectPhoneChatModal(false)}
        onStartChat={handleDirectPhoneChat}
        existingChats={chats}
        isAr={isAr}
      />

      {/* Phone Authentication Modal (Modal mode for changing phone / linking) */}
      <PhoneAuthModal
        isOpen={showPhoneAuthModal}
        isModal={true}
        onClose={() => setShowPhoneAuthModal(false)}
        onSuccess={handlePhoneLoginSuccess}
        initialPhone={currentUser.phone}
        isAr={isAr}
      />

      {/* Phone Authentication Full-Screen Gate (when not logged in) */}
      {!isAuthenticated && (
        <PhoneAuthModal
          isOpen={true}
          isModal={false}
          onSuccess={handlePhoneLoginSuccess}
          isAr={isAr}
        />
      )}

      {/* Install, Download & Publish Modal */}
      <InstallPublishModal
        isOpen={showInstallPublishModal}
        onClose={() => setShowInstallPublishModal(false)}
        isAr={isAr}
      />

      {/* Offline Mode Indicator */}
      <OfflineIndicator isAr={isAr} />

      {/* Global Toast Notification */}
      {goldNoticeToast && (
        <div className="fixed bottom-6 start-1/2 -translate-x-1/2 z-50 bg-[#111b21] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#00a884]/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 text-sm">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{goldNoticeToast}</span>
        </div>
      )}
    </div>
  );
}
