import { UserState } from '@blue-orange-ai/foundations-clients';
import {
    IChatUser,
    IChatMessage,
    IChatConversation,
    IChatGroup,
    IChatReaction,
    ChatConversationType,
    ChatUserStatus
} from '../../interfaces/ChatInterfaces';

// ── Helper to build dates relative to now ──────────────────────────────

const now = new Date();
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60_000);
const hoursAgo = (h: number) => minutesAgo(h * 60);
const daysAgo = (d: number) => hoursAgo(d * 24);

// ── Mock Users ─────────────────────────────────────────────────────────

const baseUser = {
    avatar: undefined,
    telephone: undefined,
    address: undefined,
    created: daysAgo(90),
    lastActive: now,
    state: UserState.ACTIVE,
    forcePasswordReset: false,
    domain: 'blue-orange.ai',
    notes: '',
    serviceUser: false,
    defaultUser: false,
    emailVerified: true,
    phoneVerified: false,
    addressVerified: false,
};

export const currentUser: IChatUser = {
    user: {
        ...baseUser,
        id: 'u1',
        name: 'Alice Chen',
        username: 'alice.chen',
        email: 'alice.chen@blue-orange.ai',
        color: '#6366f1',
    },
    status: ChatUserStatus.ONLINE,
};

export const userBob: IChatUser = {
    user: {
        ...baseUser,
        id: 'u2',
        name: 'Bob Martinez',
        username: 'bob.martinez',
        email: 'bob.martinez@blue-orange.ai',
        color: '#f59e0b',
    },
    status: ChatUserStatus.ONLINE,
};

export const userCarla: IChatUser = {
    user: {
        ...baseUser,
        id: 'u3',
        name: 'Carla Johansson',
        username: 'carla.j',
        email: 'carla.johansson@blue-orange.ai',
        color: '#10b981',
    },
    status: ChatUserStatus.AWAY,
};

export const userDave: IChatUser = {
    user: {
        ...baseUser,
        id: 'u4',
        name: 'Dave Kim',
        username: 'dave.kim',
        email: 'dave.kim@blue-orange.ai',
        color: '#ef4444',
    },
    status: ChatUserStatus.DND,
};

export const userEva: IChatUser = {
    user: {
        ...baseUser,
        id: 'u5',
        name: 'Eva Rossi',
        username: 'eva.rossi',
        email: 'eva.rossi@blue-orange.ai',
        color: '#8b5cf6',
    },
    status: ChatUserStatus.OFFLINE,
};

export const userFrank: IChatUser = {
    user: {
        ...baseUser,
        id: 'u6',
        name: 'Frank Nguyen',
        username: 'frank.n',
        email: 'frank.nguyen@blue-orange.ai',
        color: '#0ea5e9',
    },
    status: ChatUserStatus.ONLINE,
    snoozeUntil: new Date(now.getTime() + 2 * 60 * 60_000), // snoozed for 2 hours
};

export const userGrace: IChatUser = {
    user: {
        ...baseUser,
        id: 'u7',
        name: 'Grace Okafor',
        username: 'grace.o',
        email: 'grace.okafor@blue-orange.ai',
        color: '#ec4899',
    },
    status: ChatUserStatus.AWAY,
};

export const userHenry: IChatUser = {
    user: {
        ...baseUser,
        id: 'u8',
        name: 'Henry Liu',
        username: 'henry.liu',
        email: 'henry.liu@blue-orange.ai',
        color: '#14b8a6',
        lastActive: daysAgo(3),
        state: UserState.INACTIVE,
    },
    status: ChatUserStatus.OFFLINE,
};

export const allUsers: IChatUser[] = [
    currentUser, userBob, userCarla, userDave, userEva, userFrank, userGrace, userHenry
];

// ── Mock Messages — #engineering channel ───────────────────────────────

