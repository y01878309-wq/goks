import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Send, ArrowDownLeft, HardDrive, FileText, BarChart3, Image, Mic, MessageSquare, BarChart2, MapPin } from 'lucide-react';
import { Message, Chat } from '../types';

interface UsageStatisticsProps {
  messages: Record<string, Message[]>;
  chats: Chat[];
  isAr?: boolean;
}

const COLORS = [
  '#00a884', // Green (Text)
  '#a855f7', // Purple (Image)
  '#3b82f6', // Blue (Voice)
  '#eab308', // Yellow (Document)
  '#f97316', // Orange (Poll)
  '#10b981', // Emerald (Location)
  '#ec4899', // Pink (Other)
];

export const UsageStatistics: React.FC<UsageStatisticsProps> = ({
  messages,
  chats,
  isAr = true,
}) => {
  const stats = useMemo(() => {
    let sentCount = 0;
    let receivedCount = 0;

    const mediaCounts: Record<string, number> = {
      text: 0,
      image: 0,
      voice: 0,
      document: 0,
      poll: 0,
      location: 0,
    };

    const chatActivity: Record<string, { name: string; sent: number; received: number }> = {};

    // Initialize all chat activity records
    chats.forEach((chat) => {
      chatActivity[chat.id] = {
        name: chat.name,
        sent: 0,
        received: 0,
      };
    });

    Object.entries(messages).forEach(([chatId, msgList]) => {
      msgList.forEach((msg) => {
        const isSent = msg.senderId === 'me';
        if (isSent) {
          sentCount++;
        } else {
          receivedCount++;
        }

        // Tally media type
        const type = msg.type || 'text';
        if (mediaCounts[type] !== undefined) {
          mediaCounts[type]++;
        } else {
          mediaCounts[type] = (mediaCounts[type] || 0) + 1;
        }

        // Tally chat activity
        if (chatActivity[chatId]) {
          if (isSent) {
            chatActivity[chatId].sent++;
          } else {
            chatActivity[chatId].received++;
          }
        }
      });
    });

    const totalMessages = sentCount + receivedCount;

    // Format media distribution data for Pie Chart
    const mediaLabelsAr: Record<string, string> = {
      text: 'رسائل نصية',
      image: 'صور وفيديو',
      voice: 'رسائل صوتية',
      document: 'مستندات',
      poll: 'استطلاعات رأي',
      location: 'مواقع جغرافية',
    };

    const mediaLabelsEn: Record<string, string> = {
      text: 'Text',
      image: 'Photos & Videos',
      voice: 'Voice Notes',
      document: 'Documents',
      poll: 'Polls',
      location: 'Locations',
    };

    const mediaData = Object.entries(mediaCounts)
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => ({
        name: isAr ? mediaLabelsAr[type] || type : mediaLabelsEn[type] || type,
        rawType: type,
        count,
        percentage: totalMessages > 0 ? ((count / totalMessages) * 100).toFixed(1) : '0',
      }));

    // Data for Sent vs Received Bar Chart
    const comparisonData = [
      {
        name: isAr ? 'الرسائل الصادرة' : 'Sent Messages',
        value: sentCount,
        fill: '#00a884',
      },
      {
        name: isAr ? 'الرسائل الواردة' : 'Received Messages',
        value: receivedCount,
        fill: '#3b82f6',
      },
    ];

    // Top active chats by message volume
    const topChatsData = Object.values(chatActivity)
      .map((c) => ({
        ...c,
        total: c.sent + c.received,
        displayName: c.name.length > 12 ? `${c.name.slice(0, 10)}...` : c.name,
      }))
      .filter((c) => c.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return {
      sentCount,
      receivedCount,
      totalMessages,
      mediaCounts,
      mediaData,
      comparisonData,
      topChatsData,
    };
  }, [messages, chats, isAr]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top 3 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#f0f2f5] dark:bg-[#111b21] border border-black/5 dark:border-white/5 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#00a884]/15 text-[#00a884] flex items-center justify-center shrink-0">
            <Send className="w-5 h-5 -rotate-45" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-[#8696a0] block truncate">
              {isAr ? 'الرسائل المرسلة (الصادرة)' : 'Messages Sent'}
            </span>
            <div className="text-xl font-bold text-[#111b21] dark:text-[#f4f4f5]">
              {stats.sentCount.toLocaleString()}
            </div>
            <span className="text-[10px] text-[#00a884] font-medium">
              {stats.totalMessages > 0
                ? `${((stats.sentCount / stats.totalMessages) * 100).toFixed(0)}% ${isAr ? 'من الإجمالي' : 'of total'}`
                : '0%'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#f0f2f5] dark:bg-[#111b21] border border-black/5 dark:border-white/5 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center shrink-0">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-[#8696a0] block truncate">
              {isAr ? 'الرسائل المستلمة (الواردة)' : 'Messages Received'}
            </span>
            <div className="text-xl font-bold text-[#111b21] dark:text-[#f4f4f5]">
              {stats.receivedCount.toLocaleString()}
            </div>
            <span className="text-[10px] text-blue-500 font-medium">
              {stats.totalMessages > 0
                ? `${((stats.receivedCount / stats.totalMessages) * 100).toFixed(0)}% ${isAr ? 'من الإجمالي' : 'of total'}`
                : '0%'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#f0f2f5] dark:bg-[#111b21] border border-black/5 dark:border-white/5 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-[#8696a0] block truncate">
              {isAr ? 'إجمالي حركة الرسائل' : 'Total Traffic'}
            </span>
            <div className="text-xl font-bold text-[#111b21] dark:text-[#f4f4f5]">
              {stats.totalMessages.toLocaleString()}
            </div>
            <span className="text-[10px] text-purple-500 font-medium">
              {chats.length} {isAr ? 'محادثة نشطة' : 'active chats'}
            </span>
          </div>
        </div>
      </div>

      {/* Chart 1: Sent vs Received Comparison */}
      <div className="p-4 rounded-2xl bg-[#f0f2f5] dark:bg-[#111b21] border border-black/5 dark:border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-[#111b21] dark:text-[#e9edef] flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#00a884]" />
            <span>{isAr ? 'مقارنة الرسائل المرسلة مقابل المستلمة' : 'Sent vs Received Comparison'}</span>
          </h4>
          <span className="text-[11px] text-[#8696a0]">
            {isAr ? 'إجمالي:' : 'Total:'} {stats.totalMessages}
          </span>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.comparisonData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <XAxis type="number" stroke="#8696a0" fontSize={11} tickLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#8696a0"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={120}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  borderColor: '#374151',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                {stats.comparisonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Media Types Distribution Pie Chart */}
      <div className="p-4 rounded-2xl bg-[#f0f2f5] dark:bg-[#111b21] border border-black/5 dark:border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-[#111b21] dark:text-[#e9edef] flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-500" />
            <span>{isAr ? 'توزيع أنواع الوسائط والرسائل (Media Types)' : 'Media Types Distribution'}</span>
          </h4>
          <span className="text-[11px] text-[#8696a0]">
            {stats.mediaData.length} {isAr ? 'تصنيفات' : 'categories'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Pie Chart */}
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.mediaData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {stats.mediaData.map((_, index) => (
                    <Cell key={`media-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [`${value} (${isAr ? 'رسالة' : 'msgs'})`, name]}
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    borderColor: '#374151',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Breakdown Badges */}
          <div className="space-y-2">
            {stats.mediaData.map((item, index) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-xs p-2 rounded-xl bg-white/60 dark:bg-black/20 border border-black/5 dark:border-white/5"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-medium text-[#111b21] dark:text-[#e9edef]">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#111b21] dark:text-white">{item.count}</span>
                  <span className="text-[10px] text-[#8696a0] font-semibold w-10 text-end">
                    ({item.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart 3: Most Active Chats breakdown */}
      {stats.topChatsData.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#f0f2f5] dark:bg-[#111b21] border border-black/5 dark:border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#111b21] dark:text-[#e9edef] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <span>{isAr ? 'أكثر المحادثات تفاعلاً' : 'Most Active Conversations'}</span>
            </h4>
            <span className="text-[11px] text-[#8696a0]">
              {isAr ? 'أعلى 5 محادثات' : 'Top 5'}
            </span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.topChatsData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="displayName" stroke="#8696a0" fontSize={11} tickLine={false} />
                <YAxis stroke="#8696a0" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    borderColor: '#374151',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                  formatter={(value) => (value === 'sent' ? (isAr ? 'مرسلة' : 'Sent') : (isAr ? 'مستلمة' : 'Received'))}
                />
                <Bar dataKey="sent" name="sent" fill="#00a884" stackId="a" radius={[0, 0, 4, 4]} />
                <Bar dataKey="received" name="received" fill="#3b82f6" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