export const engineeringMessages: IChatMessage[] = [
    {
        id: 'msg-1',
        content: 'Good morning everyone! Quick heads up: the CI pipeline is being upgraded this afternoon.',
        sender: userBob,
        timestamp: daysAgo(5),
        reactions: [{ emoji: '👍', userIds: ['u1', 'u3', 'u5'] }],
    },
    {
        id: 'msg-2',
        content: 'Thanks for the heads up. Will there be any downtime?',
        sender: userCarla,
        timestamp: daysAgo(5),
        reactions: [],
    },
    {
        id: 'msg-3',
        content: 'About 15 minutes max. I will post in <strong>#incidents</strong> if anything comes up.',
        sender: userBob,
        timestamp: daysAgo(5),
        reactions: [{ emoji: '🙏', userIds: ['u3'] }],
    },
    {
        id: 'msg-4',
        content: 'Has anyone looked at the new <code>@blue-orange-ai/foundations-core</code> release? The accordion component got a nice overhaul.',
        sender: userDave,
        timestamp: daysAgo(3),
        reactions: [
            { emoji: '🔥', userIds: ['u1', 'u2'] },
            { emoji: '👀', userIds: ['u5', 'u6'] },
        ],
    },
    {
        id: 'msg-5',
        content: 'Yeah I tested it locally. The animation is much smoother now.',
        sender: currentUser,
        timestamp: daysAgo(3),
        reactions: [],
    },
    {
        id: 'msg-6',
        content: '<em>Nice work team.</em> Merging the graph package update as well.',
        sender: userEva,
        timestamp: daysAgo(2),
        reactions: [],
    },
    {
        id: 'msg-7',
        content: 'Quick question: are we still using <code>elkjs</code> for all the layout work or switching to dagre?',
        sender: userFrank,
        timestamp: daysAgo(2),
        reactions: [],
    },
    {
        id: 'msg-8',
        content: 'Sticking with ELK. The layered algorithm handles our edge cases better.',
        sender: userDave,
        timestamp: daysAgo(2),
        reactions: [{ emoji: '✅', userIds: ['u6'] }],
        replyTo: undefined,
    },
    {
        id: 'msg-9',
        content: 'Reminder: sprint retro is at 3pm today. Please fill in the board beforehand.',
        sender: userGrace,
        timestamp: daysAgo(1),
        reactions: [],
    },
    {
        id: 'msg-10',
        content: 'Done! Added my items already.',
        sender: currentUser,
        timestamp: daysAgo(1),
        reactions: [],
    },
    {
        id: 'msg-11',
        content: 'I pushed a fix for the search filter rendering issue. PR is up for review: <strong>#1042</strong>',
        sender: userBob,
        timestamp: hoursAgo(4),
        reactions: [{ emoji: '🎉', userIds: ['u1', 'u3', 'u4', 'u7'] }],
    },
    {
        id: 'msg-12',
        content: 'Looking at it now. The approach looks clean.',
        sender: userCarla,
        timestamp: hoursAgo(3),
        reactions: [],
    },
    {
        id: 'msg-13',
        content: 'Approved and merged. Great turnaround!',
        sender: userCarla,
        timestamp: hoursAgo(2),
        reactions: [{ emoji: '🚀', userIds: ['u2'] }],
    },
    {
        id: 'msg-14',
        content: 'Is anyone free to pair on the chat layout component? I have the sidebar done but want a second pair of eyes on the split-panel logic.',
        sender: currentUser,
        timestamp: minutesAgo(45),
        reactions: [],
    },
    {
        id: 'msg-15',
        content: 'I can jump in after my 1:1. Give me about 20 minutes.',
        sender: userFrank,
        timestamp: minutesAgo(30),
        reactions: [{ emoji: '👍', userIds: ['u1'] }],
    },
    {
        id: 'msg-16',
        content: 'Perfect, ping me when you are ready.',
        sender: currentUser,
        timestamp: minutesAgo(28),
        reactions: [],
    },
];

// Wire up replyTo references
engineeringMessages[7].replyTo = engineeringMessages[6]; // msg-8 replies to msg-7
engineeringMessages[12].replyTo = engineeringMessages[10]; // msg-13 replies to msg-11

// ── Mock Messages — DM with Bob ────────────────────────────────────────

export const dmBobMessages: IChatMessage[] = [
    {
        id: 'dm-b-1',
        content: 'Hey Alice, did you see the latest design mockups?',
        sender: userBob,
        timestamp: daysAgo(1),
        reactions: [],
    },
    {
        id: 'dm-b-2',
        content: 'Yes! The new color palette looks great. I especially like the sidebar treatment.',
        sender: currentUser,
        timestamp: daysAgo(1),
        reactions: [{ emoji: '💜', userIds: ['u2'] }],
    },
    {
        id: 'dm-b-3',
        content: 'Agreed. I will set up a review session with the team tomorrow.',
        sender: userBob,
        timestamp: hoursAgo(6),
        reactions: [],
    },
    {
        id: 'dm-b-4',
        content: 'Sounds good. Let me know if you need anything from my side.',
        sender: currentUser,
        timestamp: hoursAgo(5),
        reactions: [],
    },
];

// ── Mock Messages — DM with Carla ──────────────────────────────────────

export const dmCarlaMessages: IChatMessage[] = [
    {
        id: 'dm-c-1',
        content: 'Hey, quick question about the deployment pipeline. Is the staging env up?',
        sender: userCarla,
        timestamp: hoursAgo(2),
        reactions: [],
    },
    {
        id: 'dm-c-2',
        content: 'Let me check... yes it is up and running the latest build.',
        sender: currentUser,
        timestamp: hoursAgo(1),
        reactions: [],
    },
];

// ── Mock Messages — Design Team channel ────────────────────────────────

export const designMessages: IChatMessage[] = [
    {
        id: 'des-1',
        content: 'Uploaded the new icon set to Figma. 48 icons covering all the navigation states.',
        sender: userGrace,
        timestamp: daysAgo(2),
        reactions: [{ emoji: '🎨', userIds: ['u1', 'u2', 'u4'] }],
    },
    {
        id: 'des-2',
        content: 'These look fantastic, Grace. The line weights are much more consistent now.',
        sender: userEva,
        timestamp: daysAgo(2),
        reactions: [],
    },
    {
        id: 'des-3',
        content: 'Can we get a dark-mode variant as well?',
        sender: userDave,
        timestamp: daysAgo(1),
        reactions: [],
    },
    {
        id: 'des-4',
        content: 'Already on it. Should have them by end of week.',
        sender: userGrace,
        timestamp: daysAgo(1),
        reactions: [{ emoji: '👏', userIds: ['u4', 'u5'] }],
    },
];

// ── Mock Thread Replies (for msg-11 in engineering) ────────────────────

export const threadRepliesForMsg11: IChatMessage[] = [
    {
        id: 'thread-1',
        content: 'Nice catch on the OR group edge case. That was tricky.',
        sender: userDave,
        timestamp: hoursAgo(3),
        reactions: [],
    },
    {
        id: 'thread-2',
        content: 'Yeah, the filter values were not updating when the last value in an OR group changed. Took a while to trace.',
        sender: userBob,
        timestamp: hoursAgo(3),
        reactions: [],
    },
    {
        id: 'thread-3',
        content: 'I added a regression test for it too. Should be covered now.',
        sender: userBob,
        timestamp: hoursAgo(2),
        reactions: [{ emoji: '✅', userIds: ['u4', 'u1'] }],
    },
    {
        id: 'thread-4',
        content: 'Great work. This was blocking a few users.',
        sender: currentUser,
        timestamp: hoursAgo(1),
        reactions: [],
    },
];

// ── Mock Conversations ─────────────────────────────────────────────────

export const convEngineering: IChatConversation = {
    id: 'conv-1',
    name: '#engineering',
    type: ChatConversationType.CHANNEL,
    members: [currentUser, userBob, userCarla, userDave, userEva, userFrank, userGrace],
    lastMessage: engineeringMessages[engineeringMessages.length - 1],
    unreadCount: 3,
    starred: true,
};

export const convDesign: IChatConversation = {
    id: 'conv-2',
    name: '#design-team',
    type: ChatConversationType.CHANNEL,
    members: [currentUser, userGrace, userEva, userDave],
    lastMessage: designMessages[designMessages.length - 1],
    unreadCount: 0,
    starred: false,
};

export const convGeneral: IChatConversation = {
    id: 'conv-3',
    name: '#general',
    type: ChatConversationType.CHANNEL,
    members: allUsers,
    lastMessage: undefined,
    unreadCount: 12,
    starred: false,
};

export const convDmBob: IChatConversation = {
    id: 'conv-4',
    name: 'Bob Martinez',
    type: ChatConversationType.DM,
    members: [currentUser, userBob],
    lastMessage: dmBobMessages[dmBobMessages.length - 1],
    unreadCount: 1,
    starred: false,
};

export const convDmCarla: IChatConversation = {
    id: 'conv-5',
    name: 'Carla Johansson',
    type: ChatConversationType.DM,
    members: [currentUser, userCarla],
    lastMessage: dmCarlaMessages[dmCarlaMessages.length - 1],
    unreadCount: 0,
    starred: false,
    typingUsers: [userCarla],
};

export const convDmDave: IChatConversation = {
    id: 'conv-6',
    name: 'Dave Kim',
    type: ChatConversationType.DM,
    members: [currentUser, userDave],
    lastMessage: undefined,
    unreadCount: 0,
    starred: true,
};

export const allConversations: IChatConversation[] = [
    convEngineering, convDesign, convGeneral, convDmBob, convDmCarla, convDmDave
];

// ── Message lookup by conversation ─────────────────────────────────────

export const messagesByConversation: Record<string, IChatMessage[]> = {
    'conv-1': engineeringMessages,
    'conv-2': designMessages,
    'conv-3': [],
    'conv-4': dmBobMessages,
    'conv-5': dmCarlaMessages,
    'conv-6': [],
};

// ── Mock Groups ────────────────────────────────────────────────────────

export const mockGroups: IChatGroup[] = [
    {
        label: 'Starred',
        conversations: allConversations.filter(c => c.starred),
        collapsed: false,
        icon: 'ri-star-fill',
    },
    {
        label: 'Channels',
        conversations: [convEngineering, convDesign, convGeneral],
        collapsed: false,
        icon: 'ri-hashtag',
    },
    {
        label: 'Direct Messages',
        conversations: [convDmBob, convDmCarla, convDmDave],
        collapsed: false,
        icon: 'ri-chat-1-line',
    },
    {
        label: 'Teams',
        conversations: [],
        collapsed: true,
        icon: 'ri-team-line',
    },
];
